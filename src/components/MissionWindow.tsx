import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { MissionStepStatus, ReplyAnalysis } from '../types/os';
import { playSound, speakText } from '../utils/audio';

interface MissionWindowProps {
  onOpenAgendaModal: () => void;
  onMessageMaya: (prompt: string) => void;
}

export const MissionWindow: React.FC<MissionWindowProps> = ({
  onOpenAgendaModal,
  onMessageMaya,
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'learn' | 'practice' | 'feedback'>('mission');
  const [stepStatus, setStepStatus] = useState<MissionStepStatus>({ 1: true, 2: false, 3: false });
  const [replyText, setReplyText] = useState(
    `Hi Lisa,\n\nThanks for the agenda. It looks great! I have a couple of suggestions regarding the timeline, and I'll share them in the meeting.\n\nLooking forward to it!\n\nBest,\nAlex Rivera`
  );
  const [replyTone, setReplyTone] = useState('Professional & Friendly');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState<ReplyAnalysis | null>(null);

  // Spoken response state
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordTimer, setRecordTimer] = useState(0);
  const [speechScore, setSpeechScore] = useState<number | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const [isPlayingEmail, setIsPlayingEmail] = useState(false);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState(false);

  // Practice scenario state
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<number | null>(null);
  const [scenarioFeedback, setScenarioFeedback] = useState<string | null>(null);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordTimer((t) => t + 1), 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleCheckReply = () => {
    setIsAnalyzing(true);
    playSound('click');
    setTimeout(() => {
      setIsAnalyzing(false);
      setReplyFeedback({
        score: 96,
        toneMatch: `High Confidence (98% match for ${replyTone})`,
        strengths: [
          'Courteous greeting and professional sign-off',
          'Clear proactive statement regarding meeting agenda',
          'Diplomatic phrasing: "a couple of suggestions regarding the timeline"',
        ],
        suggestion:
          'Pro tip: You could add "Please let me know if you’d like to see the draft beforehand" for even greater leadership visibility.',
      });
      setStepStatus((s) => ({ ...s, 2: true }));
      playSound('ding');
    }, 700);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
      playSound('ding');
      setSpeechScore(94);
      setStepStatus((s) => ({ ...s, 3: true }));
    } else {
      setIsRecording(true);
      setTranscript('');
      setSpeechScore(null);
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
          // Fallback to simulated input
        }
      }

      // Simulated transcription if mic not speaking or unsupported
      setTimeout(() => {
        setTranscript((t) =>
          t ||
          `Hi, I'm Alex. I'll be supporting the project on the product side. I'd like to suggest a small change to the timeline...`
        );
      }, 2500);
    }
  };

  const handleCompleteMission = () => {
    playSound('complete');
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#FCFCFD]">
      {/* Top Nav Tabs */}
      <div className="bg-[#F6F8FA] border-b border-[#E3E8EC] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-shrink-0">
        <nav className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={() => {
              playSound('click');
              setActiveTab('mission');
            }}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'mission'
                ? 'bg-[#F4E3E5] text-[#864F57] border border-[#E8CCD1] shadow-xs'
                : 'text-[#5B717B] hover:text-[#233F49] hover:bg-white/60'
            }`}
          >
            <span className="text-sm">🎯</span>
            <span>Mission</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('learn');
            }}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'learn'
                ? 'bg-[#F4E3E5] text-[#864F57] border border-[#E8CCD1] shadow-xs'
                : 'text-[#5B717B] hover:text-[#233F49] hover:bg-white/60'
            }`}
          >
            <span className="text-sm">📖</span>
            <span>Learn</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('practice');
            }}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'practice'
                ? 'bg-[#F4E3E5] text-[#864F57] border border-[#E8CCD1] shadow-xs'
                : 'text-[#5B717B] hover:text-[#233F49] hover:bg-white/60'
            }`}
          >
            <span className="text-sm">🎙️</span>
            <span>Practice</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              setActiveTab('feedback');
            }}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'feedback'
                ? 'bg-[#F4E3E5] text-[#864F57] border border-[#E8CCD1] shadow-xs'
                : 'text-[#5B717B] hover:text-[#233F49] hover:bg-white/60'
            }`}
          >
            <span className="text-sm">📊</span>
            <span>Feedback</span>
          </button>
        </nav>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-[#4F6C77] font-medium">
          <span>
            Earn: <strong className="text-[#A25F69] font-bold">+150 XP</strong>
          </span>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* MISSION TAB */}
        {activeTab === 'mission' && (
          <>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#A25F69] uppercase font-sans">
                  TODAY'S MISSION
                </span>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#F5E6E8] text-[#864F57] text-[11px] font-semibold border border-[#E9D1D5]">
                  <span>💼</span>
                  <span>Business Communication</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F3D47] mt-1 tracking-tight">
                First Professional Meeting
              </h2>
              <p className="text-xs text-[#526D77] font-sans mt-1">
                Read the email, reply to your teammate, and prepare a spoken response for the upcoming meeting.
              </p>
            </div>

            {/* Steps tracker card */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-[#F4F8FA] p-2.5 sm:p-3 rounded-xl border border-[#DFEBF0]">
              <div className="flex items-start space-x-2 sm:space-x-2.5">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors ${
                    stepStatus[1] ? 'bg-[#4B846A]' : 'bg-[#CB7A86]'
                  }`}
                >
                  {stepStatus[1] ? '✓' : '1'}
                </span>
                <div>
                  <span className="text-xs font-bold text-[#23424E] block">Read</span>
                  <span className="text-[11px] text-[#69828C] leading-snug hidden sm:block">
                    A real work email from a colleague.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-2.5">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors ${
                    stepStatus[2] ? 'bg-[#4B846A]' : 'bg-[#959F7F]'
                  }`}
                >
                  {stepStatus[2] ? '✓' : '2'}
                </span>
                <div>
                  <span className="text-xs font-bold text-[#23424E] block">Reply</span>
                  <span className="text-[11px] text-[#69828C] leading-snug hidden sm:block">
                    Write a short, professional response.
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2 sm:space-x-2.5">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-xs transition-colors ${
                    stepStatus[3] ? 'bg-[#4B846A]' : 'bg-[#6898AD]'
                  }`}
                >
                  {stepStatus[3] ? '✓' : '3'}
                </span>
                <div>
                  <span className="text-xs font-bold text-[#23424E] block">Speak</span>
                  <span className="text-[11px] text-[#69828C] leading-snug hidden sm:block">
                    Practice your spoken response with AI.
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Step Interactive Workstations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Card 1: Read Email */}
              <div className="bg-white rounded-xl border border-[#EAE3E3] shadow-xs flex flex-col overflow-hidden">
                <div className="bg-[#F8EAEB] px-3.5 py-2 border-b border-[#EED4D7] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">📥</span>
                    <span className="text-xs font-bold text-[#7E4B53]">New Email</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPlayingEmail(true);
                      speakText(
                        `Hi there, I'm excited to get started on the client project. We'll have a kickoff meeting next Monday at 10 AM Eastern Standard Time with the client team. Could you please review the attached agenda and let me know if you have any questions or suggestions? Best, Lisa.`
                      );
                      setTimeout(() => setIsPlayingEmail(false), 8000);
                    }}
                    title="Listen to audio of this email"
                    className="text-[10px] text-[#8C4A55] hover:text-[#67303A] font-semibold flex items-center space-x-1 bg-white/70 px-2 py-0.5 rounded-full border border-[#E8CCD1]"
                  >
                    <span>{isPlayingEmail ? '🔊 Playing...' : '🔈 Read Aloud'}</span>
                  </button>
                </div>

                <div className="p-3 text-[11px] text-[#425D67] flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start space-x-2 mb-2 pb-2 border-b border-gray-100">
                      <span className="w-6 h-6 rounded bg-[#E4ECEF] text-[#365A68] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        LD
                      </span>
                      <div className="leading-tight">
                        <p className="font-bold text-[#1E3A45]">Lisa Chen</p>
                        <p className="text-[10px] text-gray-500 truncate">Kickoff meeting next week</p>
                      </div>
                    </div>
                    <p className="mb-2">Hi there,</p>
                    <p className="mb-2 text-[#465E67] leading-relaxed">
                      I'm excited to get started on the client project. We'll have a kickoff meeting next Monday at 10 AM (EST) with the client team.
                    </p>
                    <p className="text-[#465E67] leading-relaxed">
                      Could you please review the attached agenda and let me know if you have any questions or suggestions?
                    </p>
                    <p className="mt-2 text-gray-500">
                      Best,<br />Lisa
                    </p>
                  </div>

                  {/* Attachment button */}
                  <button
                    onClick={onOpenAgendaModal}
                    className="mt-auto w-full text-left bg-[#F7FAFC] hover:bg-[#EEF5F9] border border-[#E3EDF2] hover:border-[#BED6E3] rounded-lg p-2 flex items-center space-x-2 transition group"
                  >
                    <span className="text-base text-gray-400 group-hover:text-[#274855]">📎</span>
                    <div className="truncate leading-tight flex-1">
                      <span className="font-semibold text-[#274855] block text-[10px] truncate">
                        Meeting_Agenda.pdf
                      </span>
                      <span className="text-[9px] text-gray-400">328 KB · Click to Preview</span>
                    </div>
                    <span className="text-[10px] text-[#3A6B7E] font-bold">Open</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Your Reply */}
              <div className="bg-white rounded-xl border border-[#DFE8E0] shadow-xs flex flex-col overflow-hidden">
                <div className="bg-[#EFF5EE] px-3.5 py-2 border-b border-[#DFEADB] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">✍️</span>
                    <span className="text-xs font-bold text-[#546E4F]">Your Reply</span>
                  </div>
                  {stepStatus[2] && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Checked ✓
                    </span>
                  )}
                </div>

                <div className="p-3 text-[11px] text-[#425D67] flex-1 flex flex-col justify-between space-y-2">
                  <div className="bg-[#FBFDFB] p-2 rounded-lg border border-[#E9F0E8] font-sans">
                    <textarea
                      rows={5}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-transparent text-[#284550] text-[11px] resize-none focus:outline-none leading-relaxed"
                      placeholder="Type your professional reply..."
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500 font-medium">Tone:</span>
                      <select
                        value={replyTone}
                        onChange={(e) => setReplyTone(e.target.value)}
                        className="text-[10.5px] py-1 px-2 border border-gray-200 rounded-md bg-white text-[#294B58] font-medium focus:ring-1 focus:ring-sky-200"
                      >
                        <option>Professional & Friendly</option>
                        <option>Casual</option>
                        <option>Formal</option>
                        <option>Concise & Direct</option>
                        <option>Diplomatic</option>
                      </select>
                    </div>

                    <button
                      onClick={handleCheckReply}
                      disabled={isAnalyzing}
                      className="w-full py-2 px-3 rounded-lg bg-[#274753] hover:bg-[#1B3640] text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-xs disabled:opacity-70 active:scale-98"
                    >
                      <span>✨</span>
                      <span>{isAnalyzing ? 'Analyzing...' : 'Check My Reply'}</span>
                    </button>
                    <span className="block text-[9px] text-center text-gray-400">
                      Get AI feedback on your message
                    </span>

                    {replyFeedback && (
                      <div className="bg-[#F3FAF5] border border-[#CCE7D4] rounded-lg p-2.5 text-[10px] space-y-1.5 mt-2 transition-all">
                        <div className="flex items-center justify-between font-bold text-emerald-800">
                          <span>Quality: {replyFeedback.score}/100</span>
                          <span className="text-[9.5px] font-normal">{replyFeedback.toneMatch}</span>
                        </div>
                        <ul className="text-gray-600 list-disc list-inside space-y-0.5">
                          {replyFeedback.strengths.map((str, idx) => (
                            <li key={idx}>{str}</li>
                          ))}
                        </ul>
                        {replyFeedback.suggestion && (
                          <p className="text-[#356149] italic border-t border-emerald-100 pt-1">
                            {replyFeedback.suggestion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Prepare to Speak */}
              <div className="bg-white rounded-xl border border-[#DFEBF0] shadow-xs flex flex-col overflow-hidden">
                <div className="bg-[#EBF3F7] px-3.5 py-2 border-b border-[#D6E5ED] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">🎙️</span>
                    <span className="text-xs font-bold text-[#355B69]">Prepare to Speak</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsPlayingModelAudio(true);
                      speakText(
                        `Hi, I'm Alex. I'll be supporting the project on the product side. I'd like to suggest a small change to the timeline. Could we discuss that during the meeting?`,
                        1,
                        0.9
                      );
                      setTimeout(() => setIsPlayingModelAudio(false), 7000);
                    }}
                    className="text-[10px] text-[#355B69] hover:text-[#1F3D47] font-semibold flex items-center space-x-1 bg-white/70 px-2 py-0.5 rounded-full border border-[#C6DBE6]"
                  >
                    <span>{isPlayingModelAudio ? '🔊 Playing...' : '🔈 Model Audio'}</span>
                  </button>
                </div>

                <div className="p-3 text-[11px] text-[#425D67] flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-[11px] text-[#46606A] leading-relaxed mb-2">
                      You'll join the meeting and briefly introduce your role, share one key point, and ask a question.
                    </p>
                    <div className="bg-[#FBECEF] p-2.5 rounded-lg border border-[#F2D0D7] text-[10.5px]">
                      <span className="font-bold text-[#8B4853] block mb-1">Try saying:</span>
                      <p className="italic text-[#753E47] leading-relaxed">
                        "Hi, I'm Alex. I'll be supporting the project on the product side. I'd like to suggest a small change to the timeline. Could we discuss that during the meeting?"
                      </p>
                    </div>

                    {isRecording && (
                      <div className="mt-2 bg-[#F0F7FB] border border-[#C5DFEE] p-2 rounded-lg text-[10px]">
                        <div className="flex items-center justify-between text-[#245266] font-bold mb-1">
                          <span className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <span>Listening... ({recordTimer}s)</span>
                          </span>
                          <span className="font-mono text-xs text-rose-600">REC</span>
                        </div>
                        <p className="text-[#325260] italic">
                          {transcript || 'Speak now into your microphone...'}
                        </p>
                      </div>
                    )}

                    {speechScore !== null && !isRecording && (
                      <div className="mt-2 bg-[#F2FAF5] border border-[#CCE8D5] p-2 rounded-lg text-[10px] text-[#245A3E]">
                        <div className="flex items-center justify-between font-bold">
                          <span>Speech Score: {speechScore}/100</span>
                          <span className="text-emerald-600">Great Flow!</span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          Pacing: 135 wpm (Optimal). Clear pronunciation on "supporting" and "timeline".
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 space-y-1">
                    <button
                      onClick={toggleRecording}
                      className={`w-full py-2.5 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-98 ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                          : 'bg-gradient-to-r from-[#2B4B58] to-[#1F3943] hover:brightness-110'
                      }`}
                    >
                      <span className="text-base">{isRecording ? '⏹️' : '🎙️'}</span>
                      <span>{isRecording ? 'Stop & Evaluate' : 'Start Speaking'}</span>
                    </button>
                    <span className="block text-[9px] text-center text-gray-400">
                      Practice with AI and get real-time feedback
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* LEARN TAB */}
        {activeTab === 'learn' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1F3D47]">
                Mastering Kickoff Meetings & Polite Phrasing
              </h3>
              <p className="text-xs text-[#526D77] mt-0.5">
                Essential vocabulary and sentence structures for international workplace collaboration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  term: 'Kickoff meeting',
                  phonetic: '/ˈkɪk.ɒf ˈmiː.tɪŋ/',
                  meaning: 'The initial gathering with stakeholders to align on goals and timeline.',
                  sample: "Let's schedule a kickoff meeting next Monday to align expectations.",
                },
                {
                  term: 'Touch base',
                  phonetic: '/tʌtʃ beɪs/',
                  meaning: 'Briefly contact or consult with someone to update each other.',
                  sample: "I'll touch base with the design team before we send the final deck.",
                },
                {
                  term: 'Action items',
                  phonetic: '/ˈæk.ʃən ˌaɪ.təmz/',
                  meaning: 'Specific documented tasks assigned to individuals following a discussion.',
                  sample: 'At the end of the call, we reviewed the key action items for the week.',
                },
                {
                  term: 'Deliverable',
                  phonetic: '/dɪˈlɪv.ər.ə.bəl/',
                  meaning: 'A tangible product or service to be provided as part of a commitment.',
                  sample: 'Our primary deliverable this quarter is the new onboarding flow.',
                },
              ].map((vocab, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#20404C]">{vocab.term}</span>
                    <button
                      onClick={() => speakText(vocab.term)}
                      className="text-xs text-[#8C4A55] hover:text-[#5B2A32] flex items-center space-x-1"
                    >
                      <span>🔈</span>
                      <span className="text-[10px]">{vocab.phonetic}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#4F6D7A]">{vocab.meaning}</p>
                  <div className="bg-[#F8FAFC] p-2 rounded-md border border-gray-100 text-[11px] italic text-gray-700">
                    "{vocab.sample}"
                  </div>
                </div>
              ))}
            </div>

            {/* Direct vs Diplomatic Phrasing */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="bg-[#F4F8FA] px-4 py-2 border-b border-gray-200 font-bold text-xs text-[#20404C]">
                Corporate Politeness: Direct vs. Diplomatic Phrasing
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="grid grid-cols-2 p-3 gap-3 bg-gray-50/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <span>Too Direct / Blunt ⚠️</span>
                  <span>Polite & Executive ✨</span>
                </div>
                <div className="grid grid-cols-2 p-3 gap-3">
                  <span className="text-rose-700">"The timeline is impossible."</span>
                  <span className="text-emerald-800 font-medium">
                    "I'd recommend adjusting the milestone slightly so we can ensure the highest quality."
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 gap-3">
                  <span className="text-rose-700">"What do you mean?"</span>
                  <span className="text-emerald-800 font-medium">
                    "Could you help clarify the scope of that deliverable?"
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 gap-3">
                  <span className="text-rose-700">"I didn't do it."</span>
                  <span className="text-emerald-800 font-medium">
                    "That item wasn't originally flagged on our side, but I can look into it right away."
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE TAB */}
        {activeTab === 'practice' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1F3D47]">Quick-Fire Meeting Scenario</h3>
              <p className="text-xs text-[#526D77] mt-0.5">
                How would you react in this realistic scenario? Pick the best approach.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#E5F1F7] text-[#295669] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  LC
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1F3D47]">Lisa Chen during the kickoff call:</h4>
                  <p className="text-xs text-[#41606C] mt-1 bg-[#F9FBFC] p-3 rounded-lg border border-gray-100 leading-relaxed italic">
                    "Alex, the client is asking if we can move the demo up by three days to Thursday. Can your team commit to that?"
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  {
                    id: 1,
                    text: "No, that's way too rushed and we won't have enough time.",
                    correct: false,
                    eval: 'Too abrupt and negative. In front of a client, focus on constructive solutions rather than a flat "no".',
                  },
                  {
                    id: 2,
                    text: "I'd love to help make that happen. Let me review the dependencies with the engineering team immediately after this call and confirm what scope we can reliably showcase by Thursday.",
                    correct: true,
                    eval: 'Excellent! Demonstrates helpfulness, manages expectations responsibly, and commits to a specific follow-up time.',
                  },
                  {
                    id: 3,
                    text: 'Sure! No problem at all, we can do whatever they want!',
                    correct: false,
                    eval: 'Risky over-promising without checking bandwidth first, which can cause credibility issues later.',
                  },
                ].map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => {
                      setSelectedScenarioChoice(choice.id);
                      setScenarioFeedback(choice.eval);
                      if (choice.correct) playSound('ding');
                      else playSound('error');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                      selectedScenarioChoice === choice.id
                        ? choice.correct
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                        : 'bg-gray-50/70 hover:bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(64 + choice.id)}
                      </span>
                      <span className="flex-1">{choice.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {scenarioFeedback && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    selectedScenarioChoice === 2
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}
                >
                  <p className="font-semibold mb-0.5">
                    {selectedScenarioChoice === 2 ? '🎯 Outstanding Choice!' : '💡 Learning Opportunity:'}
                  </p>
                  <p>{scenarioFeedback}</p>
                </div>
              )}
            </div>

            <div className="bg-[#F6FAFC] border border-[#D5E5EE] p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">👩🏻</span>
                <span className="text-xs text-[#2A4C59] font-medium">
                  Want to roleplay this live with Maya in Messenger?
                </span>
              </div>
              <button
                onClick={() => {
                  playSound('click');
                  onMessageMaya("Hey Maya! Let's practice answering unexpected client questions in a meeting.");
                }}
                className="px-3 py-1.5 rounded-lg bg-[#2D505E] text-white font-semibold text-xs hover:bg-[#1E3B46] transition"
              >
                Chat with Maya
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#1F3D47]">Mission Assessment & Scorecard</h3>
              <p className="text-xs text-[#526D77] mt-0.5">
                Real-time evaluation based on professional workplace communication benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs text-center space-y-1">
                <span className="text-xs text-gray-500 font-medium">Written Reply</span>
                <div className="text-3xl font-serif font-bold text-[#234551]">96%</div>
                <span className="text-[10px] text-emerald-600 font-semibold">Exemplary Tone</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs text-center space-y-1">
                <span className="text-xs text-gray-500 font-medium">Spoken Delivery</span>
                <div className="text-3xl font-serif font-bold text-[#234551]">
                  {speechScore ? `${speechScore}%` : '92%'}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Natural Pace</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs text-center space-y-1">
                <span className="text-xs text-gray-500 font-medium">Business Vocabulary</span>
                <div className="text-3xl font-serif font-bold text-[#234551]">100%</div>
                <span className="text-[10px] text-emerald-600 font-semibold">4/4 Key Terms</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs space-y-3">
              <h4 className="font-bold text-xs text-[#20404C] uppercase tracking-wider">
                Milestone Verification
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800">
                  <span>✓</span>
                  <span>Reviewed client project kickoff briefing and agenda</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-800">
                  <span>✓</span>
                  <span>Formulated professional written response with polite tone</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-800">
                  <span>✓</span>
                  <span>Practiced verbal self-introduction and collaborative question</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCompleteMission}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#CB7A86] to-[#A85864] hover:brightness-105 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2 active:scale-98"
              >
                <span>🎉</span>
                <span>Complete Mission & Claim +150 XP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
