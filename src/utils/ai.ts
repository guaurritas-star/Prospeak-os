/** Gemini never receives a browser-stored API key. Only Cloudflare has secrets. */
import type { ChatMessage } from '../types/os';
const apiUrl = (import.meta.env.VITE_AI_API_URL || 'https://prospeak-maya-api.studiomxcandy.workers.dev/api/chat').trim();
export const mayaTurnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const isHttps = /^https:\/\/[a-z0-9.-]+\/api\/chat$/i.test(apiUrl);
export const isMayaAIConfigured = isHttps && mayaTurnstileSiteKey.length > 0;
const endpoint = (action:'status'|'session'|'chat') => apiUrl.replace(/\/api\/chat$/, '/api/'+action);

type ApiError = {error?:unknown;code?:unknown};
async function parseResponse(response:Response):Promise<Record<string,unknown>>{
  const value:unknown=await response.json().catch(()=>({}));
  if(!response.ok){
    const result=value as ApiError;
    const error=new Error(typeof result.error==='string'?result.error.slice(0,180):'Maya is unavailable.');
    if(result.code==='SESSION_EXPIRED')error.name='SessionExpiredError';
    throw error;
  }
  return (value&&typeof value==='object'&&!Array.isArray(value))?value as Record<string,unknown>:{};
}
export async function getMayaStatus(signal?:AbortSignal):Promise<boolean>{
  if(!isMayaAIConfigured)return false;
  const response=await fetch(endpoint('status'),{headers:{Accept:'application/json'},cache:'no-store',signal});
  const data=await parseResponse(response);
  return data.ready===true;
}
export async function startMayaSession(turnstileToken:string,signal?:AbortSignal):Promise<{token:string;expiresIn:number}>{
  if(!isMayaAIConfigured)throw new Error('Maya AI is not configured yet.');
  const response=await fetch(endpoint('session'),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({turnstileToken}),signal,
  });
  const data=await parseResponse(response);
  if(typeof data.token!=='string'||typeof data.expiresIn!=='number')throw new Error('Could not start a protected session.');
  return {token:data.token,expiresIn:data.expiresIn};
}
export async function askMaya(messages:ChatMessage[],sessionToken:string,signal?:AbortSignal):Promise<string>{
  if(!isMayaAIConfigured)throw new Error('Maya AI is not configured yet.');
  const history=messages.slice(-12).filter(x=>x.sender==='user'||x.sender==='maya')
    .map(x=>({role:x.sender==='maya'?'model':'user',text:x.text.slice(0,1000)}));
  while(history[0]?.role==='model')history.shift();
  const response=await fetch(endpoint('chat'),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({messages:history,sessionToken}),signal,
  });
  const data=await parseResponse(response);
  if(typeof data.reply!=='string')throw new Error('Maya could not answer this message.');
  return data.reply.slice(0,1800);
}
