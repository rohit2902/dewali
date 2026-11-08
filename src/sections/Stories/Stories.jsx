import { useState, useEffect } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import Modal from '../../components/ui/Modal';
import StoryCard from './StoryCard';
import { storiesData } from '../../data/storiesData';
import { useLanguage } from '../../components/ui/LanguageToggle';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import './Stories.css';

export default function Stories() {
  const { isHindi } = useLanguage();
  const [selectedStory, setSelectedStory] = useState(null);
  const [isNarrating, setIsNarrating] = useState(false);

  // Stop speech when modal closes
  const handleCloseModal = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
    setSelectedStory(null);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleNarration = () => {
    if (!('speechSynthesis' in window) || !selectedStory) return;

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const textToSpeak = isHindi
      ? `${selectedStory.titleHindi}. ${selectedStory.fullStoryHindi}`
      : `${selectedStory.title}. ${selectedStory.fullStory}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  return (
    <section id="stories" className="stories-section py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          hindi="प्राचीन गाथाएँ"
          title="Stories That Have Lived for Generations."
          description={
            isHindi
              ? "विभिन्न सांस्कृतिक व धार्मिक परंपराओं से जुड़ी पावन कथाएँ जो दीवाली के सत्य और प्रकाश का संदेश देती हैं।"
              : "From Ayodhya to Amritsar, from Pavapuri to South India — explore the diverse legends that illuminate the festival."
          }
          className="mb-10 sm:mb-12"
        />

        <div className="stories-grid">
          {storiesData.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onRead={(s) => setSelectedStory(s)}
            />
          ))}
        </div>

        {/* Full Story Modal */}
        <Modal
          isOpen={!!selectedStory}
          onClose={handleCloseModal}
          title={selectedStory ? (isHindi ? selectedStory.titleHindi : selectedStory.title) : ''}
          size="lg"
        >
          {selectedStory && (
            <div className="space-y-6 text-[var(--color-champagne)]">
              {/* Featured Image */}
              <div className="h-60 sm:h-72 w-full rounded-lg overflow-hidden relative">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Badges & Optional Audio Narration */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-burgundy)] text-white font-medium">
                    {isHindi ? selectedStory.traditionHindi : selectedStory.tradition}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/30 font-medium">
                    {isHindi ? selectedStory.regionHindi : selectedStory.region}
                  </span>
                </div>

                {/* Narration Button (Web Speech API) */}
                {'speechSynthesis' in window && (
                  <button
                    onClick={toggleNarration}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      isNarrating
                        ? 'bg-[var(--color-gold)] text-[var(--color-midnight)] border-[var(--color-gold)] shadow-[var(--shadow-glow)]'
                        : 'bg-[var(--color-midnight-light)] text-[var(--color-gold)] border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]'
                    }`}
                    aria-label={isNarrating ? "Stop narration" : "Listen to audio narration"}
                  >
                    {isNarrating ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isNarrating ? (isHindi ? "पाठ रोकें" : "Stop Voice") : (isHindi ? "कथा सुनें" : "Listen Narration")}</span>
                  </button>
                )}
              </div>

              {/* Full Text Story */}
              <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed font-sans text-opacity-95">
                {isHindi ? selectedStory.fullStoryHindi : selectedStory.fullStory}
              </div>

              {/* Moral / Essence Callout */}
              <div className="p-4 sm:p-5 rounded-lg bg-[var(--color-midnight-light)] border border-[var(--color-gold)]/30 flex items-start gap-3">
                <Sparkles size={20} className="text-[var(--color-gold)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--color-gold)] font-semibold mb-1">
                    {isHindi ? "शिक्षा व संदेश" : "The Moral Essence"}
                  </p>
                  <p className="font-serif italic text-base text-[var(--color-ivory)]">
                    "{isHindi ? selectedStory.moralHindi : selectedStory.moral}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Container>
    </section>
  );
}
