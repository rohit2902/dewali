import gsap from 'gsap';

/**
 * Golden floating particle system rendered on an HTML5 canvas.
 * Creates ambient rising golden orbs with subtle glow effects.
 */
class GoldenParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resizeHandler = () => this.resize();
    this.resize();
    window.addEventListener('resize', this.resizeHandler);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 10,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      golden: Math.random() > 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01
    };
  }

  init(count = 60) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const p = this.createParticle();
      // Distribute particles across the full height initially
      p.y = Math.random() * this.canvas.height;
      this.particles.push(p);
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.3;
      p.y += p.speedY;

      // Recycle particles that leave the viewport
      if (p.y < -10 || p.x < -10 || p.x > this.canvas.width + 10) {
        this.particles[i] = this.createParticle();
      }

      const color = p.golden
        ? `rgba(198, 161, 91, ${p.opacity})`
        : `rgba(233, 154, 58, ${p.opacity * 0.7})`;

      // Core particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();

      // Subtle outer glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = p.golden
        ? `rgba(198, 161, 91, ${p.opacity * 0.15})`
        : `rgba(233, 154, 58, ${p.opacity * 0.1})`;
      this.ctx.fill();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    window.removeEventListener('resize', this.resizeHandler);
  }
}

/**
 * Initialize the hero cinematic opening animation sequence.
 *
 * The animation progresses through 6 phases:
 *   1. Diya flame materialises from darkness
 *   2. Golden glow radiates outward
 *   3. Palace background and decorative layers reveal
 *   4. Canvas particles begin rising
 *   5. Text content fades in sequentially
 *   6. Scroll indicator appears
 *
 * @param {Object} refs - React refs for every animated DOM element
 * @param {Function} onComplete - Fires when the full intro finishes
 * @param {boolean} skip - If true, skip animation and show everything instantly
 * @returns {{ timeline: gsap.core.Timeline | null, particles: GoldenParticles | null, kill: () => void }}
 */
export function initHeroAnimation(refs, onComplete, skip = false) {
  const {
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
  } = refs;

  // ── Particle system ──────────────────────────────────────────────
  let particles = null;
  if (canvasRef?.current) {
    particles = new GoldenParticles(canvasRef.current);
  }

  // ── Skip path (reduced-motion / user skip) ───────────────────────
  if (skip) {
    const targets = [
      backgroundRef?.current,
      lanternsRef?.current,
      rangoliRef?.current,
      diyaRef?.current,
      diyaGlowRef?.current,
      goldenGlowRef?.current,
      contentRef?.current,
      hindiRef?.current,
      titleRef?.current,
      descRef?.current,
      buttonsRef?.current,
      scrollRef?.current
    ].filter(Boolean);

    gsap.set(targets, { opacity: 1, y: 0, scale: 1 });

    // Restore target opacities for decorative layers
    if (lanternsRef?.current) gsap.set(lanternsRef.current, { opacity: 0.35 });
    if (rangoliRef?.current) gsap.set(rangoliRef.current, { opacity: 0.25 });
    if (hindiRef?.current) gsap.set(hindiRef.current, { opacity: 0.9 });
    if (descRef?.current) gsap.set(descRef.current, { opacity: 0.9 });
    if (scrollRef?.current) gsap.set(scrollRef.current, { opacity: 0.6 });

    if (particles) particles.init(60);
    if (onComplete) onComplete();

    return {
      timeline: null,
      particles,
      kill: () => particles?.destroy()
    };
  }

  // ── Initial hidden states ────────────────────────────────────────
  if (backgroundRef?.current) gsap.set(backgroundRef.current, { opacity: 0 });
  if (lanternsRef?.current) gsap.set(lanternsRef.current, { opacity: 0 });
  if (rangoliRef?.current) gsap.set(rangoliRef.current, { opacity: 0 });
  if (diyaRef?.current) gsap.set(diyaRef.current, { opacity: 0, scale: 0.8 });
  if (diyaGlowRef?.current) gsap.set(diyaGlowRef.current, { opacity: 0, scale: 0.5 });
  if (goldenGlowRef?.current) gsap.set(goldenGlowRef.current, { opacity: 0, scale: 0.3 });
  if (hindiRef?.current) gsap.set(hindiRef.current, { opacity: 0, y: 20 });
  if (titleRef?.current) gsap.set(titleRef.current, { opacity: 0, y: 30 });
  if (descRef?.current) gsap.set(descRef.current, { opacity: 0, y: 20 });
  if (buttonsRef?.current) gsap.set(buttonsRef.current, { opacity: 0, y: 20 });
  if (scrollRef?.current) gsap.set(scrollRef.current, { opacity: 0 });

  // ── Master timeline ──────────────────────────────────────────────
  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });

  tl
    // Phase 1 — Diya flame appears (0.5s → 1.7s)
    .to(diyaRef?.current, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    }, 0.5)
    .to(diyaGlowRef?.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out'
    }, 0.8)

    // Phase 2 — Golden glow expands (1.2s → 3.2s)
    .to(goldenGlowRef?.current, {
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: 'power2.out'
    }, 1.2)

    // Phase 3 — Background palace and decorations reveal (1.5s → 4.5s)
    .to(backgroundRef?.current, {
      opacity: 1,
      duration: 2,
      ease: 'power1.inOut'
    }, 1.5)
    .to(lanternsRef?.current, {
      opacity: 0.35,
      duration: 2.5,
      ease: 'power1.inOut'
    }, 2)
    .to(rangoliRef?.current, {
      opacity: 0.25,
      duration: 2,
      ease: 'power1.inOut'
    }, 2.5)

    // Phase 4 — Start canvas particles
    .call(() => {
      if (particles) particles.init(60);
    }, null, 2)

    // Phase 5 — Content fades in sequentially (3.2s → 5.1s)
    .to(hindiRef?.current, {
      opacity: 0.9,
      y: 0,
      duration: 0.8
    }, 3.2)
    .to(titleRef?.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    }, 3.5)
    .to(descRef?.current, {
      opacity: 0.9,
      y: 0,
      duration: 0.8
    }, 4)
    .to(buttonsRef?.current, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, 4.3)

    // Phase 6 — Scroll indicator
    .to(scrollRef?.current, {
      opacity: 0.6,
      duration: 0.5
    }, 5);

  // ── Cleanup helper ───────────────────────────────────────────────
  const kill = () => {
    tl.kill();
    particles?.destroy();
  };

  return { timeline: tl, particles, kill };
}
