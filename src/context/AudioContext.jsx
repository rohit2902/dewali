import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AUDIO_SRC = '/audio/joyful.mp3';
const DEFAULT_VOLUME = 0.30; // 30% default volume as requested

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);

  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const isPlayingRef = useRef(false);
  const volumeRef = useRef(DEFAULT_VOLUME);
  const previousVolumeRef = useRef(DEFAULT_VOLUME);
  const isFadingRef = useRef(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    isFadingRef.current = false;
  };

  // Smooth linear volume ramp
  const fadeVolume = useCallback((audio, targetVol, duration = 600, onComplete = null) => {
    if (!audio) return;
    clearFade();
    isFadingRef.current = true;

    const startVol = audio.volume;
    const diff = targetVol - startVol;
    if (Math.abs(diff) < 0.01) {
      audio.volume = targetVol;
      isFadingRef.current = false;
      if (onComplete) onComplete();
      return;
    }

    const steps = 30;
    const stepTime = duration / steps;
    const volStep = diff / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, Math.min(1, startVol + volStep * currentStep));
      audio.volume = nextVol;

      if (currentStep >= steps) {
        clearFade();
        audio.volume = targetVol;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }, []);

  // Initialize audio and check availability
  useEffect(() => {
    const audio = new Audio();
    audio.src = AUDIO_SRC;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0; // Starts at 0 for smooth fade in

    audio.addEventListener('error', () => {
      console.warn('Background music file not found or failed to load:', AUDIO_SRC);
      setIsAvailable(false);
      setIsPlaying(false);
    });

    audio.addEventListener('canplaythrough', () => {
      setIsAvailable(true);
    });

    audioRef.current = audio;

    if (typeof window !== 'undefined') {
      window.__diwaliAudio = audio;
    }

    return () => {
      clearFade();
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Set volume with live update
  const setVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    volumeRef.current = clamped;

    const audio = audioRef.current;
    if (audio && isPlayingRef.current && !isFadingRef.current) {
      audio.volume = clamped;
    }
  }, []);

  // Mute / Unmute toggle
  const toggleMute = useCallback(() => {
    if (volumeRef.current > 0) {
      previousVolumeRef.current = volumeRef.current;
      setVolume(0);
    } else {
      const restored = previousVolumeRef.current > 0 ? previousVolumeRef.current : DEFAULT_VOLUME;
      setVolume(restored);
    }
  }, [setVolume]);

  // Play / Pause toggle with smooth fade
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isAvailable) return;

    if (isPlayingRef.current) {
      // Fade out from current volume to 0 then pause
      fadeVolume(audio, 0, 500, () => {
        audio.pause();
        setIsPlaying(false);
      });
    } else {
      try {
        setIsLoading(true);
        audio.volume = 0;
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        // Fade in to current user-selected volume
        const targetVol = volumeRef.current > 0 ? volumeRef.current : DEFAULT_VOLUME;
        fadeVolume(audio, targetVol, 800);
      } catch (err) {
        console.warn('Audio play request blocked or interrupted by browser:', err);
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  }, [isAvailable, fadeVolume]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isAvailable,
        isLoading,
        volume,
        setVolume,
        toggleMute,
        togglePlay,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
}
