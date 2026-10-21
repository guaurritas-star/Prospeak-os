// Audio effects synthesizer and Text-To-Speech engine

let soundEffectsEnabled = true;

export function setSoundEffectsEnabled(enabled: boolean) {
  soundEffectsEnabled = enabled;
}

export function isSoundEffectsEnabled(): boolean {
  return soundEffectsEnabled;
}

export function playSound(type: 'click' | 'ding' | 'complete' | 'error' = 'click') {
  if (!soundEffectsEnabled || typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'ding') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'complete') {
      // Harmonic fanfare arpeggio: C5 -> E5 -> G5 -> C6
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

export function speakText(text: string, pitch = 1, rate = 0.95, accent: 'us' | 'uk' | 'au' = 'us') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = pitch;
    utterance.rate = rate;

    const voices = window.speechSynthesis.getVoices();
    let preferredLang = 'en-US';
    if (accent === 'uk') preferredLang = 'en-GB';
    else if (accent === 'au') preferredLang = 'en-AU';

    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith(preferredLang) &&
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google') ||
          v.name.includes('Karen') ||
          v.name.includes('Serena'))
    ) || voices.find((v) => v.lang.startsWith(preferredLang)) || voices.find((v) => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore synthesis errors
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
