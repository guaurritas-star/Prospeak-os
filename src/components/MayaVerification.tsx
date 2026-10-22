import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (target: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<void> | null = null;
function loadTurnstile(): Promise<void> {
  if(window.turnstile)return Promise.resolve();
  if(!loading){
    loading = new Promise<void>((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=SCRIPT_URL;
      script.async=true;
      script.onload=()=>window.turnstile?resolve():reject(new Error('Verification did not load'));
      script.onerror=()=>reject(new Error('Verification could not load'));
      document.head.appendChild(script);
    }).catch(error=>{loading=null;throw error;});
  }
  return loading;
}

export function MayaVerification({siteKey,onToken,refreshKey}:{
  siteKey:string;
  onToken:(token:string)=>void;
  refreshKey:number;
}) {
  const host=useRef<HTMLDivElement>(null);
  const [error,setError]=useState('');
  useEffect(()=>{
    let mounted=true;
    let widgetId:string|null=null;
    onToken('');
    setError('');
    loadTurnstile().then(()=>{
      if(!mounted||!host.current||!window.turnstile)return;
      widgetId=window.turnstile.render(host.current,{
        sitekey:siteKey,
        action:'maya_chat',
        callback:(value:unknown)=>{if(mounted&&typeof value==='string')onToken(value);},
        'expired-callback':()=>{if(mounted)onToken('');},
        'error-callback':()=>{if(mounted){onToken('');setError('Verification failed. Please reload Messenger.');}},
      });
    }).catch(()=>{if(mounted)setError('Verification is unavailable. Please reload Messenger.');});
    return ()=>{
      mounted=false;
      if(widgetId&&window.turnstile){
        try {window.turnstile.remove(widgetId);}catch{/* cleanup only */}
      }
    };
  },[siteKey,refreshKey]);
  return <div className="px-3 py-2 border-t border-[#DFE9EE] bg-[#F2F7F9]" aria-label="Anti-abuse verification">
    <div ref={host}/>
    {error && <p role="alert" className="text-sm text-[#964F64]">{error}</p>}
    <p className="text-[11px] text-[#59727B] mt-1">Verification is required to protect the class pilot from automated use.</p>
  </div>;
}
