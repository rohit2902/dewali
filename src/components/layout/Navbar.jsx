import { useState, useEffect, useCallback } from 'react';
import { Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import AudioControl from '../ui/AudioControl';
import LanguageToggle from '../ui/LanguageToggle';
import { useActiveSection } from '../../hooks/useActiveSection';

const NAV_LINKS = [
  { id: 'meaning', label: 'Meaning', labelHindi: 'अर्थ' },
  { id: 'stories', label: 'Stories', labelHindi: 'कहानियाँ' },
  { id: 'gallery', label: 'Gallery', labelHindi: 'गैलरी' },
  { id: 'wishes', label: 'Wishes', labelHindi: 'शुभकामनाएँ' },
  { id: 'laughs', label: 'Laughs', labelHindi: 'हँसी' },
  { id: 'spread-light', label: 'Spread Light', labelHindi: 'रोशनी फैलाएँ' },
];

/**
 * Navbar — Premium fixed navigation with scroll-aware styling,
 * section highlighting, and mobile hamburger menu.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  // Scroll listener for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 72;
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-500 ${
          scrolled
            ? 'bg-[var(--color-midnight)]/90 backdrop-blur-lg shadow-lg border-b border-[var(--color-gold)]/10'
            : 'bg-transparent'
        }`}
        style={{ height: 'var(--nav-height)' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="site-container h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[var(--color-gold)] tracking-[0.15em] sm:tracking-[0.2em] uppercase whitespace-nowrap hover:text-[var(--color-gold-light)] transition-colors flex items-center shrink-0"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1rem, 0.9rem + 0.4vw, 1.25rem)',
              fontWeight: 600,
            }}
          >
            The Art of Light
          </a>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative text-sm tracking-wider uppercase transition-colors duration-300 ${
                  activeSection === link.id
                    ? 'text-[var(--color-gold)]'
                    : 'text-[var(--color-champagne)] hover:text-[var(--color-gold)]'
                }`}
                style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              >
                {link.label}
                {/* Active indicator */}
                {activeSection === link.id && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--color-gold)]" />
                )}
              </a>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <LanguageToggle />
              <AudioControl />
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}
