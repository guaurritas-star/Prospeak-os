import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/os';
import { playSound, speakText } from '../utils/audio';
import { ProSpeakIcon } from './ProSpeakIcon';
import { Lightbulb, CalendarClock, Handshake, Volume2, Mic, Square } from 'lucide-react';

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
      tips: 'Choose a situation: introductions, meetings, or expressing opinions. Maya uses scripted prompts in this prototype.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micIssue, setMicIssue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognitionRef = useRef<any>(null);

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

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    playSound('click');
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = generateMayaResponse(text);
      const mayaMsg: ChatMessage = {
        id: `maya_${Date.now()}`,
        sender: 'maya',
        text: resp.text,
        tips: resp.tips,
      };
      setMessages((prev) => [...prev, mayaMsg]);
      setIsTyping(false);
      playSound('ding');
      speakText(resp.text);
    }, 1200);
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
            handleSend(transcript);
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
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#F8FAFB] text-xs select-none">
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
            <span className="text-[10px] text-gray-500">Scripted Practice · Demo</span>
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
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message Maya... (Press Enter to send)"
          className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-base text-[#20404C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5261]"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="px-3 py-2 rounded-xl bg-[#294B59] hover:bg-[#1E3B46] disabled:opacity-40 text-white font-semibold text-xs transition active:scale-95"
          title="Send Message"
        >
          Send
        </button>
      </div>
    </div>
  );
};
