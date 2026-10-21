import React, { useState, useEffect, useRef } from 'react';
import { SpeakingExercise } from '../types/os';
import { playSound, speakText } from '../utils/audio';

export const SpeakingLabWindow: React.FC = () => {
  const [selectedDrill, setSelectedDrill] = useState<'intro' | 'timeline' | 'objection' | 'twister'>('intro');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordTimer, setRecordTimer] = useState(0);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    wpm: number;
    fillers: number;
    intonation: number;
    articulation: number;
    feedback: string;
  } | null>(null);

  const speechRecognitionRef = useRef<any>(null);

  const drills: Record<'intro' | 'timeline' | 'objection' | 'twister', SpeakingExercise> = {
    intro: {
      title: 'Meeting Self-Introduction',
      target: `Hi everyone, I'm Alex. I'll be leading the product side for this initiative. I look forward to partnering closely with all of you to ensure we hit our key deliverables on time.`,
      hint: 'Focus on warm energy, steady pacing, and clear emphasis on "product side" and "key deliverables".',
    },
    timeline: {
      title: 'Diplomatic Timeline Negotiation',
      target: `Based on our initial architectural assessment, pushing the staging release by two business days will give us the bandwidth to run rigorous quality assurance and avoid costly bugs later.`,
      hint: 'Anchor your argument around client value and risk avoidance rather than workload.',
    },
    objection: {
      title: 'Handling a Direct Client Objection',
      target: `That is an understandable concern. Let me clarify what our scope includes and outline how we can accommodate that specific request without disrupting the critical path.`,
      hint: 'Validate first ("understandable concern"), then pivot to solution-oriented phrasing.',
    },
    twister: {
      title: 'Clarity & Enunciation Drill',
      target: `Six senior strategic stakeholders specifically scheduled sixteen synchronous sprint showcases.`,
      hint: 'Slow down and pronounce each "s", "st", and "sh" sound distinctly.',
    },
  };

  const currentDrill = drills[selectedDrill];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordTimer((t) => t + 1), 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
      playSound('ding');

      // Calculate mock realistic metrics based on drill
      const words = (transcript || currentDrill.target).split(' ').length;
      const duration = Math.max(2, recordTimer);
      const calculatedWpm = Math.round((words / duration) * 60) || 138;

      setEvaluation({
        score: 94,
        wpm: Math.min(160, Math.max(120, calculatedWpm)),
        fillers: 0,
        intonation: 93,
        articulation: 95,
        feedback:
          'Excellent cadencing. Your vowels were open, stress was placed on actionable verbs, and you did not use any filler sounds.',
      });
    } else {
      setIsRecording(true);
      setTranscript('');
      setEvaluation(null);
      playSound('click');

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';
          rec.onresult = (e: any) => {
            let res = '';
            for (let i = 0; i < e.results.length; i++) {
              res += e.results[i][0].transcript;
            }
            setTranscript(res);
          };
          rec.onerror = () => {};
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {
          // Fallback
        }
      }

      setTimeout(() => {
        setTranscript((t) => t || currentDrill.target);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8FAFB] text-xs p-4 sm:p-5 select-none space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 flex-shrink-0">
        <div>
          <h3 className="font-serif font-bold text-lg text-[#1F3D47]">Speaking Lab & Vocal Coach</h3>
          <p className="text-[11px] text-gray-500">Train pitch, cadence, and professional articulation.</p>
        </div>

        {/* Drill Selectors */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200">
          {(['intro', 'timeline', 'objection', 'twister'] as const).map((drillKey) => (
            <button
              key={drillKey}
              onClick={() => {
                setSelectedDrill(drillKey);
                setEvaluation(null);
                setTranscript('');
                playSound('click');
              }}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold transition ${
                selectedDrill === drillKey
                  ? 'bg-[#2A4C59] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {drillKey === 'intro'
                ? '👋 Intro'
                : drillKey === 'timeline'
                ? '⏱️ Timeline'
                : drillKey === 'objection'
                ? '🛡️ Objections'
                : '👅 Clarity'}
            </button>
          ))}
        </div>
      </div>

      {/* Target Phrase Card */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#2A4B59] uppercase tracking-wider">
            {currentDrill.title}
          </span>
          <button
            onClick={() => {
              playSound('click');
              speakText(currentDrill.target, 1, 0.9);
            }}
            className="text-xs font-semibold text-[#8C4A55] hover:text-[#5E2B33] flex items-center space-x-1"
          >
            <span>🔈</span>
            <span>Listen to Native Model</span>
          </button>
        </div>

        <p className="text-sm font-serif italic text-gray-800 leading-relaxed bg-[#FDF8F9] p-3 rounded-lg border border-[#F5E2E6]">
          "{currentDrill.target}"
        </p>

        <p className="text-[11px] text-gray-500 italic">💡 Coaching note: {currentDrill.hint}</p>
      </div>

      {/* Audio Visualizer & Recording Zone */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center space-y-3">
        {/* Waveform Bars */}
        <div className="flex items-center justify-center space-x-1 h-12 w-full max-w-xs">
          {[4, 12, 28, 16, 32, 20, 36, 18, 8, 24, 14, 30, 10, 6].map((baseHeight, idx) => (
            <span
              key={idx}
              style={{
                height: isRecording ? `${Math.min(42, Math.max(6, baseHeight * (1 + (idx % 3) * 0.4)))}px` : '6px',
              }}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isRecording ? 'bg-rose-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="w-full text-center">
          {isRecording ? (
            <div className="text-xs text-rose-600 font-semibold flex items-center justify-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Recording live speech ({recordTimer}s)...</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              Press the button below and speak the sentence clearly into your mic.
            </p>
          )}

          {transcript && (
            <p className="text-xs text-gray-800 italic mt-2 bg-slate-50 p-2 rounded border border-gray-100 max-w-md mx-auto">
              "{transcript}"
            </p>
          )}
        </div>

        <button
          onClick={toggleRecording}
          className={`py-2.5 px-6 rounded-full text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition active:scale-95 ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
              : 'bg-gradient-to-r from-[#294B59] to-[#1C3640] hover:brightness-110'
          }`}
        >
          <span>{isRecording ? '⏹️' : '🎙️'}</span>
          <span>{isRecording ? 'Stop Recording' : 'Start Speaking'}</span>
        </button>
      </div>

      {/* Feedback Metrics Grid */}
      {evaluation && (
        <div className="bg-[#F2FAF5] border border-[#CCE8D5] rounded-xl p-4 text-[#204533] space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-[#D2EBD9] pb-2">
            <span className="font-bold text-sm">Vocal Assessment Scorecard</span>
            <span className="text-xs font-serif font-bold text-emerald-800 text-base">
              Overall: {evaluation.score}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-[#D5EBE0]">
              <span className="text-[10px] text-gray-500 block">Pace</span>
              <span className="font-bold text-sm text-[#20404C]">{evaluation.wpm} WPM</span>
              <span className="text-[9px] text-emerald-600 block">Optimal</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#D5EBE0]">
              <span className="text-[10px] text-gray-500 block">Filler Words</span>
              <span className="font-bold text-sm text-emerald-700">{evaluation.fillers}</span>
              <span className="text-[9px] text-emerald-600 block">Crisp pause control</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#D5EBE0]">
              <span className="text-[10px] text-gray-500 block">Intonation</span>
              <span className="font-bold text-sm text-[#20404C]">{evaluation.intonation}%</span>
              <span className="text-[9px] text-emerald-600 block">Natural inflection</span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#D5EBE0]">
              <span className="text-[10px] text-gray-500 block">Articulation</span>
              <span className="font-bold text-sm text-[#20404C]">{evaluation.articulation}%</span>
              <span className="text-[9px] text-emerald-600 block">Clear consonants</span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-900 italic pt-1">{evaluation.feedback}</p>
        </div>
      )}
    </div>
  );
};
