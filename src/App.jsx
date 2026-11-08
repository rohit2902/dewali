import { useState, useEffect, lazy, Suspense } from 'react';
import { LanguageProvider } from './components/ui/LanguageToggle';
import { AudioProvider } from './context/AudioContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import Hero from './sections/Hero/Hero';

// Lazy-load sections below the fold for performance
const Meaning = lazy(() => import('./sections/Meaning/Meaning'));
const Stories = lazy(() => import('./sections/Stories/Stories'));
const Gallery = lazy(() => import('./sections/Gallery/Gallery'));
const WishesStudio = lazy(() => import('./sections/WishesStudio/WishesStudio'));
const FestiveLaughs = lazy(() => import('./sections/FestiveLaughs/FestiveLaughs'));
const SpreadLight = lazy(() => import('./sections/SpreadLight/SpreadLight'));

function SectionFallback() {
  return (
    <div style={{
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-midnight)',
      color: 'var(--color-gold)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      letterSpacing: '0.1em',
      opacity: 0.5
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid var(--color-gold)',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }} />
        Loading...
      </div>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <LanguageProvider>
      <AudioProvider>
        <div className="app" style={{ background: 'var(--color-midnight)' }}>
          <Navbar visible={introComplete} />
          
          <main>
            <Hero onIntroComplete={handleIntroComplete} />
            
            <Suspense fallback={<SectionFallback />}>
              <Meaning />
            </Suspense>
            
            <Suspense fallback={<SectionFallback />}>
              <Stories />
            </Suspense>
            
            <Suspense fallback={<SectionFallback />}>
              <Gallery />
            </Suspense>
            
            <Suspense fallback={<SectionFallback />}>
              <WishesStudio />
            </Suspense>
            
            <Suspense fallback={<SectionFallback />}>
              <FestiveLaughs />
            </Suspense>
            
            <Suspense fallback={<SectionFallback />}>
              <SpreadLight />
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </AudioProvider>
    </LanguageProvider>
  );
}
