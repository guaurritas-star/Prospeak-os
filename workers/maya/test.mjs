import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './src/index.js';

const origin='https://guaurritas-star.github.io';
const root='https://prospeak-maya-api.example.workers.dev';
const env=(extra={})=>({
  MAYA_ENABLED:'true',
  GEMINI_API_KEY:'fake-private-key',
  TURNSTILE_SECRET_KEY:'fake-turnstile-key',
  ALLOWED_ORIGIN:origin,
  GEMINI_MODEL:'gemini-3.5-flash-lite',
  MAYA_LIMITER:{limit:async()=>({success:true})},
  MAYA_GLOBAL_LIMITER:{limit:async()=>({success:true})},
  ...extra,
});
const request=(path,body,otherOrigin=origin,ip='203.0.113.1')=>new Request(root+path,{
  method:'POST',headers:{Origin:otherOrigin,'Content-Type':'application/json','CF-Connecting-IP':ip},
  body:JSON.stringify(body),
});
const get=(path,otherOrigin=origin)=>new Request(root+path,{headers:{Origin:otherOrigin}});
const message={messages:[{role:'user',text:'I work in marketing. Can we practice speaking?'}]};
const withStub=async (stub,run)=>{
  const original=globalThis.fetch;
  globalThis.fetch=stub;
  try{return await run();}finally{globalThis.fetch=original;}
};
test('rejects other origins before checking the AI key',async()=>{
  const response=await worker.fetch(get('/api/status','https://attacker.example'),env());
  assert.equal(response.status,403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
});
test('shows guided mode while Gemini is disabled',async()=>{
  const response=await worker.fetch(get('/api/status'),env({MAYA_ENABLED:'false'}));
  assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{ready:false,mode:'guided'});
});
test('requires Turnstile once to begin a conversation',async()=>{
  const response=await worker.fetch(request('/api/session',{turnstileToken:''}),env());
  assert.equal(response.status,400);
});
test('blocks verification from the wrong hostname',async()=>{
  await withStub(async()=>Response.json({success:true,hostname:'attacker.example',action:'maya_chat'}),async()=>{
    const response=await worker.fetch(request('/api/session',{turnstileToken:'fake'}),env());
    assert.equal(response.status,403);
  });
});
test('prevents chats without a signed session',async()=>{
  const response=await worker.fetch(request('/api/chat',{sessionToken:'invalid',...message}),env());
  assert.equal(response.status,401);
  assert.equal((await response.json()).code,'SESSION_EXPIRED');
});
test('per-IP and shared limits both apply before Turnstile and Gemini',async()=>{
  const ipLimited=await worker.fetch(request('/api/session',{turnstileToken:'fake'}),env({
    MAYA_LIMITER:{limit:async()=>({success:false})}
  }));
  assert.equal(ipLimited.status,429);
  const sharedLimited=await worker.fetch(request('/api/session',{turnstileToken:'fake'}),env({
    MAYA_GLOBAL_LIMITER:{limit:async()=>({success:false})}
  }));
  assert.equal(sharedLimited.status,429);
});
test('validated session works for multiple messages without another Turnstile challenge',async()=>{
  let challenges=0,modelRequests=0;
  await withStub(async (target,init)=>{
    if(String(target).includes('siteverify')){
      challenges++;
      assert.match(String(init.body),/secret=/);
      return Response.json({success:true,hostname:'guaurritas-star.github.io',action:'maya_chat'});
    }
    modelRequests++;
    const body=JSON.parse(init.body);
    assert.match(body.systemInstruction.parts[0].text,/actual message/);
    assert.equal(body.generationConfig.thinkingConfig,undefined);
    assert.equal(body.generationConfig.maxOutputTokens,900);
    assert.match(String(target),/gemini-3\.5-flash-lite/);
    assert.equal(init.headers['x-goog-api-key'],'fake-private-key');
    return Response.json({candidates:[{content:{parts:[{text:'That sounds great! What kind of clients do you work with?'}]}}]});
  },async()=>{
    const session=await worker.fetch(request('/api/session',{turnstileToken:'fake'}),env());
    assert.equal(session.status,200);
    const {token,expiresIn}=await session.json();
    assert.equal(expiresIn,1200);
    for(let i=0;i<2;i++){
      const answer=await worker.fetch(request('/api/chat',{...message,sessionToken:token}),env());
      assert.equal(answer.status,200);
      assert.match((await answer.json()).reply,/clients/);
    }
  });
  assert.equal(challenges,1);
  assert.equal(modelRequests,2);
});
test('signed sessions are bound to the original IP',async()=>{
  await withStub(async()=>Response.json({success:true,hostname:'guaurritas-star.github.io',action:'maya_chat'}),async()=>{
    const session=await worker.fetch(request('/api/session',{turnstileToken:'valid'}),env());
    const {token}=await session.json();
    const failed=await worker.fetch(request('/api/chat',{sessionToken:token,...message},origin,'203.0.113.2'),env());
    assert.equal(failed.status,401);
  });
});

test('Gemini provider status returns a safe and helpful diagnostic without leaking secrets',async()=>{
  const scenarios=[
    [400,'GEMINI_BAD_REQUEST'],
    [401,'GEMINI_AUTH'],
    [403,'GEMINI_PERMISSION'],
    [404,'GEMINI_MODEL'],
    [429,'GEMINI_QUOTA'],
    [503,'GEMINI_UPSTREAM'],
  ];
  const originalWarn=console.warn;
  console.warn=()=>{};
  try {
    for(const [status,expectedCode] of scenarios){
      await withStub(async target=>{
        if(String(target).includes('siteverify'))return Response.json({success:true,hostname:'guaurritas-star.github.io',action:'maya_chat'});
        return Response.json({error:{status:'SAMPLE',message:'private-placeholder'}},{status});
      },async()=>{
        const session=await worker.fetch(request('/api/session',{turnstileToken:'fake'}),env());
        const {token}=await session.json();
        const response=await worker.fetch(request('/api/chat',{...message,sessionToken:token}),env());
        assert.equal(response.status,502);
        const data=await response.json();
        assert.equal(data.code,expectedCode);
        assert.equal(data.error.includes('private-placeholder'),false);
      });
    }
  }finally{console.warn=originalWarn;}
});
