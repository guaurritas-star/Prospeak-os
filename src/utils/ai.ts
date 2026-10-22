/** GitHub Pages is static. Secrets remain in the Cloudflare Worker. */
import type { ChatMessage } from '../types/os';

const configuredUrl = (import.meta.env.VITE_AI_API_URL || '').trim();
export const mayaTurnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
const isSecureWorkerEndpoint = /^https:\/\/[a-z0-9.-]+\.workers\.dev\/api\/chat$/i.test(configuredUrl) ||
  /^https:\/\/[a-z0-9.-]+\/api\/chat$/i.test(configuredUrl);

export const isMayaAIConfigured = isSecureWorkerEndpoint && mayaTurnstileSiteKey.length > 0;

export async function askMaya(messages: ChatMessage[], credentials: {
  turnstileToken: string;
}, signal?: AbortSignal): Promise<string> {
  if (!isMayaAIConfigured) throw new Error('Maya AI is not configured yet.');
  const history = messages.slice(-12).filter(x=>x.sender==='user'||x.sender==='maya')
    .map(x=>({role:x.sender==='maya'?'model':'user',text:x.text.slice(0,1000)}));
  // The scripted greeting is UI scaffolding, not conversation history.
  while(history[0]?.role==='model')history.shift();
  const response = await fetch(configuredUrl,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({messages:history,turnstileToken:credentials.turnstileToken}),
    signal,
  });
  const result: {reply?:unknown;error?:unknown} = await response.json().catch(()=>({}));
  if(!response.ok || typeof result.reply!=='string'){
    throw new Error(typeof result.error==='string'?result.error.slice(0,180):'Maya is unavailable. Please try again.');
  }
  return result.reply.slice(0,1500);
}
