import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/os';
import { playSound, speakText } from '../utils/audio';

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
      tips: 'You can test an introduction, negotiate a deadline, or ask for feedback on your phrasing.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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

  const generateMayaResponse = (userText: string): { text: string; tips?: string } => {
    const t = userText.toLowerCase();

    if (t.includes('timeline') || t.includes('delay') || t.includes('deadline')) {
      return {
        text: `That's a very common workplace situation! When discussing timelines, try framing it around quality and risk mitigation: "To guarantee reliable performance at launch, I recommend allocating an extra two days for QA." Would you like to practice saying that out loud?`,
        tips: 'Notice how "risk mitigation" sounds much more strategic than "we are behind schedule".',
      };
    }

    if (t.includes('disagree') || t.includes('conflict') || t.includes('interrupt') || t.includes('no')) {
      return {
        text: `Navigating disagreements gracefully is a leadership superpower! Instead of "I disagree with you", try: "I see where you are coming from. Another perspective to explore is..." How does that phrasing feel to you?`,
        tips: 'Using "perspective to explore" builds collaboration without confrontation.',
      };
    }

    if (t.includes('hi') || t.includes('hello') || t.includes('alex') || t.includes('intro')) {
      return {
        text: `Nice to hear from you! Your greeting was warm and clear. Let's do a roleplay: pretend I am the client's executive sponsor. Go ahead and introduce yourself and your role!`,
        tips: 'Keep your intro under 30 seconds: 1) Who you are, 2) Key deliverable, 3) Collaborative question.',
      };
    }

    if (t.includes('agenda') || t.includes('kickoff') || t.includes('meeting')) {
      return {
        text: `Great! In kickoff calls, keeping your intro crisp is ideal: 1) Who you are, 2) Your key deliverable, 3) Enthusiasm for collaboration. Try phrasing yours now!`,
        tips: 'Clear opening sets a confident tone for the entire project.',
      };
    }

    return {
      text: `Nicely phrased! That sounds very natural and professional. To elevate it further to an executive level, make sure to keep your tone measured and pause deliberately after your main point. What scenario should we drill next?`,
      tips: 'Pausing gives stakeholders time to digest your insight and projects poise.',
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
      setIsRecording(true);
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
          setIsRecording(false);
        }
      } else {
        setTimeout(() => {
          setInputText("Hi Maya, let's practice pitching our project timeline.");
          setIsRecording(false);
        }, 1500);
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
              👩🏻
            </span>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>
          <div>
            <h4 className="font-bold text-[#1E3B46] leading-tight">Maya</h4>
            <span className="text-[10px] text-gray-500">AI Practice Partner · Online</span>
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
                  👩🏻
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
                    💡 {msg.tips}
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
                <span>🔈</span>
                <span>Listen</span>
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <span className="w-6 h-6 rounded-full bg-[#EAF2F7] text-xs flex items-center justify-center flex-shrink-0 border border-[#CDE1EC]">
              👩🏻
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
          💡 Introduce Idea
        </button>
        <button
          onClick={() => handleSend("How can I ask to push back a deadline without sounding unprepared?")}
          className="text-[10px] bg-white border border-gray-200 text-[#2B4E5D] px-2 py-0.5 rounded-full hover:bg-sky-50 whitespace-nowrap transition"
        >
          🗓️ Negotiate Timeline
        </button>
        <button
          onClick={() => handleSend("What are polite ways to disagree with a senior stakeholder's proposal?")}
          className="text-[10px] bg-white border border-gray-200 text-[#2B4E5D] px-2 py-0.5 rounded-full hover:bg-sky-50 whitespace-nowrap transition"
        >
          🤝 Disagree Politely
        </button>
      </div>

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
          <span className="text-sm">{isRecording ? '⏹️' : '🎙️'}</span>
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Message Maya... (Press Enter to send)"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#20404C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2C5261]"
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
