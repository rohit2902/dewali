import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * LanguageContext — Provides language state ('en' | 'hi') and toggle function
 * to all child components. Persists preference to localStorage.
 */
const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
  isHindi: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('diwali-lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('diwali-lang', language);
    } catch {
      // localStorage unavailable, ignore
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        isHindi: language === 'hi',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * LanguageToggle — EN / हि toggle switch with gold active indicator.
 */
export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-1 py-1 rounded-[var(--radius-full)] border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/60 transition-colors duration-300"
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      title={`Switch to ${language === 'en' ? 'हिंदी' : 'English'}`}
    >
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-[var(--radius-full)] transition-all duration-300 ${
          language === 'en'
            ? 'bg-[var(--color-gold)] text-[var(--color-midnight)]'
            : 'text-[var(--color-champagne)]'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        EN
      </span>
      <span
        className={`px-2 py-0.5 text-xs font-semibold rounded-[var(--radius-full)] transition-all duration-300 ${
          language === 'hi'
            ? 'bg-[var(--color-gold)] text-[var(--color-midnight)]'
            : 'text-[var(--color-champagne)]'
        }`}
        style={{ fontFamily: 'var(--font-hindi-body)' }}
      >
        हि
      </span>
    </button>
  );
}

export { LanguageContext };
