import { useState, useEffect } from 'react';

/**
 * Tracks which section is currently active in the viewport
 * @param {string[]} sectionIds
 * @returns {string}
 */
export function useActiveSection(sectionIds = ['hero', 'meaning', 'stories', 'gallery', 'wishes', 'laughs', 'spread-light']) {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
}

