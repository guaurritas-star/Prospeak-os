import React, { useState } from 'react';
import { playSound, speakText } from '../utils/audio';

export const ProgressWindow: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isWordListOpen, setIsWordListOpen] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    '"Small conversations create big opportunities."',
    '"Confidence comes from preparation, not perfection."',
    '"Every question asked is a step toward leadership."',
    '"Clarity in communication is kindness to your team."',
  ];

  const handleNextQuote = () => {
    playSound('click');
    const nextIdx = (quoteIndex + 1) % quotes.length;
    setQuoteIndex(nextIdx);
    speakText(quotes[nextIdx], 1, 0.95);
  };

  const confidenceScore = timeframe === 'week' ? 72 : timeframe === 'month' ? 81 : 89;
  const vocabularyCount = timeframe === 'week' ? 48 : timeframe === 'month' ? 142 : 380;
  const streakDays = timeframe === 'week' ? 7 : timeframe === 'month' ? 24 : 45;

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50 p-3 select-none relative">
      {/* Top Header bar with time selector */}
      <div className="flex items-center justify-between pb-1 px-1 border-b border-gray-100 flex-shrink-0">
        <span className="text-[10px] font-bold text-[#5B7783] uppercase tracking-wider">
          Performance Overview
        </span>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="text-[11px] py-0.5 px-2 border-0 bg-transparent text-[#385B69] font-bold focus:ring-0 cursor-pointer"
        >
          <option value="week">This Week ▾</option>
          <option value="month">This Month ▾</option>
          <option value="all">All Time ▾</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-auto">
        {/* Card 1: Confidence Gauge */}
        <div
          onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
          className="bg-white rounded-xl border border-gray-100 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs hover:border-[#BEDBE8] cursor-pointer transition group"
          title="Click to view confidence breakdown"
        >
          <span className="text-[10px] font-bold text-[#355765] block leading-tight mb-1">
            Conversation Confidence
          </span>
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center my-1">
            <svg className="w-13 h-13 sm:w-14 sm:h-14 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E7EFF3]"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-[#597B6A] transition-all duration-700 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${confidenceScore}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute font-serif font-bold text-xs text-[#203F4C]">
              {confidenceScore}%
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 mt-1">↑ +12%</span>
          <span className="text-[9px] text-gray-400">from last {timeframe}</span>
        </div>

        {/* Card 2: Vocabulary Learned */}
        <div
          onClick={() => setIsWordListOpen(true)}
          className="bg-white rounded-xl border border-gray-100 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs hover:border-[#BEDBE8] cursor-pointer transition group"
          title="Click to browse your learned vocabulary deck"
        >
          <span className="text-[10px] font-bold text-[#355765] block leading-tight mb-1">
            Vocabulary Learned
          </span>
          <div className="my-1 sm:my-1.5 flex flex-col items-center">
            <span className="text-xl group-hover:scale-110 transition-transform">📕</span>
            <span className="font-serif font-bold text-base sm:text-lg text-[#203F4C] leading-none mt-1">
              {vocabularyCount}
            </span>
            <span className="text-[9px] text-gray-400 mt-0.5">new words</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 mt-auto">↑ +18</span>
          <span className="text-[9px] text-gray-400">view word list →</span>
        </div>

        {/* Card 3: Weekly Streak */}
        <div className="bg-white rounded-xl border border-gray-100 p-2 sm:p-2.5 flex flex-col items-center text-center shadow-xs">
          <span className="text-[10px] font-bold text-[#355765] block leading-tight mb-1">
            Weekly Streak
          </span>
          <div className="flex items-center space-x-1 my-1">
            <span className="text-base text-rose-500 animate-pulse">🔥</span>
            <span className="font-serif font-bold text-base sm:text-lg text-[#203F4C]">
              {streakDays}
            </span>
            <span className="text-[10px] text-gray-400">days</span>
          </div>
          <div className="flex items-center space-x-0.5 my-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#CB7A86] text-white flex items-center justify-center text-[7px]">
              ✓
            </span>
            <span className="w-2.5 h-2.5 rounded-full border border-gray-300" />
          </div>
          <span className="text-[9.5px] font-semibold text-[#8B4D56] mt-auto">
            Great consistency!
          </span>
        </div>
      </div>

      {/* Confidence Breakdown Card */}
      {isBreakdownOpen && (
        <div className="bg-[#EBF3F8] border border-[#C6DCED] rounded-xl p-2.5 text-[10.5px] space-y-1 my-1 text-[#254654] animate-in fade-in zoom-in-95">
          <div className="flex justify-between font-bold">
            <span>Skill Breakdown:</span>
            <button onClick={() => setIsBreakdownOpen(false)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              Meeting Introductions: <strong className="text-emerald-700">82%</strong>
            </div>
            <div>
              Diplomatic Disagreement: <strong className="text-emerald-700">76%</strong>
            </div>
            <div>
              Q&A Deflection: <strong className="text-emerald-700">70%</strong>
            </div>
            <div>
              Closing & Action Items: <strong className="text-emerald-700">88%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Quote of the Day Footer */}
      <div className="bg-[#F4F9F8] rounded-xl p-2.5 border border-[#E0EFEA] flex items-center justify-between mt-auto flex-shrink-0">
        <div className="flex items-center space-x-2 truncate">
          <span className="text-xl flex-shrink-0">🦎</span>
          <span className="text-[10px] font-medium text-[#2E4F44] italic truncate">
            {quotes[quoteIndex]}
          </span>
        </div>
        <button
          onClick={handleNextQuote}
          className="px-2 py-0.5 rounded-full bg-[#FCE8EB] hover:bg-[#F9D6DC] text-[#8C4652] text-[9.5px] font-bold whitespace-nowrap transition active:scale-95 flex-shrink-0 ml-2"
        >
          Keep going!
        </button>
      </div>

      {/* Vocabulary Drawer */}
      {isWordListOpen && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 p-4 flex flex-col justify-between rounded-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-2">
              <span className="text-base">📕</span>
              <h4 className="font-bold text-xs text-[#20404C]">Recently Mastered Vocabulary (48)</h4>
            </div>
            <button
              onClick={() => setIsWordListOpen(false)}
              className="text-gray-400 hover:text-gray-700 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 space-y-2 text-xs">
            {[
              {
                w: 'Stakeholder',
                m: 'A person with an interest or concern in something.',
                ex: 'Aligning all key stakeholders is essential.',
              },
              {
                w: 'Bandwidth',
                m: 'The energy or mental capacity required to deal with a task.',
                ex: 'I do not have the bandwidth this afternoon.',
              },
              {
                w: 'Deliverable',
                m: 'A tangible product or service delivered.',
                ex: 'The slides are our primary deliverable.',
              },
              {
                w: 'Synergy',
                m: 'Interaction producing a combined effect greater than the sum.',
                ex: 'There is strong synergy between our teams.',
              },
              {
                w: 'Circle back',
                m: 'Discuss or address a topic again later.',
                ex: "Let's circle back tomorrow morning.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-2 rounded-lg border border-gray-100 flex items-start justify-between"
              >
                <div>
                  <div className="font-bold text-[#203E4A]">{item.w}</div>
                  <div className="text-[10px] text-gray-500">{item.m}</div>
                  <div className="text-[10px] italic text-[#4A6E7D]">"{item.ex}"</div>
                </div>
                <button
                  onClick={() => speakText(item.w)}
                  className="text-xs text-[#8A4A54] hover:text-[#5B2932] p-1"
                >
                  🔈
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsWordListOpen(false)}
            className="w-full py-1.5 rounded-lg bg-[#284955] text-white font-semibold text-xs text-center"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};
