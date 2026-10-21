import React, { useState } from 'react';
import { playSound, speakText, setSoundEffectsEnabled, isSoundEffectsEnabled } from '../utils/audio';

interface SettingsWindowProps {
  onSelectTheme: (theme: string) => void;
  currentTheme: string;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  onSelectTheme,
  currentTheme,
}) => {
  const [micDevice, setMicDevice] = useState('Default - Internal Microphone (Built-in)');
  const [speechRate, setSpeechRate] = useState('0.95');
  const [accent, setAccent] = useState<'us' | 'uk' | 'au'>('us');
  const [soundEnabled, setSoundEnabled] = useState(isSoundEffectsEnabled());
  const [isTestingMic, setIsTestingMic] = useState(false);

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setSoundEffectsEnabled(enabled);
    if (enabled) playSound('ding');
  };

  const handleTestVoice = () => {
    playSound('click');
    speakText(
      'Welcome to ProSpeak OS. Your speech feedback and voice models are operating at peak fidelity.',
      1,
      parseFloat(speechRate),
      accent
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-white p-5 space-y-4 text-xs select-none">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#1F3D47]">
          Audio, Microphone & System Settings
        </h3>
        <p className="text-gray-500 text-[11px]">
          Configure your hardware devices and speech recognition parameters for ProSpeak OS.
        </p>
      </div>

      {/* Microphone Hardware Config */}
      <div className="bg-[#F8FAFB] p-3.5 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#20404C]">Microphone Device</span>
          <button
            onClick={() => {
              setIsTestingMic(!isTestingMic);
              if (!isTestingMic) playSound('click');
            }}
            className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold border transition ${
              isTestingMic
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isTestingMic ? '⏹️ Stop Mic Test' : '🎙️ Test Live Mic'}
          </button>
        </div>

        <select
          value={micDevice}
          onChange={(e) => setMicDevice(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-xs focus:ring-1 focus:ring-sky-200"
        >
          <option>Default - Internal Microphone (Built-in)</option>
          <option>Headset Microphone (Bluetooth / USB)</option>
          <option>Studio Condenser Mic (High Fidelity)</option>
        </select>

        {isTestingMic && (
          <div className="p-2.5 bg-white rounded-lg border border-rose-200 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
              <span>Input Level:</span>
              <span className="text-rose-600 font-bold">Live Meter</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex">
              <div className="bg-emerald-500 h-full w-[45%]" />
              <div className="bg-amber-400 h-full w-[25%]" />
              <div className="bg-rose-500 h-full w-[10%]" />
            </div>
          </div>
        )}
      </div>

      {/* Text To Speech Config */}
      <div className="bg-[#F8FAFB] p-3.5 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-[#20404C]">Voice Feedback & Speed</span>
          <button
            onClick={handleTestVoice}
            className="px-2.5 py-1 rounded-md text-[10.5px] font-semibold bg-white border border-gray-200 text-[#294B59] hover:bg-gray-50 transition"
          >
            🔊 Test Voice
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Playback Speed:</span>
            <span className="font-bold text-[#20404C]">{speechRate}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.25"
            step="0.05"
            value={speechRate}
            onChange={(e) => setSpeechRate(e.target.value)}
            className="w-full accent-[#26424D] cursor-pointer"
          />
        </div>

        <div className="space-y-1 pt-1">
          <span className="font-semibold text-[11px] text-gray-600 block">Accent Model</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'us', label: '🇺🇸 US (General)' },
              { id: 'uk', label: '🇬🇧 UK (RP)' },
              { id: 'au', label: '🇦🇺 Australian' },
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  setAccent(acc.id as any);
                  playSound('click');
                }}
                className={`py-1.5 px-2 rounded-lg border text-center transition ${
                  accent === acc.id
                    ? 'bg-[#294B59] text-white font-bold border-[#294B59]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sounds and Desktop Theme */}
      <div className="bg-[#F8FAFB] p-3.5 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-[#20404C] block">System Audio Effects</span>
            <span className="text-[10px] text-gray-400">Harmonic synthesizer clicks, chimes & fanfares</span>
          </div>
          <button
            onClick={() => handleToggleSound(!soundEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              soundEnabled ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                soundEnabled ? 'right-0.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <div className="border-t border-gray-100 pt-2 space-y-1.5">
          <span className="font-bold text-xs text-[#20404C] block">Desktop Atmosphere & Theme</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'default', label: '🌊 Classic Slate Blue' },
              { id: 'forest', label: '🌲 Deep Forest' },
              { id: 'sand', label: '🏜️ Warm Sand' },
              { id: 'obsidian', label: '🌑 Modern Obsidian' },
            ].map((thm) => (
              <button
                key={thm.id}
                onClick={() => {
                  onSelectTheme(thm.id);
                  playSound('click');
                }}
                className={`py-2 px-2.5 rounded-xl border text-left transition font-semibold ${
                  currentTheme === thm.id
                    ? 'bg-[#EBF3F8] text-[#1E3B46] border-[#BED6E3] ring-1 ring-[#2A4C59]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {thm.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
