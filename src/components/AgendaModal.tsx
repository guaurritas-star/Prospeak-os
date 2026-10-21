import React from 'react';
import { Paperclip } from 'lucide-react';
import { playSound } from '../utils/audio';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgendaModal: React.FC<AgendaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* PDF Reader Top Header */}
        <div className="bg-[#26424D] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Paperclip size={20} />
            <div>
              <h3 className="text-xs font-bold leading-tight">Meeting_Agenda.pdf</h3>
              <span className="text-[10px] text-sky-200">328 KB · Acrobat Reader Preview</span>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-gray-300 hover:text-white text-sm font-bold w-6 h-6 rounded flex items-center justify-center hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* PDF Document Page View */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA] space-y-4 text-xs text-gray-800">
          <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg space-y-4 font-sans">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700">
                  Global Solutions Project
                </span>
                <h2 className="text-lg font-serif font-bold text-[#1D3C47]">
                  Client Kickoff Meeting Agenda
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Date: Monday, Oct 26 · 10:00 AM – 11:00 AM EST
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                Confirmed
              </span>
            </div>

            {/* Attendees */}
            <div className="space-y-1">
              <span className="font-bold text-[11px] text-[#20404C] uppercase tracking-wider block">
                Attendees & Roles
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <div>
                  • <strong>Lisa Chen</strong> (Engagement Manager)
                </div>
                <div>
                  • <strong>Marcus Vance</strong> (Lead Architect)
                </div>
                <div>
                  • <strong>Alex Rivera</strong> (Product Lead)
                </div>
                <div>
                  • <strong>Client Stakeholders</strong> (VP & Ops)
                </div>
              </div>
            </div>

            {/* Agenda Schedule */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-[11px] text-[#20404C] uppercase tracking-wider block">
                Meeting Schedule
              </span>

              <div className="space-y-0.5">
                <div className="font-bold text-[#20404C] flex justify-between">
                  <span>1. Welcome & Team Introductions</span>
                  <span className="text-gray-400 font-normal">10:00 - 10:10 AM</span>
                </div>
                <p className="text-[10.5px] text-gray-500">
                  Brief round-robin intros. State your department, primary focus, and project objective.
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[#20404C] flex justify-between">
                  <span>2. Project Objectives & Deliverables</span>
                  <span className="text-gray-400 font-normal">10:10 - 10:30 AM</span>
                </div>
                <p className="text-[10.5px] text-gray-500">
                  High-level review of Q4 targets, design deliverables, and integration requirements.
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[#20404C] flex justify-between">
                  <span>3. Timeline & Key Milestones Discussion</span>
                  <span className="text-gray-400 font-normal">10:30 - 10:45 AM</span>
                </div>
                <p className="text-[10.5px] text-gray-500">
                  Sprint cadence, staging demo dates, and feedback cycles. (Alex to provide input).
                </p>
              </div>

              <div className="space-y-0.5">
                <div className="font-bold text-[#20404C] flex justify-between">
                  <span>4. Open Q&A and Action Items</span>
                  <span className="text-gray-400 font-normal">10:45 - 11:00 AM</span>
                </div>
                <p className="text-[10.5px] text-gray-500">
                  Addressing client clarifications, confirming owner assignments, setting next check-in.
                </p>
              </div>
            </div>

            {/* Preparation Note */}
            <div className="bg-[#F2F7FA] p-3 rounded-lg border border-[#D8E6EE] text-[10.5px] text-[#2A4B59]">
              <strong>Preparation Note for Alex:</strong> Please prepare a 2-minute overview of our proposed timeline adjustments and be prepared to speak during item 3.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-4 py-2.5 flex items-center justify-between border-t border-gray-200">
          <span className="text-[11px] text-gray-500">Page 1 of 1 · Read-only document</span>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#274753] hover:bg-[#1C3640] text-white text-xs font-semibold transition"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
