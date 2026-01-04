import { useCallback, useRef } from "react";

type SoundType = "click" | "hover" | "success" | "error" | "whoosh" | "pop";

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case "click":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(800, now);
          oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
          break;

        case "hover":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(600, now);
          oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05);
          gainNode.gain.setValueAtTime(0.05, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;

        case "success":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(523, now); // C5
          oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;

        case "error":
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(200, now);
          oscillator.frequency.setValueAtTime(150, now + 0.1);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          oscillator.start(now);
          oscillator.stop(now + 0.2);
          break;

        case "whoosh":
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(100, now);
          oscillator.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
          gainNode.gain.setValueAtTime(0.08, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;

        case "pop":
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(1000, now);
          oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.08);
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          oscillator.start(now);
          oscillator.stop(now + 0.08);
          break;
      }
    } catch (e) {
      // Audio not supported or blocked
    }
  }, [getAudioContext]);

  return { playSound };
};
