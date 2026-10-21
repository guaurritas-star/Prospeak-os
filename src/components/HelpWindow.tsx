import React, { useState } from 'react';
import { CircleHelp, Monitor, Target, Mic, NotebookPen, ShieldCheck } from 'lucide-react';

export function HelpWindow() {
  const [lang, setLang] = useState<'es'|'en'>('es');
  const es=lang==='es';
  const items = es ? [
    ['Escritorio y ventanas','Abre las aplicaciones desde los iconos o el menú ProSpeak. Cierra, minimiza y restaura las ventanas desde sus controles.'],
    ['Tu primera misión','Abre Today’s Mission y completa Read, Reply y Speak. Puedes retomarla después; el avance queda guardado en este navegador.'],
    ['Practica hablando','En Speaking Lab puedes hablar mediante el reconocimiento de voz del navegador o escribir tu respuesta. No calificamos pronunciación automáticamente.'],
    ['Guarda tus expresiones','En My Notebook reúne frases que quieres usar en tus conversaciones. También puedes guardarlas desde la sección Learn de tu misión.'],
    ['Maya y privacidad','Maya funciona actualmente en modo guiado. Cuando se configure la IA, se te indicará antes de enviar mensajes a un proveedor externo. No incluyas datos sensibles.'],
  ] : [
    ['Desktop and windows','Open apps from their desktop icons or the ProSpeak menu. Use the window controls to close, minimize or restore them.'],
    ['Your first mission','Open Today’s Mission and complete Read, Reply and Speak. Your progress stays in this browser.'],
    ['Speaking practice','In Speaking Lab, use your browser’s speech recognition or type an answer. There is no automatic pronunciation score.'],
    ['Save useful expressions','Collect phrases in My Notebook. You can also save them from the Learn section of your mission.'],
    ['Maya and privacy','Maya currently has a guided practice mode. When AI is configured, you will be informed before messages are shared with an AI provider. Never include sensitive information.'],
  ];
  const icons=[Monitor,Target,Mic,NotebookPen,ShieldCheck];
  return <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 bg-[#F9FBFC] text-[#294957] space-y-4">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <h2 className="text-2xl font-serif font-bold flex items-center gap-2"><CircleHelp size={24}/> {es?'Guía rápida':'Quick guide'}</h2>
      <div className="flex rounded-xl border border-[#D1E1E6] bg-white p-1 text-sm">
        <button onClick={()=>setLang('es')} className={'px-3 py-1.5 rounded-lg '+(es?'bg-[#DDEEF4] font-bold':'')}>Español</button>
        <button onClick={()=>setLang('en')} className={'px-3 py-1.5 rounded-lg '+(!es?'bg-[#DDEEF4] font-bold':'')}>English</button>
      </div>
    </div>
    <p className="text-sm text-[#55737D]">{es?'Un espacio para practicar inglés a tu ritmo, como complemento de tus clases conversacionales.':'A place to practice English at your pace, alongside your conversation classes.'}</p>
    <div className="space-y-2">{items.map(([title,description],i)=>{const Icon=icons[i];return <section key={title} className="p-4 rounded-xl border border-[#DFE9ED] bg-white flex items-start gap-3"><Icon size={22} className="text-[#AE7892] shrink-0"/><div><h3 className="font-semibold text-base">{title}</h3><p className="text-sm leading-relaxed mt-1 text-[#526A76]">{description}</p></div></section>})}</div>
  </div>;
}
