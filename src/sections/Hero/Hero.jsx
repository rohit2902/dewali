import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown, SkipForward } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { initHeroAnimation } from './HeroAnimation';
import './Hero.css';

/**
 * SECTION 1 — HERO
 * Cinematic midnight-indigo palace courtyard, antique brass diya,
 * floating lanterns, golden flame and light particles.
 */
export default function Hero({ onIntroComplete }) {
  const prefersReducedMotion = useReducedMotion();
  const [animationComplete, setAnimationComplete] = useState(false);
  const animHandleRef = useRef(null);

  // Element refs for GSAP animation
  const heroRef = useRef(null);
  const backgroundRef = useRef(null);
  const lanternsRef = useRef(null);
  const rangoliRef = useRef(null);
  const canvasRef = useRef(null);
  const diyaRef = useRef(null);
  const diyaGlowRef = useRef(null);
  const goldenGlowRef = useRef(null);
  const contentRef = useRef(null);
  const hindiRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollRef = useRef(null);

  const handleComplete = useCallback(() => {
    setAnimationComplete(true);
    if (onIntroComplete) {
      onIntroComplete();
    }
  }, [onIntroComplete]);

  const handleSkipIntro = useCallback(() => {
    if (animHandleRef.current) {
      animHandleRef.current.kill();
    }
    // Re-initialize in skip mode
    initHeroAnimation(
      {
        heroRef,
        backgroundRef,
        lanternsRef,
        rangoliRef,
        canvasRef,
        diyaRef,
        diyaGlowRef,
        goldenGlowRef,
        contentRef,
        hindiRef,
        titleRef,
        descRef,
        buttonsRef,
        scrollRef
      },
      handleComplete,
      true
    );
    handleComplete();
  }, [handleComplete]);

  useEffect(() => {
    const refs = {
      heroRef,
      backgroundRef,
      lanternsRef,
      rangoliRef,
      canvasRef,
      diyaRef,
      diyaGlowRef,
      goldenGlowRef,
      contentRef,
      hindiRef,
      titleRef,
      descRef,
      buttonsRef,
      scrollRef
    };

    const handle = initHeroAnimation(refs, handleComplete, prefersReducedMotion);
    animHandleRef.current = handle;

    return () => {
      if (handle && handle.kill) {
        handle.kill();
      }
    };
  }, [prefersReducedMotion, handleComplete]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero" ref={heroRef} aria-label="Welcome to The Art of Light">
      {/* Skip Intro Button */}
      {!animationComplete && (
        <button
          className="hero__skip"
          onClick={handleSkipIntro}
          aria-label="Skip opening animation"
        >
          <span>Skip Intro</span>
          <SkipForward size={14} aria-hidden="true" />
        </button>
      )}

      {/* Layer 1: Palace Courtyard Background */}
      <div className="hero__background" ref={backgroundRef}>
        <img
          src="/images/hero/hero-palace.webp"
          alt="Illuminated royal palace courtyard decorated for Diwali"
          loading="eager"
          decoding="async"
        />
        <div className="hero__background-overlay" />
      </div>

      {/* Layer 2: Floating Sky Lanterns */}
      <div className="hero__lanterns" ref={lanternsRef} aria-hidden="true">
        <img
          src="/images/hero/hero-lanterns.webp"
          alt=""
          loading="eager"
        />
      </div>

      {/* Layer 3: Central Rangoli Floor Accent */}
      <div className="hero__rangoli" ref={rangoliRef} aria-hidden="true">
        <img
          src="/images/hero/hero-rangoli.webp"
          alt=""
          loading="eager"
        />
      </div>

      {/* Layer 4: Golden Floating Particle Canvas */}
      <div className="hero__particles" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      {/* Layer 5: Golden Light Radial Glow */}
      <div className="hero__golden-glow" ref={goldenGlowRef} aria-hidden="true" />

      {/* Layer 6: Antique Brass Diya with Flame Glow */}
      <div className="hero__diya-container">
        <div className="hero__diya-glow" ref={diyaGlowRef} aria-hidden="true" />
        <img
          ref={diyaRef}
          src="/images/hero/hero-diya.webp"
          alt="Antique brass diya glowing with golden flame"
          className="hero__diya"
          loading="eager"
        />
      </div>

      {/* Layer 7: Editorial Content & Typography */}
      <div className="hero__content" ref={contentRef}>
        <p className="hero__hindi-label" ref={hindiRef}>
          शुभ दीपावली • दीपोत्सव
        </p>

        <h1 className="hero__title" ref={titleRef}>
          A Little Light Can Change Everything.
        </h1>

        <p className="hero__description" ref={descRef}>
          Step into a celebration of family, traditions, stories and the beautiful spirit of Diwali.
        </p>

        <div className="hero__buttons" ref={buttonsRef}>
          <button
            onClick={() => scrollToSection('meaning')}
            className="hero__btn-primary"
            aria-label="Begin Your Journey to Meaning section"
          >
            Begin Your Journey
          </button>
          <button
            onClick={() => scrollToSection('stories')}
            className="hero__btn-secondary"
            aria-label="Explore the Experience to Stories section"
          >
            Explore the Experience
          </button>
        </div>
      </div>

      {/* Scroll Down Invitation */}
      <div
        className="hero__scroll-indicator"
        ref={scrollRef}
        onClick={() => scrollToSection('meaning')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && scrollToSection('meaning')}
        aria-label="Scroll down to explore"
      >
        <span className="hero__scroll-text">Scroll to Explore</span>
        <ChevronDown size={18} className="hero__scroll-icon" aria-hidden="true" />
      </div>
    </section>
  );
}

