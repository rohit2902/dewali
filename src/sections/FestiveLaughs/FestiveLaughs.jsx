import { useState } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import MemeCard from './MemeCard';
import { memeCategories, memes } from '../../data/memesData';
import { copyToClipboard } from '../../utils/shareContent';
import { useLanguage } from '../../components/ui/LanguageToggle';
import './FestiveLaughs.css';

export default function FestiveLaughs() {
  const { isHindi } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState(() => new Set());
  const [copiedId, setCopiedId] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = async (id, text) => {
    await copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMemes = activeCategory === 'all'
    ? memes
    : memes.filter((m) => m.category === activeCategory);

  return (
    <section id="laughs" className="laughs-section py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          hindi="हँसी-मज़ाक"
          title="A Little Tradition. A Lot of Laughter."
          description={
            isHindi
              ? "सफ़ाई के ड्रामे से लेकर सोन पापड़ी के अंतहीन सफ़र तक — दिवाली के वो पल जो हर घर में एक जैसे होते हैं!"
              : "From Ghar Ki Safai exhaustion to uninvited Soan Papdi boxes — celebrate the heartwarming quirks of Indian Diwali."
          }
          className="mb-8 sm:mb-10"
        />

        {/* Filter Pills */}
        <div className="laughs-filter-tabs">
          {memeCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCategory(c.id)}
              className={`laughs-filter-btn ${activeCategory === c.id ? 'active' : ''}`}
            >
              {isHindi ? c.labelHindi : c.label}
            </button>
          ))}
        </div>

        {/* Memes Grid */}
        <div className="memes-grid">
          {filteredMemes.map((m) => (
            <MemeCard
              key={m.id}
              meme={m}
              isFavorite={favorites.has(m.id)}
              onToggleFavorite={toggleFavorite}
              onCopyCaption={handleCopy}
              isCopied={copiedId === m.id}
              isHindi={isHindi}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
