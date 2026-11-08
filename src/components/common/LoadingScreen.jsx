import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * LoadingScreen — Full-screen loader with animated diya icon, brand text,
 * and a progress bar. Fades out when loading completes.
 *
 * @param {object} props
 * @param {boolean} [props.isLoading=true] - Controls visibility
 * @param {number} [props.duration=2500] - Minimum display time in ms
 */
export default function LoadingScreen({ isLoading = true, duration = 2500 }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, duration / 10);

    return () => clearInterval(interval);
  }, [isLoading, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-midnight)] z-[var(--z-loading)]"
        >
          {/* Animated Diya */}
          <div className="relative mb-8">
            {/* Diya base */}
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              {/* Base */}
              <ellipse cx="32" cy="48" rx="16" ry="5" fill="var(--color-gold)" opacity="0.85" />
              <path d="M16 48 Q16 40 22 36 L42 36 Q48 40 48 48 Z" fill="var(--color-gold)" />
              <ellipse cx="32" cy="36" rx="10" ry="3" fill="var(--color-gold-light)" />

              {/* Wick */}
              <rect x="31" y="27" width="2" height="9" rx="1" fill="var(--color-gold-dark)" />
            </svg>

            {/* Animated flame */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 flame-container">
              <div className="flame" />
              <div className="flame-glow" />
            </div>
          </div>

          {/* Brand text */}
          <h1
            className="text-[var(--color-gold)] tracking-[0.3em] uppercase mb-8 text-center"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
            }}
          >
            The Art of Light
          </h1>

          {/* Progress bar */}
          <div className="w-48 h-px bg-[var(--color-midnight-light)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--color-gold)] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          <style>{`
            .flame-container {
              width: 24px;
              height: 36px;
            }

            .flame {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 14px;
              height: 28px;
              background: radial-gradient(
                ellipse at 50% 90%,
                #F5F0E6 0%,
                #C6A15B 40%,
                #E99A3A 70%,
                transparent 100%
              );
              border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
              animation: flicker 0.8s ease-in-out infinite alternate;
            }

            .flame-glow {
              position: absolute;
              bottom: -4px;
              left: 50%;
              transform: translateX(-50%);
              width: 40px;
              height: 40px;
              background: radial-gradient(
                circle,
                rgba(198, 161, 91, 0.4) 0%,
                transparent 70%
              );
              animation: glow-pulse 1.2s ease-in-out infinite alternate;
            }

            @keyframes flicker {
              0% {
                transform: translateX(-50%) scale(1) rotate(-1deg);
                opacity: 1;
              }
              25% {
                transform: translateX(-50%) scale(1.04) rotate(1deg);
                opacity: 0.95;
              }
              50% {
                transform: translateX(-50%) scale(0.97) rotate(-0.5deg);
                opacity: 1;
              }
              75% {
                transform: translateX(-50%) scale(1.02) rotate(0.5deg);
                opacity: 0.92;
              }
              100% {
                transform: translateX(-50%) scale(1) rotate(0deg);
                opacity: 1;
              }
            }

            @keyframes glow-pulse {
              0% { opacity: 0.5; transform: translateX(-50%) scale(1); }
              100% { opacity: 0.8; transform: translateX(-50%) scale(1.15); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
