import React from 'react';
import { ProSpeakIcon } from './ProSpeakIcon';
import { playSound } from '../utils/audio';

interface LogOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogOff: () => void;
}

export const LogOffModal: React.FC<LogOffModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogOff,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/80 w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 select-none">
        {/* Title bar */}
        <div className="xp-titlebar-active p-3.5 flex items-center justify-between border-b border-[#BED4E2]">
          <div className="flex items-center space-x-2">
            <ProSpeakIcon name="mission" size={22} />
            <span className="font-bold text-xs text-[#1B3642]">Log Off ProSpeak OS</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="text-gray-400 hover:text-gray-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#1E3B46] text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
            AR
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1A3844]">Alex Rivera</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Are you sure you want to log off and lock your session?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="py-2 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                playSound('complete');
                onConfirmLogOff();
              }}
              className="py-2 px-3 rounded-xl bg-[#8A3E4A] hover:bg-[#722F3A] text-white font-bold text-xs transition shadow-sm"
            >
              Log Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
