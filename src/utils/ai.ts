/** Safe browser transport: the browser never receives a Gemini API key. */
import type { ChatMessage } from '../types/os';
const configuredUrl = (import.meta.env.VITE_AI_API_URL || '').trim();
export const isMayaAIConfigured = configuredUrl.length > 0 || (typeof window !== 'undefined' && !window.location.hostname.endsWith('github.io') && !!import.meta.env.VITE_AI_SAME_ORIGIN);
export async function askMaya(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
  if (!isMayaAIConfigured) throw new Error('AI endpoint is not configured.');
  const target = configuredUrl || '/api/chat';
  const history = messages.slice(-12).filter(x=>x.sender==='user'||x.sender==='maya')
    .map(x=>({role:x.sender==='maya'?'model':'user',text:x.text.slice(0,1000)}));
  const response = await fetch(target, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history}),signal});
  const result: {reply?:unknown;error?:unknown} = await response.json().catch(()=>({}));
  if (!response.ok || typeof result.reply !== 'string') {
    throw new Error(typeof result.error === 'string' ? result.error.slice(0,180) : 'Maya is unavailable. Try again later.');
  }
  return result.reply.slice(0,1500);
}
