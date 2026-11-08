import Container from '../common/Container';

/**
 * Footer — Elegant dark footer with branding, Hindi blessing,
 * decorative diya, section links and credit line.
 */

const FOOTER_LINKS = [
  { id: 'meaning', label: 'Meaning' },
  { id: 'stories', label: 'Stories' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'laughs', label: 'Laughs' },
  { id: 'spread-light', label: 'Spread Light' },
];

export default function Footer() {
  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 72;
      const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[var(--color-midnight-dark)] pt-0 pb-8">
      {/* Gold separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-40" />

      <Container className="pt-16 pb-8">
        {/* Decorative Diya */}
        <div className="flex justify-center mb-8">
          <svg
            width="48"
            height="48"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="opacity-60"
          >
            <ellipse cx="32" cy="48" rx="14" ry="4.5" fill="var(--color-gold)" opacity="0.7" />
            <path d="M18 48 Q18 41 23 38 L41 38 Q46 41 46 48 Z" fill="var(--color-gold)" opacity="0.8" />
            <ellipse cx="32" cy="38" rx="9" ry="2.5" fill="var(--color-gold-light)" opacity="0.9" />
            <rect x="31" y="30" width="2" height="8" rx="1" fill="var(--color-gold-dark)" />
            <path
              d="M32 14 Q36 22 34.5 26 Q33 29 32 29 Q31 29 29.5 26 Q28 22 32 14Z"
              fill="var(--color-gold)"
              opacity="0.7"
            />
            <path
              d="M32 18 Q34 23 33.2 25.5 Q32.5 27 32 27 Q31.5 27 30.8 25.5 Q30 23 32 18Z"
              fill="var(--color-ivory)"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Brand heading */}
        <h2
          className="text-center text-[var(--color-gold)] tracking-[0.25em] uppercase mb-3"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
          }}
        >
          The Art of Light
        </h2>

        {/* Tagline */}
        <p
          className="text-center text-[var(--color-champagne)] tracking-wider mb-2"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-base)',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          A Digital Deepavali Experience
        </p>

        {/* Hindi blessing */}
        <p
          className="text-center text-[var(--color-gold)] opacity-80 mb-10"
          style={{
            fontFamily: 'var(--font-hindi-heading)',
            fontSize: 'var(--text-lg)',
          }}
        >
          दीपावली की शुभकामनाएँ
        </p>

        {/* Section links */}
        <nav className="flex flex-wrap justify-center gap-6 mb-10" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm text-[var(--color-champagne)] hover:text-[var(--color-gold)] transition-colors duration-300 tracking-wider uppercase"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Separator */}
        <div className="w-24 h-px bg-[var(--color-gold)] opacity-30 mx-auto mb-8" />

        {/* Credit */}
        <p
          className="text-center text-[var(--color-champagne)] opacity-50 text-xs tracking-wider"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Made with love for the festival of lights
        </p>
      </Container>
    </footer>
  );
}
