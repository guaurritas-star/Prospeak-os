import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './src/index.js';

const origin='https://guaurritas-star.github.io';
const url='https://prospeak-maya-api.example.workers.dev/api/chat';
const env=(extras={})=>({
  MAYA_ENABLED:'true',
  PILOT_ACCESS_CODE:'a-fake-very-long-test-code',
  GEMINI_API_KEY:'test-secret-never-use',
  TURNSTILE_SECRET_KEY:'turnstile-test-secret',
  ALLOWED_ORIGIN:origin,
  GEMINI_MODEL:'gemini-2.5-flash',
  MAYA_LIMITER:{limit:async()=>({success:true})},
  ...extras,
});
const message={accessCode:'a-fake-very-long-test-code',turnstileToken:'test-token',
  messages:[{role:'user',text:'Hello Maya. I work in marketing.'}]};
const request=(body=message,originHeader=origin)=>new Request(url,{
  method:'POST',headers:{Origin:originHeader,'Content-Type':'application/json'},
  body:JSON.stringify(body),
});
test('worker rejects unauthorized origins before spending money',async()=>{
  const result=await worker.fetch(request(message,'https://other.example'),env());
  assert.equal(result.status,403);
  assert.equal(result.headers.get('access-control-allow-origin'),null);
});
test('worker defaults to disabled before Cloudflare secrets are configured',async()=>{
  const result=await worker.fetch(request(),env({MAYA_ENABLED:'false'}));
  assert.equal(result.status,503);
});
test('worker rejects invalid pilot code',async()=>{
  const result=await worker.fetch(request({...message,accessCode:'wrong-code'}),env());
  assert.equal(result.status,403);
});
test('worker requires verification token and valid messages',async()=>{
  const result=await worker.fetch(request({...message,turnstileToken:''}),env());
  assert.equal(result.status,400);
  const invalid=await worker.fetch(request({...message,messages:[{role:'x',text:'Hi'}]}),env());
  assert.equal(invalid.status,400);
});
test('worker enforces rate limit before Gemini and Turnstile',async()=>{
  const result=await worker.fetch(request(),env({MAYA_LIMITER:{limit:async()=>({success:false})}}));
  assert.equal(result.status,429);
});
test('only a valid Turnstile token permits a Gemini call',async()=>{
  const previous=globalThis.fetch;
  let calls=0;
  globalThis.fetch=async (target,init)=>{
    calls++;
    if(String(target).includes('siteverify')){
      assert.match(String(init.body),/secret=/);
      return Response.json({success:true,hostname:'guaurritas-star.github.io',action:'maya_chat'});
    }
    assert.match(String(target),/generateContent$/);
    assert.equal(init.headers['x-goog-api-key'],'test-secret-never-use');
    return Response.json({candidates:[{content:{parts:[{text:'Hello! What kind of campaigns do you work on?'}]}}]});
  };
  try {
    const result=await worker.fetch(request(),env());
    assert.equal(result.status,200);
    assert.equal((await result.json()).reply,'Hello! What kind of campaigns do you work on?');
    assert.equal(calls,2);
  }finally{globalThis.fetch=previous;}
});
test('a Turnstile token for another hostname is refused',async()=>{
  const previous=globalThis.fetch;
  let calls=0;
  globalThis.fetch=async()=>{
    calls++;
    return Response.json({success:true,hostname:'attacker.example',action:'maya_chat'});
  };
  try{
    const result=await worker.fetch(request(),env());
    assert.equal(result.status,403);
    assert.equal(calls,1);
  }finally{globalThis.fetch=previous;}
});
