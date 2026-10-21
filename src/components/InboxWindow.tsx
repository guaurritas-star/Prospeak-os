import React, { useState } from 'react';
import { EmailItem } from '../types/os';
import { playSound, speakText } from '../utils/audio';
import { ProSpeakIcon } from './ProSpeakIcon';
import { Paperclip, Volume2 } from 'lucide-react';

interface InboxWindowProps {
  onOpenAgendaModal: () => void;
  onOpenMission: () => void;
}

export const InboxWindow: React.FC<InboxWindowProps> = ({
  onOpenAgendaModal,
  onOpenMission,
}) => {
  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: 'e1',
      fromName: 'Lisa Chen',
      fromRole: 'Engagement Manager',
      fromAvatar: 'LD',
      subject: 'Kickoff meeting next week',
      date: 'Today, 9:42 AM',
      preview: "I'm excited to get started on the client project. We'll have a kickoff meeting next Monday...",
      body: `Hi there,\n\nI'm excited to get started on the client project. We'll have a kickoff meeting next Monday at 10 AM (EST) with the client team.\n\nCould you please review the attached agenda and let me know if you have any questions or suggestions?\n\nBest,\nLisa`,
      unread: true,
      attachment: {
        name: 'Meeting_Agenda.pdf',
        size: '328 KB',
      },
    },
    {
      id: 'e2',
      fromName: 'Marcus Vance',
      fromRole: 'Lead Architect',
      fromAvatar: 'MV',
      subject: 'Architecture review & staging deployment',
      date: 'Yesterday, 4:15 PM',
      preview: 'I synced with the infrastructure team regarding the API gateway dependencies...',
      body: `Hey Alex,\n\nI synced with the infrastructure team regarding the API gateway dependencies. Let me know if you want to push the client demo back by a couple of days to be completely confident in the latency numbers.\n\nCheers,\nMarcus`,
      unread: false,
    },
    {
      id: 'e3',
      fromName: 'Sophia Wu',
      fromRole: 'Product Design Lead',
      fromAvatar: 'SW',
      subject: 'Deck slides ready for client walkthrough',
      date: 'Oct 19, 11:20 AM',
      preview: 'The executive summary slides and UI mockups have been updated in Figma...',
      body: `Hi Alex,\n\nThe executive summary slides and UI mockups have been updated in Figma for the client walkthrough. Please take a look and confirm if the user flows align with our product roadmap commitments.\n\nThanks,\nSophia`,
      unread: false,
    },
  ]);

  const [selectedEmailId, setSelectedEmailId] = useState<string>('e1');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleSelectEmail = (id: string) => {
    playSound('click');
    setSelectedEmailId(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, unread: false } : e))
    );
  };

  const handleReadAloud = () => {
    setIsPlayingAudio(true);
    speakText(selectedEmail.body);
    setTimeout(() => setIsPlayingAudio(false), 7000);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F8FAFB] text-xs">
      {/* Email List Left Pane */}
      <div className="w-64 sm:w-72 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-[#FAFBFD]">
          <span className="font-bold text-xs text-[#20404C] flex items-center space-x-1.5">
            <span>Inbox</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {emails.filter((e) => e.unread).length}
            </span>
          </span>
          <button
            onClick={() => {
              playSound('click');
              onOpenMission();
            }}
            className="text-[10px] font-semibold text-[#8C4A55] hover:underline"
          >
            Mission Mode →
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => handleSelectEmail(email.id)}
              className={`w-full text-left p-3 transition flex items-start space-x-2.5 ${
                selectedEmailId === email.id
                  ? 'bg-[#EBF3F8] border-l-3 border-[#2A4C59]'
                  : email.unread
                  ? 'bg-white hover:bg-slate-50 font-semibold'
                  : 'bg-[#FCFDFE] hover:bg-slate-50 text-gray-600'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#E5EEF3] text-[#2C5261] font-bold text-[10.5px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {email.fromAvatar}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] truncate ${email.unread ? 'font-bold text-[#1C3640]' : 'text-gray-700'}`}>
                    {email.fromName}
                  </span>
                  <span className="text-[9.5px] text-gray-400 flex-shrink-0 ml-1">{email.date.split(',')[0]}</span>
                </div>

                <p className={`text-[10.5px] truncate mt-0.5 ${email.unread ? 'font-semibold text-[#244754]' : 'text-gray-600'}`}>
                  {email.subject}
                </p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{email.preview}</p>

                {email.attachment && (
                  <span className="inline-flex items-center space-x-1 text-[9px] text-gray-400 mt-1 bg-gray-100 px-1.5 py-0.5 rounded">
                    <Paperclip size={14} />
                    <span>{email.attachment.name}</span>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Email Reader Right Pane */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white p-5 space-y-4">
        {/* Email Header */}
        <div className="border-b border-gray-100 pb-3 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#E4ECEF] text-[#2A4D5B] font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
              {selectedEmail.fromAvatar}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1E3A45] leading-tight">{selectedEmail.subject}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                From: <strong className="text-gray-700">{selectedEmail.fromName}</strong> ({selectedEmail.fromRole})
              </p>
              <p className="text-[10px] text-gray-400">{selectedEmail.date}</p>
            </div>
          </div>

          <button
            onClick={handleReadAloud}
            className="text-[10.5px] font-semibold text-[#8C4A55] hover:text-[#5C2B33] flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition"
            title="Read email body aloud"
          >
            <Volume2 size={17} />
            <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
          </button>
        </div>

        {/* Email Body */}
        <div className="flex-1 text-xs text-gray-700 leading-relaxed space-y-3 whitespace-pre-line font-sans">
          {selectedEmail.body}
        </div>

        {/* Attachment Card */}
        {selectedEmail.attachment && (
          <div className="bg-[#F8FAFB] p-3 rounded-xl border border-gray-200 flex items-center justify-between max-w-sm">
            <div className="flex items-center space-x-2.5">
              <Paperclip size={23} />
              <div>
                <span className="font-bold text-[11px] text-[#244754] block">
                  {selectedEmail.attachment.name}
                </span>
                <span className="text-[9.5px] text-gray-400">{selectedEmail.attachment.size}</span>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('click');
                onOpenAgendaModal();
              }}
              className="px-3 py-1 bg-[#2C4F5C] hover:bg-[#1E3B46] text-white rounded-lg text-[10.5px] font-semibold transition"
            >
              Preview PDF
            </button>
          </div>
        )}

        {/* Quick Reply Link to Mission */}
        {selectedEmail.id === 'e1' && (
          <div className="bg-[#FAF2F4] p-3 rounded-xl border border-[#F2D6DC] flex items-center justify-between text-xs mt-4">
            <div className="flex items-center space-x-2">
              <ProSpeakIcon name="mission" size={22} />
              <span className="text-[#783D47] font-semibold">
                This email is part of Today's Kickoff Mission.
              </span>
            </div>
            <button
              onClick={() => {
                playSound('click');
                onOpenMission();
              }}
              className="px-3 py-1 rounded-lg bg-[#8C4A55] hover:bg-[#6D323C] text-white font-bold text-[10.5px] transition"
            >
              Go to Today's Mission Step 2 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
