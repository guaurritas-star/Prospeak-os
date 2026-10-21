import React, { useId } from 'react';

/* Custom ProSpeak icon family: scalable vector interpretations of the eight
   approved retro-3D illustrations. No system emojis or external font needed. */
export type ProSpeakIconName = 'mission'|'inbox'|'messenger'|'speaking'|'progress'|'career'|'settings'|'challenge';
const labels: Record<ProSpeakIconName,string> = {
  mission:'Mission',inbox:'Inbox',messenger:'Messenger',speaking:'Speaking Lab',
  progress:'My Progress',career:'Career Paths',settings:'Settings',challenge:'Challenges'
};
export const iconForWindow = (id:string):ProSpeakIconName =>
  (['mission','inbox','messenger','speaking','progress','career','settings','challenge'].includes(id)
    ? id as ProSpeakIconName : 'mission');

export function ProSpeakIcon({name,size=32,decorative=true,className=''}:{
  name:ProSpeakIconName;size?:number;decorative?:boolean;className?:string;
}) {
  const uid=useId().replace(/:/g,'');
  const color=(n:string)=>'url(#'+uid+'-'+n+')';
  const pink=color('pink'),blue=color('blue'),teal=color('teal'),sage=color('sage'),cream=color('cream');
  return <svg viewBox="0 0 64 64" width={size} height={size} className={'inline-block shrink-0 '+className}
    role={decorative?undefined:'img'} aria-hidden={decorative?true:undefined}
    aria-label={decorative?undefined:labels[name]} focusable="false">
    <defs>
      <linearGradient id={uid+'-pink'} x2="1" y2="1"><stop stopColor="#F9CFD5"/><stop offset="1" stopColor="#BB758B"/></linearGradient>
      <linearGradient id={uid+'-blue'} x2="1" y2="1"><stop stopColor="#C3E5F2"/><stop offset="1" stopColor="#659FB9"/></linearGradient>
      <linearGradient id={uid+'-teal'} x2="1" y2="1"><stop stopColor="#557D8B"/><stop offset="1" stopColor="#183E4D"/></linearGradient>
      <linearGradient id={uid+'-sage'} x2="1" y2="1"><stop stopColor="#D9E3C4"/><stop offset="1" stopColor="#809F88"/></linearGradient>
      <linearGradient id={uid+'-cream'} x2="1" y2="1"><stop stopColor="#FFFFF2"/><stop offset="1" stopColor="#E7DAC4"/></linearGradient>
      <filter id={uid+'-shadow'} x="-30%" y="-30%" width="165%" height="175%">
        <feDropShadow dx=".7" dy="2" stdDeviation="1.7" floodColor="#1E4451" floodOpacity=".26"/>
      </filter>
    </defs>
    <g filter={'url(#'+uid+'-shadow)'}>
      {name==='mission' && <>
        <circle cx="29" cy="33" r="24" fill={teal}/><circle cx="29" cy="32" r="20" fill={cream}/>
        <circle cx="29" cy="32" r="15" fill={blue}/><circle cx="29" cy="32" r="10" fill={sage}/><circle cx="29" cy="32" r="5" fill={pink}/>
        <path d="M30 30 50 12" stroke="#315663" strokeWidth="5" strokeLinecap="round"/>
        <path d="m51 1 3.5 7 7.5 1-5.5 5.5 1.3 7.6-6.8-3.5-6.7 3.5 1.3-7.6-5.6-5.5 7.7-1Z" fill={pink}/>
      </>}
      {name==='inbox' && <>
        <path d="M9 24h46l5 14v13a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V38Z" fill={teal}/>
        <rect x="16" y="10" width="33" height="31" rx="4" fill={sage} transform="rotate(-8 32 25)"/>
        <rect x="18" y="14" width="34" height="29" rx="4" fill={blue} transform="rotate(5 35 28)"/>
        <rect x="12" y="18" width="42" height="27" rx="4" fill={cream}/>
        <path d="m12 20 21 17 21-17" fill={pink} stroke="#B9778B" strokeWidth="1.5"/>
        <path d="M4 37h56l-7 11H41l-4 5H26l-4-5H11Z" fill={blue}/>
      </>}
      {name==='messenger' && <>
        <path d="M6 11Q6 5 13 5H41Q50 5 50 13V34Q50 41 41 41H21L11 49V40Q6 38 6 32Z" fill={pink}/>
        <path d="M21 29Q21 21 30 21H52Q60 21 60 30V44Q60 51 51 51H44L52 60 35 51H30Q21 51 21 44Z" fill={blue}/>
        {[19,28,37].map(x=><circle key={'a'+x} cx={x} cy="23" r="2.6" fill="#FFF9E7"/>)}
        {[34,42,50].map(x=><circle key={'b'+x} cx={x} cy="37" r="2.6" fill="#FFF9E7"/>)}
      </>}
      {name==='speaking' && <>
        <path d="M8 26C1 30 1 39 8 43M56 26c7 4 7 13 0 17" fill="none" stroke={blue} strokeWidth="4" strokeLinecap="round"/>
        <path d="M14 29c-4 3-4 8 0 11M50 29c4 3 4 8 0 11" fill="none" stroke={sage} strokeWidth="4" strokeLinecap="round"/>
        <rect x="20" y="3" width="24" height="40" rx="12" fill={pink}/>
        {[15,21,27].map(y=><rect key={y} x="25" y={y} width="14" height="3" rx="1.5" fill="#294653"/>)}
        <path d="M17 31v6q0 16 15 16t15-16v-6" fill="none" stroke="#335968" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M32 53v5M22 60h20" stroke="#294E5A" strokeWidth="4" strokeLinecap="round"/>
      </>}
      {name==='progress' && <>
        <rect x="5" y="50" width="53" height="7" rx="3" fill={teal}/>
        <rect x="9" y="38" width="10" height="12" rx="3" fill={pink}/>
        <rect x="21" y="30" width="10" height="20" rx="3" fill={cream}/>
        <rect x="33" y="21" width="10" height="29" rx="3" fill={sage}/>
        <rect x="45" y="14" width="10" height="36" rx="3" fill={blue}/>
        <path d="M9 31Q30 23 47 6m-5-1 13-2-4 13" fill="none" stroke="#CB8B9C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="49" cy="48" r="12" fill={cream} stroke="#2C5563" strokeWidth="4"/>
        <path d="m43 48 4 4 8-9" fill="none" stroke="#315C67" strokeWidth="3.8" strokeLinecap="round"/>
      </>}
      {name==='career' && <>
        <rect x="7" y="19" width="49" height="34" rx="7" fill={teal}/>
        <path d="M24 20v-6a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v6" fill="none" stroke="#335D6A" strokeWidth="5.5"/>
        <path d="M7 26q24 17 49 0v-4q0-4-5-4H12q-5 0-5 4Z" fill={pink}/>
        <rect x="28" y="30" width="9" height="8" rx="2" fill={cream}/>
        <path d="M12 58q6-11 17-9t13-12l12-7" fill="none" stroke={cream} strokeWidth="6" strokeLinecap="round"/>
        <path d="m47 30 9-4-1 10" fill="none" stroke={blue} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="15" cy="55" r="3" fill={pink}/><circle cx="31" cy="49" r="3" fill={blue}/>
      </>}
      {name==='settings' && <>
        <path d="M31 3 36 8 42 6 46 12 52 14 51 21 57 26 54 33 57 40 51 45 52 52 45 54 40 60 33 57 26 60 21 54 14 52 15 45 9 40 12 33 9 26 15 21 14 14 21 12 25 6Z" fill={pink} transform="translate(-5 -1) scale(.88)"/>
        <circle cx="26" cy="28" r="13" fill={teal}/><circle cx="26" cy="28" r="7" fill={cream}/>
        <rect x="28" y="27" width="33" height="29" rx="6" fill={cream} stroke="#D5C6B9"/>
        {[35,42,49].map((y,i)=><g key={y}><rect x="33" y={y} width="23" height="3" rx="1.5" fill="#315766"/><circle cx={[48,39,50][i]} cy={y+1.5} r="4" fill={[pink,blue,sage][i]}/></g>)}
      </>}
      {name==='challenge' && <>
        <rect x="6" y="9" width="45" height="48" rx="6" fill={teal}/>
        <rect x="11" y="12" width="35" height="39" rx="4" fill={cream}/>
        <rect x="22" y="5" width="18" height="11" rx="5" fill={pink}/>
        {[24,34,44].map(y=><g key={y}><circle cx="19" cy={y} r="4" fill={sage}/><path d={'m17 '+y+' 2 2 3-4'} fill="none" stroke="#FFF8E9" strokeWidth="1.8"/><rect x="26" y={y-2} width="13" height="4" rx="2" fill={blue}/></g>)}
        <circle cx="47" cy="43" r="15" fill={pink} stroke="#E7C3C9" strokeWidth="2"/>
        <path d="m51 28-14 17h10l-4 13 15-19H48Z" fill={teal}/>
      </>}
    </g>
  </svg>;
}
