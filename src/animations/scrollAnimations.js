import gsap from 'gsap';

/**
 * Reusable scroll animation helpers
 */
export function fadeInUp(element, options = {}) {
  if (!element) return null;
  return gsap.fromTo(
    element,
    { opacity: 0, y: options.y || 40 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.8,
      ease: options.ease || 'power2.out',
      delay: options.delay || 0,
    }
  );
}

export function staggerChildren(parent, childSelector, options = {}) {
  if (!parent) return null;
  const children = parent.querySelectorAll(childSelector);
  if (!children.length) return null;

  return gsap.fromTo(
    children,
    { opacity: 0, y: options.y || 30 },
    {
      opacity: 1,
      y: 0,
      duration: options.duration || 0.6,
      stagger: options.stagger || 0.12,
      ease: options.ease || 'power2.out',
    }
  );
}

