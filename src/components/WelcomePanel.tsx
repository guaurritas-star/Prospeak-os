import React, { useState } from 'react';
import { X, ArrowRight, Target, CircleHelp } from 'lucide-react';
import { BrandMascot } from './BrandMascot';
import { loadProgress } from '../utils/progress';
const KEY='prospeak:welcome-seen:v1';
export function WelcomePanel({ onStart, onHelp }: { onStart:()=>void;onHelp:()=>void }) {
  const [visible,setVisible]=useState(()=>{try{return localStorage.getItem(KEY)!=='yes';}catch{return true;}});
  const dismiss=()=>{setVisible(false);try{localStorage.setItem(KEY,'yes');}catch{}};
  if(!visible)return null;
  const p=loadProgress();
  const done=[p.read,p.reply,p.speak].filter(Boolean).length;
  return <div className="fixed inset-0 z-[70] bg-[#162D39]/35 backdrop-blur-[2px] flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-label="Welcome to ProSpeak OS">
    <section className="relative w-full max-w-md bg-[#FFFCFA] rounded-3xl border border-white shadow-2xl p-5 sm:p-7 text-[#2A4E5C]">
      <button aria-label="Close welcome" onClick={dismiss} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F2E4E8]"><X size={20}/></button>
      <div className="flex items-center gap-3 mb-3"><div className="rounded-2xl bg-[#E8F1F4] p-2"><BrandMascot size={70}/></div><div><p className="text-xs tracking-widest font-bold text-[#B17A91] uppercase">ProSpeak OS</p><h2 className="font-serif font-bold text-2xl">Welcome!</h2></div></div>
      <p className="text-base mb-4 leading-relaxed">Ready to practice English for real conversations? Your next mission is waiting.</p>
      <div className="rounded-2xl bg-[#F1F6F7] p-4 space-y-3 mb-4">
        <div className="flex items-center gap-2 font-semibold"><Target size={20} className="text-[#B17A91]"/> First Professional Meeting</div>
        <p className="text-sm text-[#607682]">Read · Reply · Speak</p>
        <div className="flex gap-1" aria-label={done+' of 3 steps complete'}>{[0,1,2].map(i=><div key={i} className={'h-2 flex-1 rounded-full '+(i<done?'bg-[#83AA99]':'bg-[#D8E5E9]')}/>)}</div>
      </div>
      <button className="w-full bg-[#294E5C] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2" onClick={()=>{dismiss();onStart();}}>{done?'Continue mission':'Start your mission'} <ArrowRight size={17}/></button>
      <button className="w-full mt-2 text-[#547686] py-2 font-medium flex items-center justify-center gap-2" onClick={()=>{dismiss();onHelp();}}><CircleHelp size={17}/> How does ProSpeak OS work?</button>
    </section>
  </div>;
}
