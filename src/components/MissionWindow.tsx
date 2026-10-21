import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { playSound, speakText } from '../utils/audio';
import { loadProgress, saveProgress, type MissionProgress } from '../utils/progress';

interface MissionWindowProps {
  onOpenAgendaModal: () => void;
  onMessageMaya: (prompt: string) => void;
}
type Tab = 'mission' | 'learn' | 'practice' | 'feedback';
type Step = 1 | 2 | 3 | 4;

const meetingEmail = "Hi there, I'm excited to get started on the client project. We'll have a kickoff meeting next Monday at 10 AM Eastern Time with the client team. Could you please review the attached agenda and let me know if you have any questions or suggestions? Best, Lisa.";

const words = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;

export const MissionWindow: React.FC<MissionWindowProps> = ({ onOpenAgendaModal, onMessageMaya }) => {
  const [progress, setProgress] = useState<MissionProgress>(loadProgress);
  const [step, setStep] = useState<Step>(() => {
    const p = loadProgress();
    return p.completed ? 4 : !p.read ? 1 : !p.reply ? 2 : !p.speak ? 3 : 4;
  });
  const [tab, setTab] = useState<Tab>('mission');
  const [choice, setChoice] = useState<string>('');
  const [reply, setReply] = useState('');
  const [tone, setTone] = useState('Professional & friendly');
  const [replyChecked, setReplyChecked] = useState(false);
  const [speechDraft, setSpeechDraft] = useState('');
  const [recording, setRecording] = useState(false);
  const [speechIssue, setSpeechIssue] = useState('');
  const [practiceChoice, setPracticeChoice] = useState('');
  const speechRef = useRef<any>(null);

  useEffect(() => () => {
    try { speechRef.current?.abort(); } catch { /* no active recording */ }
  }, []);

  const writeProgress = (patch: Partial<MissionProgress>) => {
    setProgress(saveProgress(patch));
  };

  const completeRead = () => {
    if (choice !== 'agenda') return;
    writeProgress({ read: true });
    setStep(2);
    playSound('ding');
  };

  const hasEnoughWords = words(reply) >= 12;
  const referencesRequest = /\b(agenda|meeting|project|timeline|suggestion|question)\b/i.test(reply);
  const validateReply = () => {
    setReplyChecked(true);
    if (!hasEnoughWords || !referencesRequest) return;
    writeProgress({ reply: true, writtenWords: words(reply) });
    setStep(3);
    playSound('ding');
  };

  const stopRecognition = () => {
    try { speechRef.current?.stop(); } catch { /* stopped already */ }
    setRecording(false);
  };

  const startRecording = () => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechIssue("Speech recognition isn't supported in this browser. You can type your spoken response below instead.");
      return;
    }
    setSpeechIssue('');
    try {
      const rec = new Recognition();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        const result = Array.from(event.results as any[]).map((item: any) => item[0].transcript).join(' ');
        setSpeechDraft(result);
      };
      rec.onerror = (event: any) => {
        setSpeechIssue(event.error === 'not-allowed' ? 'Microphone permission was denied. You can type your response instead.' : 'Could not recognize speech. Try again or type your response.');
        setRecording(false);
      };
      rec.onend = () => setRecording(false);
      speechRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      setSpeechIssue('The microphone could not start. You can type your response instead.');
      setRecording(false);
    }
  };

  const completeSpeak = () => {
    if (recording) stopRecognition();
    if (words(speechDraft) < 8) {
      setSpeechIssue('Please share at least one complete introduction (8 words or more) before continuing.');
      return;
    }
    writeProgress({ speak: true, spokenWords: words(speechDraft) });
    setStep(4);
    setSpeechIssue('');
    playSound('ding');
  };

  const finishMission = () => {
    if (!(progress.read && progress.reply && progress.speak)) return;
    if (!progress.completed) {
      writeProgress({ completed: true, completedAt: new Date().toISOString() });
      confetti({ particleCount: 85, spread: 65, origin: { y: 0.65 } });
      playSound('complete');
    }
    setTab('feedback');
  };

  const tabClass = (active: boolean) => 'px-3 py-2 text-sm rounded-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#274753] ' +
    (active ? 'bg-[#F4E3E5] text-[#864F57] border border-[#E8CCD1]' : 'text-[#4B6470] hover:bg-white');

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#FCFCFD]">
      <nav className="flex items-center gap-1 p-2 border-b border-[#E1E9ED] bg-[#F8FAFB] overflow-x-auto flex-shrink-0" aria-label="Mission sections">
        <button className={tabClass(tab === 'mission')} onClick={() => setTab('mission')}>🎯 Mission</button>
        <button className={tabClass(tab === 'learn')} onClick={() => setTab('learn')}>📖 Learn</button>
        <button className={tabClass(tab === 'practice')} onClick={() => setTab('practice')}>💬 Practice</button>
        <button className={tabClass(tab === 'feedback')} onClick={() => setTab('feedback')}>📈 My results</button>
      </nav>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex gap-3 items-start justify-between flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#A25F69]">Mission 01 · A2–B1 · Professional English</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#203E4A] mt-1">First Professional Meeting</h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#496570] mt-2">Read a colleague's email, write your own reply and practice introducing yourself in a meeting.</p>
            </div>
            <span className="text-xs rounded-full bg-[#E9F2F4] text-[#355563] py-2 px-3">About 10 minutes</span>
          </div>
          <p className="text-xs leading-relaxed text-[#536E7A] bg-[#F0F6F9] border border-[#D8E7EE] p-3 rounded-xl">
            <strong>Guided practice:</strong> this prototype uses simple checks, not AI grading. Microphone transcription depends on browser support. Your progress stays on this device.
          </p>
          <div className="flex items-center gap-2" aria-label="Mission progress">
            {(['Read', 'Reply', 'Speak'] as const).map((name, index) => {
              const done = [progress.read, progress.reply, progress.speak][index];
              const active = step === index + 1;
              return (
                <div key={name} className={'flex-1 rounded-lg p-2.5 border text-center text-sm font-semibold ' +
                  (done ? 'bg-[#E6F3EC] border-[#B6D6C5] text-[#2E624B]' : active ? 'bg-[#F9EDEF] border-[#DDAEB8] text-[#7B4655]' : 'bg-[#F5F8FA] border-[#E1E9ED] text-[#6A8089]')}>
                  {done ? '✓ ' : (index + 1) + '. '}{name}
                </div>
              );
            })}
          </div>

          {tab === 'mission' && step === 1 && (
            <section className="rounded-2xl border border-[#E3E9ED] bg-white shadow-sm overflow-hidden" aria-labelledby="read-title">
              <header className="bg-[#F8E9EC] px-5 py-3 text-[#7D4854] font-bold" id="read-title">📥 Step 1 · You've got mail</header>
              <div className="p-5 space-y-4 text-sm sm:text-base text-[#294A57] leading-relaxed">
                <div className="flex items-center justify-between flex-wrap gap-2"><div><strong>Lisa Chen</strong><p className="text-xs text-[#687B82]">Subject: Kickoff meeting next week</p></div><button className="text-sm text-[#7F4D60] underline" onClick={() => speakText(meetingEmail)}>🔈 Listen</button></div>
                <div className="rounded-lg bg-[#F9FBFC] border border-[#E4EDF1] p-4 space-y-3">
                  <p>Hi there,</p><p>I'm excited to get started on the client project. We'll have a kickoff meeting next Monday at 10 AM (EST) with the client team.</p>
                  <p>Could you please review the attached agenda and let me know if you have any questions or suggestions?</p><p>Best,<br/>Lisa</p>
                </div>
                <button className="text-sm underline text-[#3B6478]" onClick={onOpenAgendaModal}>📎 View meeting agenda</button>
                <fieldset className="space-y-2"><legend className="font-bold mb-2">What does Lisa want you to do?</legend>
                  {[
                    ['cancel', 'Cancel the meeting.'],
                    ['agenda', 'Review the agenda and share questions or suggestions.'],
                    ['present', 'Prepare a sales presentation.'],
                  ].map(([value, label]) => (
                    <label key={value} className={'block rounded-lg border p-3 cursor-pointer ' + (choice === value ? 'border-[#AE748E] bg-[#F9EFF2]' : 'border-[#DFE6E9] hover:bg-[#F9FAFC]')}>
                      <input type="radio" name="comprehension" value={value} checked={choice === value} onChange={() => setChoice(value)} className="mr-2 accent-[#955F7B]" />{label}
                    </label>
                  ))}
                </fieldset>
                {choice && choice !== 'agenda' && <p role="status" className="text-sm text-[#8A4757]">Not quite. Look again at Lisa's request before you continue.</p>}
                <button onClick={completeRead} disabled={choice !== 'agenda'} className="w-full rounded-xl py-3 px-4 bg-[#284D5B] disabled:opacity-40 text-white font-semibold focus-visible:outline focus-visible:outline-2">Continue to Reply →</button>
              </div>
            </section>
          )}

          {tab === 'mission' && step === 2 && (
            <section className="rounded-2xl border border-[#DCE8DE] bg-white shadow-sm overflow-hidden" aria-labelledby="reply-title">
              <header id="reply-title" className="bg-[#EDF5EE] px-5 py-3 font-bold text-[#496A54]">✍️ Step 2 · Write a response</header>
              <div className="p-5 space-y-4 text-sm sm:text-base text-[#294A57]">
                <p>Reply to Lisa in your own words. Thank her for the agenda and ask a useful question or share a suggestion. Your answer starts blank on purpose.</p>
                <label className="block font-semibold" htmlFor="mission-reply">Your email</label>
                <textarea id="mission-reply" rows={7} value={reply} onChange={(e) => { setReply(e.target.value); setReplyChecked(false); }} placeholder="Hi Lisa,&#10;&#10;Thanks for..." className="w-full resize-y rounded-xl border border-[#C9DDE3] p-3.5 text-base text-[#284550] focus:outline-none focus:ring-2 focus:ring-[#A6BFCB]" />
                <div className="flex items-center gap-2 flex-wrap"><label htmlFor="reply-tone" className="font-semibold">Tone:</label><select id="reply-tone" value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border border-[#C9DDE3] p-2 text-sm"><option>Professional & friendly</option><option>Formal</option><option>Casual</option></select><span className="ml-auto text-sm text-[#536F79]">{words(reply)} words</span></div>
                {replyChecked && <div role="status" className="rounded-lg border border-[#D4E5E9] bg-[#F1F8FA] p-3 space-y-2 text-sm"><strong>Writing checklist — not an AI score</strong>
                  <p>{hasEnoughWords ? '✓' : '○'} At least 12 words to express a complete thought</p>
                  <p>{referencesRequest ? '✓' : '○'} Your reply refers to Lisa's meeting or agenda</p>
                  <p>Review your grammar and tone with your teacher; this checklist cannot judge language quality.</p>
                </div>}
                <div className="flex gap-2 flex-wrap"><button onClick={() => setStep(1)} className="py-2.5 px-4 border border-[#D5E1E6] rounded-lg">← Read email</button><button onClick={validateReply} className="flex-1 min-w-[160px] rounded-lg bg-[#284D5B] text-white font-semibold py-3">Check and continue →</button></div>
              </div>
            </section>
          )}

          {tab === 'mission' && step === 3 && (
            <section className="rounded-2xl border border-[#D7E7EE] bg-white shadow-sm overflow-hidden" aria-labelledby="speak-title">
              <header id="speak-title" className="bg-[#E9F3F8] px-5 py-3 font-bold text-[#355D70]">🎙️ Step 3 · Your turn to speak</header>
              <div className="p-5 space-y-4 text-sm sm:text-base text-[#294A57]">
                <p><strong>Situation:</strong> You joined the meeting. Introduce yourself, explain your role and ask one question about the project. Speak naturally; you don't need to be perfect.</p>
                <details className="rounded-xl bg-[#F9EFF2] border border-[#F0D9DF] p-3"><summary className="cursor-pointer font-semibold text-[#874F60]">Need some useful phrases?</summary><p className="mt-2">“I'll be helping with…” · “Could you clarify…?” · “I'm looking forward to…”</p></details>
                <div className="flex items-center gap-3 flex-wrap"><button onClick={recording ? stopRecognition : startRecording} className={'rounded-xl px-5 py-3 text-white font-semibold ' + (recording ? 'bg-[#AA5868]' : 'bg-[#284D5B]')}>{recording ? '⏹ Stop microphone' : '🎙 Start microphone'}</button><span className="text-xs text-[#536F79]">{recording ? 'Listening…' : 'English speech-to-text (if supported)'}</span></div>
                <label htmlFor="spoken-response" className="font-semibold block">Your spoken response / transcript</label>
                <textarea id="spoken-response" rows={5} value={speechDraft} onChange={(e) => setSpeechDraft(e.target.value)} placeholder="Your recognized words will appear here. You can also type your response if microphone access is unavailable." className="w-full rounded-xl border border-[#C9DDE3] p-3.5 text-base focus:ring-2 focus:ring-[#A6BFCB] focus:outline-none" />
                <p className="text-xs text-[#536F79]">This is not a pronunciation assessment. Speech recognition can make transcription errors.</p>
                {speechIssue && <p role="status" className="rounded-lg bg-[#F9EFF2] text-[#834F5A] p-3 text-sm">{speechIssue}</p>}
                <div className="flex gap-2 flex-wrap"><button onClick={() => setStep(2)} className="py-2.5 px-4 border border-[#D5E1E6] rounded-lg">← My reply</button><button onClick={completeSpeak} className="flex-1 min-w-[160px] rounded-lg bg-[#284D5B] text-white font-semibold py-3">Finish speaking step →</button></div>
              </div>
            </section>
          )}

          {tab === 'mission' && step === 4 && (
            <section className="rounded-2xl border border-[#C9DCD2] bg-[#F7FBF8] p-6 space-y-3 text-[#294A57] text-sm sm:text-base">
              <h3 className="text-2xl font-serif font-bold">✨ You've practiced all three skills!</h3>
              <p>You understood Lisa's request, prepared your own written reply, and practiced your spoken introduction.</p>
              <p><strong>Reflection:</strong> Which expression would you like to use in your next real conversation?</p>
              <button onClick={finishMission} className="w-full rounded-xl py-3 px-4 bg-[#284D5B] text-white font-semibold">{progress.completed ? 'Review your results →' : 'Complete mission ✓'}</button>
            </section>
          )}

          {tab === 'learn' && (
            <section className="rounded-2xl border border-[#DCE8E0] bg-white p-5 space-y-3 text-[#294A57]">
              <h3 className="font-serif font-bold text-xl">Useful phrases for your meeting</h3>
              {[
                ['Could you clarify…?', 'Ask for more information politely.'],
                ["I'm looking forward to…", 'Express positive expectations.'],
                ["I'd like to suggest…", 'Introduce your idea respectfully.'],
                ["Thanks for sharing the agenda.", 'Acknowledge a colleague’s email.'],
              ].map(([phrase, explanation]) => <div className="flex items-center justify-between border-b border-[#EBF0F2] py-3 gap-3" key={phrase}><div><strong className="text-base">{phrase}</strong><p className="text-sm text-[#607983]">{explanation}</p></div><button className="shrink-0 py-2 px-3 rounded-lg bg-[#EFF5F7] text-sm" onClick={() => speakText(phrase)} aria-label={'Listen to ' + phrase}>🔈 Listen</button></div>)}
              <p className="text-sm text-[#536F79]">These are examples, not the only correct way to communicate.</p>
            </section>
          )}

          {tab === 'practice' && (
            <section className="rounded-2xl border border-[#DCE8E0] bg-white p-5 space-y-4 text-[#294A57]">
              <h3 className="font-serif font-bold text-xl">Quick challenge: Be diplomatic</h3>
              <p>A teammate has proposed a meeting time that you can't attend. Which reply offers a useful alternative?</p>
              <div className="grid gap-2">{[['a','No. Bad timing.'],['b','Thanks for letting me know. Could we meet at 3 PM instead?'],['c','I maybe will come.']].map(([v,label]) => <button key={v} onClick={() => setPracticeChoice(v)} className={'text-left p-3 rounded-xl border text-base ' + (practiceChoice === v ? 'border-[#AD748B] bg-[#F9EFF2]' : 'border-[#DFE6E9]')}>{label}</button>)}</div>
              {practiceChoice && <p role="status" className="p-3 bg-[#F2F8FA] rounded-lg text-sm">{practiceChoice === 'b' ? 'Exactly. Your answer is polite and gives a specific alternative.' : 'That might be misunderstood. Try offering a specific alternative in a polite tone.'}</p>}
              <button onClick={() => onMessageMaya("Let's practice rescheduling a meeting. Please act as my teammate.")} className="w-full py-3 px-4 rounded-xl bg-[#284D5B] text-white font-semibold">Open Messenger for more practice ↗</button>
              <p className="text-xs text-[#536F79]">Messenger currently uses scripted replies, not a connected AI model.</p>
            </section>
          )}

          {tab === 'feedback' && (
            <section className="rounded-2xl border border-[#DCE8E0] bg-white p-5 space-y-4 text-[#294A57]">
              <h3 className="font-serif text-2xl font-bold">Your mission progress</h3>
              <p className="text-sm text-[#536F79]">Recorded on this device. No invented pronunciation, confidence or language proficiency scores.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{[
                ['Read', progress.read],
                ['Reply', progress.reply],
                ['Speak', progress.speak],
              ].map(([label, done]) => <div key={String(label)} className="rounded-xl border border-[#DCE8E0] bg-[#F5F9F7] p-4"><p className="text-sm font-semibold">{label}</p><p className="text-lg font-bold mt-1">{done ? '✓ Completed' : 'Not completed yet'}</p></div>)}</div>
              <div className="rounded-xl bg-[#F0F6F9] p-4 text-sm space-y-1"><p><strong>Writing:</strong> {progress.writtenWords} words practiced</p><p><strong>Speaking:</strong> {progress.spokenWords} transcribed / entered words</p><p><strong>Status:</strong> {progress.completed ? 'Mission completed ✓' : 'In progress'}</p></div>
              <button className="w-full py-3 rounded-xl bg-[#284D5B] text-white font-semibold" onClick={() => {setTab('mission');setStep(progress.completed ? 4 : !progress.read ? 1 : !progress.reply ? 2 : !progress.speak ? 3 : 4);}}>Return to mission →</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
