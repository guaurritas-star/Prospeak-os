import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/os';
import { playSound, speakText } from '../utils/audio';
import { ProSpeakIcon } from './ProSpeakIcon';
import { Lightbulb, CalendarClock, Handshake, Volume2, Mic, Square } from 'lucide-react';
import { askMaya, getMayaStatus, startMayaSession, isMayaAIConfigured, mayaTurnstileSiteKey } from '../utils/ai';
import { MayaVerification } from './MayaVerification';

interface MessengerWindowProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const MessengerWindow: React.FC<MessengerWindowProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'maya',
      text: "Hi! Ready to practice for your meeting? What would you like to focus on today?",
      tips: 'Choose a topic or share what you want to practice.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micIssue, setMicIssue] = useState('');
  const [aiIssue, setAiIssue] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [sessionExpiresAt, setSessionExpiresAt] = useState(0);
  const [sessionChecking, setSessionChecking] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking'|'ready'|'guided'>(isMayaAIConfigured?'checking':'guided');
  const [challengeVersion, setChallengeVersion] = useState(0);
  const sendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // If Gemini is disabled, explicitly show scripted mode instead of claiming to be an AI.
  useEffect(() => {
    if(!isMayaAIConfigured)return;
    const controller=new AbortController();
    getMayaStatus(controller.signal)
      .then(ready=>{if(!controller.signal.aborted)setAiStatus(ready?'ready':'guided');})
      .catch(()=>{if(!controller.signal.aborted)setAiStatus('guided');});
    return ()=>controller.abort();
  },[]);

  // Turnstile is redeemed once when opening a protected session, not for every message.
  useEffect(()=>{
    if(aiStatus!=='ready'||!verificationToken)return;
    const controller=new AbortController();
    setSessionChecking(true);
    startMayaSession(verificationToken,controller.signal)
      .then(result=>{
        if(controller.signal.aborted)return;
        setSessionToken(result.token);
        setSessionExpiresAt(Date.now()+result.expiresIn*1000);
        setAiIssue('');
      })
      .catch(err=>{
        if(controller.signal.aborted)return;
        setAiIssue(err instanceof Error?err.message:'Could not verify this session.');
        setVerificationToken('');
        setChallengeVersion(v=>v+1);
      })
      .finally(()=>{if(!controller.signal.aborted)setSessionChecking(false);});
    return ()=>controller.abort();
  },[verificationToken,aiStatus]);

  const canChatWithAI = aiStatus==='ready';
  const hasCurrentSession = !!sessionToken && sessionExpiresAt>Date.now()+5000;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialPrompt) {
      handleSend(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  // Scripted practice for the prototype. There is no generative AI integration yet.
  const generateMayaResponse = (userText: string): { text: string; tips?: string } => {
    const t = userText.toLowerCase();
    if (/\b(deadline|timeline|delay|reschedul|time)\b/.test(t)) {
      return {
        text: "Let's roleplay: I'm your teammate. Our meeting is at 2 PM, but you have another commitment. How would you ask me to change the time politely?",
        tips: 'You can try: "Could we move it to…?" This is a scripted prompt, not an evaluation.',
      };
    }
    if (/\b(disagree|conflict|concern|opinion)\b/.test(t)) {
      return {
        text: "Let's practice expressing a different opinion. I think the project is ready to launch today. What would you say if you disagreed?",
        tips: 'You can begin with: "I see your point, but…" No automated grammar assessment is available yet.',
      };
    }
    if (/\b(hi|hello|introduc|intro|name|role)\b/.test(t)) {
      return {
        text: "Nice to meet you! Let's pretend this is our first team meeting. What do you do, and what are you working on?",
        tips: 'A helpful structure is: name, role, and one project detail.',
      };
    }
    if (/\b(agenda|kickoff|meeting)\b/.test(t)) {
      return {
        text: "We have a kickoff meeting on Monday. What would you like to ask before it starts?",
        tips: 'Try a specific question using "Could you clarify…?"',
      };
    }
    return {
      text: "Let's continue practicing. Would you prefer a self-introduction, a meeting reschedule, or sharing an opinion?",
      tips: 'This prototype selects replies from a small set of scenarios and cannot assess your English.',
    };
  };


  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim().slice(0,1000);
    if (!text || sendingRef.current) return;
    if(aiStatus==='checking'){
      setAiIssue('Checking Maya connection. Please try again in a moment.');
      return;
    }
    if(canChatWithAI && !hasCurrentSession){
      setInputText(text);
      setSessionToken('');
      setVerificationToken('');
      setChallengeVersion(v=>v+1);
      setAiIssue('Please complete the one-time security check to begin chatting.');
      return;
    }
    sendingRef.current = true;
    setAiIssue('');
    playSound('click');
    const userMsg: ChatMessage = { id: 'usr_' + Date.now(), sender:'user', text };
    const history = [...messages,userMsg];
    setMessages(history);
    setInputText('');
    setIsTyping(true);
    try {
      let responseText: string;
      let responseTips: string | undefined;
      if (canChatWithAI) {
        responseText = await askMaya(history,sessionToken);
      } else {
        const scripted = generateMayaResponse(text);
        responseText = scripted.text;
        responseTips = scripted.tips;
      }
      const mayaMsg: ChatMessage = {
        id:'maya_'+Date.now(),sender:'maya',text:responseText,tips:responseTips,
      };
      setMessages(prev=>[...prev,mayaMsg]);
      playSound('ding');
    } catch (err) {
      if(err instanceof Error && err.name==='SessionExpiredError'){
        setSessionToken('');setVerificationToken('');setSessionExpiresAt(0);
        setChallengeVersion(v=>v+1);
      }
      setAiIssue(err instanceof Error ? err.message : 'Service temporarily unavailable.');
      // Keep the draft and remove the unanswered bubble so students can retry.
      setInputText(text);
      setMessages(prev=>prev.filter(m=>m.id!==userMsg.id));
    } finally {
      sendingRef.current=false;
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    playSound('click');
    setMessages([
      {
        id: 'm_fresh',
        sender: 'maya',
        text: "Conversation cleared! What would you like to practice now?",
      },
    ]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      } catch {
        // Ignore
      }
    } else {
      setMicIssue('');
      playSound('click');
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = false;
          rec.interimResults = false;
          rec.lang = 'en-US';
          rec.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInputText(transcript);
            setIsRecording(false);
            // Keep transcript editable; require user to press Send.
          };
          rec.onerror = () => setIsRecording(false);
          rec.onend = () => setIsRecording(false);
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {
          setMicIssue('Microphone unavailable. Please type your message instead.');
          setIsRecording(false);
        }
      } else {
        setMicIssue('Speech recognition is not supported in this browser. You can type your response.');
      }
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden bg-[#F8FAFB] text-xs">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-3.5 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <span className="w-8 h-8 rounded-full bg-[#EBF3F8] text-base flex items-center justify-center border border-[#BED7E5]">
              <ProSpeakIcon name="messenger" size={24} />
            </span>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>
          <div>
            <h4 className="font-bold text-[#1E3B46] leading-tight">Maya</h4>
            <span className="text-[10px] text-gray-500">{aiStatus==='ready' ? 'AI Conversation · Gemini' : aiStatus==='checking' ? 'Connecting…' : 'Guided Practice · Demo'}</span>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-[10.5px] font-medium text-gray-500 hover:text-rose-700 hover:bg-gray-100 px-2 py-1 rounded transition"
          title="Reset Chat"
        >
          Clear
        </button>
      </div>

      <p className="px-3 py-1.5 text-[11px] bg-[#EFF5F7] text-[#526E7D] border-b border-[#E0EBEF]">
        {aiStatus==='ready' ? 'Gemini is available. You are protected by a short, verified session. Avoid sensitive details.' : aiStatus==='checking' ? 'Checking Gemini availability…' : 'Gemini is not active yet. You can practice with guided scenarios while the service is being enabled.'}
      </p>
      {aiIssue && <div role="alert" className="bg-[#F9EDEF] text-[#864F5A] px-3 py-2 text-xs">Maya couldn't reply: {aiIssue} Your message remains in the text field so you can retry.</div>}
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start space-x-2 max-w-[88%]">
              {msg.sender === 'maya' && (
                <span className="w-6 h-6 rounded-full bg-[#EAF2F7] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#CDE1EC]">
                  <ProSpeakIcon name="messenger" size={24} />
                </span>
              )}
              <div
                className={`p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#294B59] text-white rounded-br-xs'
                    : 'bg-white text-[#20404C] border border-[#DEE8EE] rounded-bl-xs'
                }`}
              >
                <p>{msg.text}</p>
                {msg.tips && (
                  <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-[10px] text-[#4A7285] italic">
                    <Lightbulb size={14} className="inline-block mr-1" /> {msg.tips}
                  </div>
                )}
              </div>
            </div>

            {msg.sender === 'maya' && (
              <button
                onClick={() => speakText(msg.text)}
                className="text-[9.5px] text-gray-400 hover:text-[#254654] flex items-center space-x-1 ml-8 mt-1"
                title="Listen to this message"
              >
                <Volume2 size={16} />
                <span>Listen</span>
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <span className="w-6 h-6 rounded-full bg-[#EAF2F7] text-xs flex items-center justify-center flex-shrink-0 border border-[#CDE1EC]">
              <ProSpeakIcon name="messenger" size={24} />
            </span>
            <span className="italic text-[10.5px] text-gray-500">Maya is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt suggestions pills */}
      <div className="px-3 py-1.5 bg-[#F0F5F8] border-t border-gray-200 flex items-center space-x-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
        <span className="text-[10px] font-semibold text-gray-400 flex-shrink-0">Try:</span>
        <button
          onClick={() => handleSend("Let's practice how to introduce a new idea during a sprint sync.")}
          className="text-[10px] bg-white border border-gray-200 text-[#2B4E5D] px-2 py-0.5 rounded-full hover:bg-sky-50 whitespace-nowrap transition"
        >
          <Lightbulb size={14} className="inline-block mr-1" /> Introduce Idea
        </button>
        <button
          onClick={() => handleSend("How can I ask to push back a deadline without sounding unprepared?")}
          className="text-[10px] bg-white border border-gray-200 text-[#2B4E5D] px-2 py-0.5 rounded-full hover:bg-sky-50 whitespace-nowrap transition"
        >
          <CalendarClock size={14} className="inline-block mr-1" /> Negotiate Timeline
        </button>
        <button
          onClick={() => handleSend("What are polite ways to disagree with a senior stakeholder's proposal?")}
          className="text-[10px] bg-white border border-gray-200 text-[#2B4E5D] px-2 py-0.5 rounded-full hover:bg-sky-50 whitespace-nowrap transition"
        >
          <Handshake size={14} className="inline-block mr-1" /> Disagree Politely
        </button>
      </div>

      {canChatWithAI && !hasCurrentSession && !sessionChecking &&
        <MayaVerification siteKey={mayaTurnstileSiteKey}
          onToken={setVerificationToken} refreshKey={challengeVersion}/>}
      {canChatWithAI && (hasCurrentSession || sessionChecking) &&
        <div role="status" className="px-3 py-1 text-[11px] text-[#4A7868] border-t border-[#DFE9EE] bg-[#F3F8F5]">
          {sessionChecking ? 'Securing conversation…' : 'Protected conversation · Ready to chat'}
        </div>}
      {micIssue && <p role="status" className="text-xs px-3 py-2 bg-[#F8EBEF] text-[#7C4655]">{micIssue}</p>}

      {/* Input bar */}
      <div className="bg-white border-t border-gray-200 p-2.5 flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={toggleRecording}
          className={`p-2 rounded-xl transition ${
            isRecording
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title={isRecording ? 'Listening...' : 'Voice message'}
        >
          <span className="text-sm">{isRecording ? <Square size={16} /> : <Mic size={16} />}</span>
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSend()}
          placeholder="Message Maya... (Press Enter to send)"
          className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-base text-[#20404C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5261]"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping || aiStatus==='checking' || (canChatWithAI && !hasCurrentSession)}
          className="px-3 py-2 rounded-xl bg-[#294B59] hover:bg-[#1E3B46] disabled:opacity-40 text-white font-semibold text-xs transition active:scale-95"
          title="Send Message"
        >
          Send
        </button>
      </div>
    </div>
  );
};
