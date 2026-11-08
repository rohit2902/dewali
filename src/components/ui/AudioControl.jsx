import { useState, useRef, useEffect } from 'react';
import { Music, Volume2, Volume1, VolumeX, Loader2 } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useLanguage } from './LanguageToggle';

/**
 * AudioControl — Elegant background music controller with Play/Pause & Volume.
 * Uses the existing `/audio/joyful.mp3` file across all seven sections.
 * OFF by default, 30% initial volume, continuous looping, smooth fade transitions.
 */
export default function AudioControl() {
  const { isPlaying, isAvailable, isLoading, volume, setVolume, toggleMute, togglePlay } = useAudio();
  const { isHindi } = useLanguage();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const containerRef = useRef(null);

  // Close slider popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAvailable) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-600/30 text-gray-500 opacity-50 cursor-not-allowed select-none"
        title="Background music unavailable"
        aria-label={isHindi ? 'संगीत अनुपलब्ध है' : 'Music unavailable'}
      >
        <VolumeX size={15} aria-hidden="true" />
        <span className="text-xs font-medium font-sans hidden sm:inline">
          {isHindi ? 'संगीत' : 'Music'}
        </span>
      </div>
    );
  }

  // Determine volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume > 0.5 ? Volume2 : Volume1;
  const volumePercent = Math.round(volume * 100);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center rounded-full border transition-all duration-300 select-none ${
        isPlaying
          ? 'bg-[var(--color-midnight-light)] border-[var(--color-gold)] shadow-[var(--shadow-glow)]'
          : 'bg-transparent border-[var(--color-gold)]/25 hover:border-[var(--color-gold)]/60'
      }`}
    >
      {/* 1. Play / Pause Button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-l-full cursor-pointer transition-colors ${
          isPlaying
            ? 'text-[var(--color-gold)]'
            : 'text-[var(--color-champagne)] hover:text-[var(--color-gold)]'
        }`}
        aria-label={
          isPlaying
            ? isHindi
              ? 'संगीत रोकें'
              : 'Pause background music'
            : isHindi
              ? 'दीपावली संगीत चालू करें'
              : 'Play Diwali background music'
        }
        aria-pressed={isPlaying}
        title={isPlaying ? 'Pause music' : 'Play Diwali ambient music'}
      >
        {isLoading ? (
          <Loader2 size={15} className="animate-spin text-[var(--color-gold)]" aria-hidden="true" />
        ) : isPlaying ? (
          <div className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
            <span className="w-0.5 h-2.5 bg-[var(--color-gold)] rounded-full animate-pulse" />
            <span className="w-0.5 h-3.5 bg-[var(--color-gold)] rounded-full animate-pulse [animation-delay:150ms]" />
            <span className="w-0.5 h-2 bg-[var(--color-gold)] rounded-full animate-pulse [animation-delay:300ms]" />
          </div>
        ) : (
          <Music size={15} className="opacity-80" aria-hidden="true" />
        )}

        <span className="text-xs font-medium font-sans hidden sm:inline">
          {isPlaying
            ? isHindi
              ? 'संगीत चालू'
              : 'Music ON'
            : isHindi
              ? 'संगीत'
              : 'Music'}
        </span>
      </button>

      {/* Subtle Divider */}
      <div className="h-4 w-px bg-[var(--color-gold)]/20" aria-hidden="true" />

      {/* 2. Volume Trigger & Slider */}
      <div
        className="relative flex items-center"
        onMouseEnter={() => setShowVolumeSlider(true)}
      >
        <button
          type="button"
          onClick={toggleMute}
          onFocus={() => setShowVolumeSlider(true)}
          className={`p-1.5 pr-2.5 rounded-r-full cursor-pointer transition-colors ${
            volume === 0
              ? 'text-rose-400/80 hover:text-rose-400'
              : isPlaying
                ? 'text-[var(--color-gold)] hover:text-[var(--color-gold-light)]'
                : 'text-[var(--color-champagne)]/80 hover:text-[var(--color-gold)]'
          }`}
          aria-label={
            volume === 0
              ? isHindi
                ? 'आवाज़ खोलें'
                : 'Unmute volume'
              : isHindi
                ? 'आवाज़ बंद करें'
                : 'Mute volume'
          }
          title={`Volume: ${volumePercent}% (Click to ${volume === 0 ? 'unmute' : 'mute'})`}
        >
          <VolumeIcon size={15} aria-hidden="true" />
        </button>

        {/* Floating / Popover Volume Slider */}
        {showVolumeSlider && (
          <div
            className="absolute right-0 top-full mt-2.5 px-3 py-2 bg-[var(--color-midnight)]/95 backdrop-blur-md border border-[var(--color-gold)]/40 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
            style={{ minWidth: '150px' }}
          >
            <button
              type="button"
              onClick={toggleMute}
              className="text-[var(--color-champagne)] hover:text-[var(--color-gold)] transition-colors p-0.5 cursor-pointer"
              aria-label="Toggle mute"
            >
              <VolumeIcon size={14} />
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="audio-volume-slider flex-1"
              aria-label="Background music volume"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={volumePercent}
            />

            <span className="text-[11px] font-mono text-[var(--color-gold)] w-7 text-right">
              {volumePercent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
