import React, { useState } from 'react';
import { CareerTrack } from '../types/os';
import { playSound } from '../utils/audio';

interface CareerWindowProps {
  onSelectMission: () => void;
}

export const CareerWindow: React.FC<CareerWindowProps> = ({ onSelectMission }) => {
  const [selectedTrack, setSelectedTrack] = useState<'tech' | 'exec' | 'consult' | 'sales'>('tech');

  const tracks: Record<'tech' | 'exec' | 'consult' | 'sales', CareerTrack> = {
    tech: {
      title: 'Product & Technical Leadership',
      description: 'Master cross-functional alignment, engineering syncs, sprint planning, and client kickoffs.',
      progress: 65,
      level: 'Level 4: Senior Contributor',
      skills: ['Kickoff Meetings', 'Diplomatic Phrasing', 'Architecture Defensibility', 'Sprint Scoping'],
      nodes: [
        {
          id: 1,
          title: 'First Professional Meeting',
          status: 'completed',
          desc: 'Introductions, agenda reviews, collaborative questions.',
        },
        {
          id: 2,
          title: 'Managing Unrealistic Deadlines',
          status: 'current',
          desc: 'Framing scope reductions and quality trade-offs.',
        },
        {
          id: 3,
          title: 'C-Suite Roadmap Walkthrough',
          status: 'locked',
          desc: 'High-level value proposition and risk mitigation.',
        },
        {
          id: 4,
          title: 'Cross-Timezone Collaboration',
          status: 'locked',
          desc: 'Async alignment and inclusive discussion.',
        },
      ],
    },
    exec: {
      title: 'Executive Management & Boardroom English',
      description: 'Lead high-stakes strategic meetings, quarterly business reviews (QBRs), and board presentations.',
      progress: 30,
      level: 'Level 2: Rising Leader',
      skills: ['Strategic Pausing', 'Executive Brevity', 'Handling Tough Pushback', 'Vision Articulation'],
      nodes: [
        {
          id: 1,
          title: 'Opening a Quarterly Review',
          status: 'completed',
          desc: 'Setting the strategic agenda with conviction.',
        },
        {
          id: 2,
          title: 'Defending Budget Allocations',
          status: 'current',
          desc: 'ROI justification and prioritization framing.',
        },
        {
          id: 3,
          title: 'Crisis Response to Investors',
          status: 'locked',
          desc: 'Transparent assurance without defensive language.',
        },
      ],
    },
    consult: {
      title: 'Strategic Consulting & Client Advisory',
      description: 'Deliver persuasive client workshops, manage difficult stakeholders, and negotiate contract scopes.',
      progress: 45,
      level: 'Level 3: Strategic Advisor',
      skills: ['Diagnostic Inquiries', 'Managing Expectations', 'Value Framing', 'De-escalation'],
      nodes: [
        {
          id: 1,
          title: 'Initial Stakeholder Discovery',
          status: 'completed',
          desc: 'Probing pain points with open-ended inquiries.',
        },
        {
          id: 2,
          title: 'Reframing Resistance',
          status: 'current',
          desc: 'Turning client skepticism into joint problem solving.',
        },
        {
          id: 3,
          title: 'Final Recommendation Pitch',
          status: 'locked',
          desc: 'Synthesizing data into decisive executive actions.',
        },
      ],
    },
    sales: {
      title: 'Global Enterprise Sales & Deal Closings',
      description: 'Pitching complex enterprise solutions, overcoming price objections, and securing executive buy-in.',
      progress: 20,
      level: 'Level 1: Deal Architect',
      skills: ['Commercial Pitching', 'Objection Inoculation', 'Closing Questions', 'Contract Term Phrasing'],
      nodes: [
        {
          id: 1,
          title: 'The 60-Second Hook',
          status: 'completed',
          desc: 'Capturing enterprise buyer curiosity fast.',
        },
        {
          id: 2,
          title: 'Pricing Justification',
          status: 'locked',
          desc: 'Anchoring around total cost of inaction.',
        },
        {
          id: 3,
          title: 'Executive Sponsor Closing',
          status: 'locked',
          desc: 'Guiding multiple VP approvals smoothly.',
        },
      ],
    },
  };

  const currentTrack = tracks[selectedTrack];

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFB] text-xs">
      {/* Left Track Selector */}
      <div className="w-56 border-r border-gray-200 bg-white p-3 space-y-2 flex-shrink-0 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
            Career Tracks
          </span>
          {(['tech', 'exec', 'consult', 'sales'] as const).map((key) => {
            const trk = tracks[key];
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedTrack(key);
                  playSound('click');
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition ${
                  selectedTrack === key
                    ? 'bg-[#EAF3F7] border-[#BCD8E5] text-[#1E3B46] shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-transparent text-gray-600'
                }`}
              >
                <div className="font-bold text-xs truncate">{trk.title}</div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                  <span>{trk.level.split(':')[0]}</span>
                  <span className="font-semibold text-emerald-700">{trk.progress}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scholar Certificate Card */}
        <div className="bg-[#FAF3F4] p-3 rounded-xl border border-[#F1D5DA] space-y-1 text-center">
          <span className="text-xl">🎓</span>
          <h4 className="font-bold text-xs text-[#7A3E47]">ProSpeak Scholar</h4>
          <p className="text-[10px] text-gray-500">Certificate eligible after completing 8 core missions.</p>
        </div>
      </div>

      {/* Right Pathway Modules */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Track Overview */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                {currentTrack.level}
              </span>
              <h3 className="text-lg font-serif font-bold text-[#1F3D47] mt-0.5">{currentTrack.title}</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              {currentTrack.progress}% Complete
            </span>
          </div>

          <p className="text-gray-600 text-xs leading-relaxed">{currentTrack.description}</p>

          <div className="pt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Core Competencies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentTrack.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-[#F0F5F8] text-[#2C4F5C] text-[10.5px] font-medium border border-[#DCE8EE]"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Step Nodes */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-xs text-[#20404C] uppercase tracking-wider px-1">
            Skill Pathway Modules
          </h4>

          {currentTrack.nodes.map((node) => (
            <div
              key={node.id}
              className={`p-3.5 rounded-xl border transition flex items-center justify-between shadow-xs ${
                node.status === 'completed'
                  ? 'bg-white border-emerald-200'
                  : node.status === 'current'
                  ? 'bg-[#FDF9FA] border-[#E8CCD2] ring-1 ring-[#CB7A86]'
                  : 'bg-gray-50/70 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                    node.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : node.status === 'current'
                      ? 'bg-[#CB7A86] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {node.status === 'completed' ? '✓' : node.id}
                </span>
                <div>
                  <h5 className="font-bold text-xs text-[#1E3B46]">{node.title}</h5>
                  <p className="text-[10.5px] text-gray-500 mt-0.5">{node.desc}</p>
                </div>
              </div>

              {node.status === 'completed' ? (
                <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  Completed ✓
                </span>
              ) : node.status === 'current' ? (
                <button
                  onClick={() => {
                    playSound('click');
                    onSelectMission();
                  }}
                  className="px-3 py-1 rounded-lg bg-[#2A4C59] hover:bg-[#1E3943] text-white font-bold text-xs transition shadow-xs"
                >
                  Resume →
                </button>
              ) : (
                <span className="text-[10.5px] text-gray-400 font-medium">🔒 Locked</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
