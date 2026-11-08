import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import AudioControl from '../ui/AudioControl';
import LanguageToggle from '../ui/LanguageToggle';

/**
 * MobileMenu — Full-screen slide-in menu with staggered link animations.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {Array} props.links
 * @param {string} props.activeSection
 * @param {function} props.onNavClick
 */
export default function MobileMenu({ isOpen, onClose, links, activeSection, onNavClick }) {
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-overlay)]"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[var(--color-midnight)] z-[var(--z-modal)] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-gold)]/20">
              <span
                className="text-[var(--color-gold)] tracking-[0.15em] uppercase"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                }}
              >
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-2 text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
              {links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
                  onClick={(e) => onNavClick(e, link.id)}
                  className={`block py-3 text-2xl tracking-wide transition-colors duration-300 ${
                    activeSection === link.id
                      ? 'text-[var(--color-gold)]'
                      : 'text-[var(--color-ivory)] hover:text-[var(--color-gold)]'
                  }`}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                  <span
                    className="block text-xs text-[var(--color-champagne)] mt-0.5 opacity-60"
                    style={{ fontFamily: 'var(--font-hindi-body)' }}
                  >
                    {link.labelHindi}
                  </span>
                </motion.a>
              ))}
            </nav>

            {/* Bottom controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 border-t border-[var(--color-gold)]/20 flex items-center gap-4"
            >
              <LanguageToggle />
              <AudioControl />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
