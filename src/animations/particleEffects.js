/**
 * Reusable floating particle system for canvas elements.
 * Used across Hero and Spread Light sections.
 *
 * @example
 * const canvas = canvasRef.current;
 * const fx = new FloatingParticles(canvas, { count: 50, direction: 'up' });
 * fx.start();
 * // later…
 * fx.destroy();
 */
export class FloatingParticles {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = {
      count: options.count || 40,
      color1: options.color1 || 'rgba(198, 161, 91,',
      color2: options.color2 || 'rgba(233, 154, 58,',
      minSize: options.minSize || 1,
      maxSize: options.maxSize || 3,
      speed: options.speed || 1,
      direction: options.direction || 'up', // 'up' | 'down' | 'random'
      ...options
    };
    this.running = false;
    this.resizeHandler = () => this.resize();
    window.addEventListener('resize', this.resizeHandler);
    this.resize();
  }

  /** Sync canvas dimensions to its parent container or the window. */
  resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * Spawn a single particle.
   * @param {boolean} randomY - If true, place at a random Y instead of the edge.
   */
  createParticle(randomY = false) {
    const { minSize, maxSize, speed, direction } = this.options;
    const size = Math.random() * (maxSize - minSize) + minSize;
    let speedY, y;

    if (direction === 'up') {
      speedY = -(Math.random() * 0.5 + 0.2) * speed;
      y = randomY ? Math.random() * this.canvas.height : this.canvas.height + 10;
    } else if (direction === 'down') {
      speedY = (Math.random() * 0.5 + 0.2) * speed;
      y = randomY ? Math.random() * this.canvas.height : -10;
    } else {
      speedY = (Math.random() - 0.5) * speed;
      y = Math.random() * this.canvas.height;
    }

    return {
      x: Math.random() * this.canvas.width,
      y,
      size,
      speedY,
      speedX: (Math.random() - 0.5) * 0.3 * speed,
      opacity: Math.random() * 0.5 + 0.2,
      useColor2: Math.random() > 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.015 + 0.005
    };
  }

  /** Begin the animation loop. Safe to call multiple times. */
  start() {
    if (this.running) return;
    this.running = true;
    this.particles = Array.from(
      { length: this.options.count },
      () => this.createParticle(true)
    );
    this.loop();
  }

  /** Core render loop — called every animation frame. */
  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.2;
      p.y += p.speedY;

      const oob =
        p.y < -10 ||
        p.y > this.canvas.height + 10 ||
        p.x < -10 ||
        p.x > this.canvas.width + 10;
      if (oob) this.particles[i] = this.createParticle(false);

      const colorBase = p.useColor2 ? this.options.color2 : this.options.color1;

      // Core dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${colorBase} ${p.opacity})`;
      this.ctx.fill();

      // Soft glow halo
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `${colorBase} ${p.opacity * 0.1})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.loop());
  }

  /** Pause the animation loop (particles freeze in place). */
  stop() {
    this.running = false;
  }

  /** Stop the loop and remove all event listeners. */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this.resizeHandler);
  }
}
