import { useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '../../components/ui/LanguageToggle';

/**
 * GalleryLightbox — Fullscreen modal lightbox with previous/next navigation,
 * keyboard controls (ArrowLeft, ArrowRight, Escape), and image counter.
 */
export default function GalleryLightbox({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev
}) {
  const { isHindi } = useLanguage();

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !items || items.length === 0 || currentIndex < 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Top Bar with Counter and Close Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <span className="text-xs text-[var(--color-champagne)] bg-black/50 border border-[var(--color-gold)]/20 px-3 py-1.5 rounded-full pointer-events-auto font-sans">
          {currentIndex + 1} / {items.length}
        </span>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-black/60 border border-[var(--color-gold)]/30 text-white hover:text-[var(--color-gold)] transition-colors pointer-events-auto cursor-pointer"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Container */}
      <div
        className="relative max-w-4xl w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow Left */}
        {items.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 border border-[var(--color-gold)]/30 text-white hover:text-[var(--color-gold)] hover:scale-110 transition-all cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Image Frame */}
        <div className="relative max-h-[70vh] rounded-xl overflow-hidden border border-[var(--color-gold)]/30 shadow-2xl bg-black/40 flex items-center justify-center">
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Navigation Arrow Right */}
        {items.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 border border-[var(--color-gold)]/30 text-white hover:text-[var(--color-gold)] hover:scale-110 transition-all cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Caption Panel */}
        <div className="w-full mt-4 p-4 rounded-xl bg-[var(--color-midnight)]/90 border border-[var(--color-gold)]/20 text-center">
          <h3 className="font-serif text-2xl text-[var(--color-gold)] mb-1">
            {isHindi ? currentItem.titleHindi : currentItem.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-champagne)] leading-relaxed max-w-2xl mx-auto opacity-90">
            {currentItem.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
