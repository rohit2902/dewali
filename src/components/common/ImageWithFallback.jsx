import { useState, useCallback } from 'react';

/**
 * ImageWithFallback — Image component with lazy loading, error fallback,
 * and a skeleton loading animation.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt - Required for accessibility
 * @param {string} [props.className]
 * @param {string} [props.fallbackText]
 * @param {'cover'|'contain'|'fill'|'none'} [props.objectFit='cover']
 */
export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackText = '',
  objectFit = 'cover',
  ...rest
}) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'

  const handleLoad = useCallback(() => setStatus('loaded'), []);
  const handleError = useCallback(() => setStatus('error'), []);

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  }[objectFit];

  if (status === 'error') {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[var(--color-midnight)] to-[var(--color-burgundy)] ${className}`}
        role="img"
        aria-label={alt}
      >
        <span
          className="text-[var(--color-champagne)] text-sm text-center px-4 opacity-70"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loader */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[var(--color-midnight-light)] animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full transition-opacity duration-500 ${objectFitClass} ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
