import React, { useEffect, useRef, useState } from 'react';
import { playSound, speakText } from '../utils/audio';
import { Volume2, Mic, Square } from 'lucide-react';

const drills = {
  intro: { title: 'Meeting Self-Introduction', target: "Hi everyone, I'm Alex. I'll be helping with the project. I'm looking forward to working with you.", hint: 'Introduce yourself, your role and one thing you look forward to.' },
  timeline: { title: 'Negotiating a Timeline', target: "I think we may need a little more time. Could we discuss moving the deadline?", hint: 'Ask politely for more time and explain why.' },
  objection: { title: 'Responding to a Client', target: "Thank you for explaining your concern. Could you tell me a little more?", hint: 'Acknowledge a concern and ask a follow-up question.' },
  twister: { title: 'Pronunciation Warm-up', target: 'Six simple sentences sound surprisingly similar.', hint: 'Practice slowly and listen to the reference. This tool does not score pronunciation.' },
};
type Drill = keyof typeof drills;
const wordCount = (s: string) => s.trim() ? s.trim().split(/\s+/).length : 0;

export const SpeakingLabWindow: React.FC = () => {
  const [selectedDrill, setSelectedDrill] = useState<Drill>('intro');
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [showReflection, setShowReflection] = useState(false);
  const recognitionRef = useRef<any>(null);
  const drill = drills[selectedDrill];

  useEffect(() => () => { try { recognitionRef.current?.abort(); } catch {} }, []);

  const toggleRecording = () => {
    if (isRecording) {
      try { recognitionRef.current?.stop(); } catch {}
      setIsRecording(false);
      return;
    }
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setError('This browser does not support speech recognition. You can still type your response to practice.');
      return;
    }
    try {
      setError('');
      setShowReflection(false);
      const rec = new Recognition();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        setTranscript(Array.from(event.results as any[]).map((r: any) => r[0].transcript).join(' '));
      };
      rec.onerror = (event: any) => {
        setIsRecording(false);
        setError(event.error === 'not-allowed' ? 'Microphone permission denied. Try typing instead.' : 'Speech recognition was interrupted. You can retry or type.');
      };
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
      rec.start();
      setIsRecording(true);
      playSound('click');
    } catch {
      setError('Could not start the microphone. Try typing your practice response.');
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#F8FAFB] p-4 sm:p-5 text-[#274653] space-y-4">
      <header>
        <h3 className="font-serif font-bold text-2xl">Speaking Lab</h3>
        <p className="text-sm text-[#617A84]">Practice useful expressions at your own pace. Browser speech-to-text is optional.</p>
      </header>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Speaking exercise">
        {(Object.keys(drills) as Drill[]).map((id) => (
          <button key={id} onClick={() => { if (isRecording) { try { recognitionRef.current?.abort(); } catch {} setIsRecording(false); } setSelectedDrill(id); setTranscript(''); setError(''); setShowReflection(false); }}
            className={'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold border ' + (id === selectedDrill ? 'bg-[#F4E3E5] border-[#D7AFB9] text-[#804D5A]' : 'bg-white border-[#DAE7ED] text-[#4D6B77]')}>{drills[id].title}</button>
        ))}
      </div>
      <section className="bg-white rounded-2xl border border-[#DCE7EC] p-5 space-y-4">
        <h4 className="text-xl font-serif font-bold">{drill.title}</h4>
        <p className="text-sm sm:text-base leading-relaxed">{drill.hint}</p>
        <details className="bg-[#F8EBEF] rounded-xl border border-[#EFD5DD] p-3">
          <summary className="text-sm font-semibold cursor-pointer text-[#804D5A]">Show an example (optional)</summary>
          <p className="text-base mt-2 leading-relaxed">{drill.target}</p>
          <button onClick={() => speakText(drill.target)} className="mt-2 text-sm underline text-[#804D5A]"><span className="inline-flex items-center gap-1"><Volume2 size={15} /> Hear example</span></button>
        </details>
        <button className={'rounded-xl px-4 py-3 text-white font-semibold text-sm ' + (isRecording ? 'bg-[#AA5868]' : 'bg-[#2C5260]')} onClick={toggleRecording}><span className="inline-flex items-center gap-2">{isRecording ? <Square size={16} /> : <Mic size={16} />}{isRecording ? 'Stop speech recognition' : 'Start speech recognition'}</span></button>
        {isRecording && <p role="status" className="text-sm text-[#6A5261]">Listening… speak naturally.</p>}
        {error && <p role="status" className="text-sm bg-[#FBEFF2] text-[#7F4754] rounded-lg p-3">{error}</p>}
        <label className="block text-sm font-semibold" htmlFor="speaking-transcript">Your response / recognized transcript</label>
        <textarea id="speaking-transcript" rows={5} className="w-full p-3 border border-[#BBD0D9] rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#9ABACB]" placeholder="Recognized speech appears here. You can also type if your microphone is unavailable." value={transcript} onChange={(e) => {setTranscript(e.target.value);setShowReflection(false);}} />
        <p className="text-xs text-[#607884]">Speech recognition can mishear words; no audio is stored by ProSpeak OS. This demo does not assess pronunciation or confidence.</p>
        <button disabled={wordCount(transcript) < 8} onClick={() => {setShowReflection(true);playSound('ding');}} className="w-full py-3 bg-[#2C5260] text-white rounded-xl font-semibold disabled:opacity-40">Review my practice →</button>
        {showReflection && <div role="status" className="bg-[#EFF8F3] rounded-xl p-4 space-y-2 text-sm"><h5 className="font-bold">Practice recorded on this screen</h5><p>You entered {wordCount(transcript)} words. You can listen to the example and try expressing the same idea in your own words.</p><p>For pronunciation, tone and fluency feedback, practice with your ProSpeak teacher. No automated score has been generated.</p></div>}
      </section>
    </div>
  );
};
