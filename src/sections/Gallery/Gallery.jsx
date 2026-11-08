import { useState } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import GalleryLightbox from './GalleryLightbox';
import { galleryCategories, galleryItems, creativeCorner } from '../../data/galleryData';
import { useLanguage } from '../../components/ui/LanguageToggle';
import './Gallery.css';

export default function Gallery() {
  const { isHindi } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section id="gallery" className="gallery-section py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          hindi="कला दीर्घा"
          title="A Festival of Beautiful Traditions."
          description={
            isHindi
              ? "दीपों की चमक, रंगोली के रंग, घर की सजावट और त्योहार की मिठास।"
              : "Witness the radiant aesthetics of Diwali captured across light, culinary art, and festive spaces."
          }
          className="mb-8 sm:mb-10"
        />

        {/* Categories */}
        <div className="gallery-filter-tabs">
          {galleryCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`gallery-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {isHindi ? cat.labelHindi : cat.label}
            </button>
          ))}
        </div>

        {/* Masonry / Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(index)}
              className="gallery-item"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenLightbox(index)}
              aria-label={`View ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="gallery-item__image"
                loading="lazy"
              />
              <div className="gallery-item__overlay">
                <h4 className="gallery-item__title">
                  {isHindi ? item.titleHindi : item.title}
                </h4>
                <p className="gallery-item__caption">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Creative Corner */}
        <div className="creative-corner-wrapper">
          <SectionHeading
            hindi="रचनात्मक कोना"
            title="Creative Corner"
            description={
              isHindi
                ? "त्योहार की कला से प्रेरित हों और अपनी रचनात्मकता को नया रूप दें।"
                : "Inspirations for your rangoli, diya painting, and festive home craft."
            }
          />

          <div className="creative-grid">
            {creativeCorner.map((craft) => (
              <div key={craft.id} className="creative-card">
                <div className="creative-card__image-frame">
                  <img
                    src={craft.image}
                    alt={craft.title}
                    className="creative-card__image"
                    loading="lazy"
                  />
                </div>
                <h4 className="creative-card__title">
                  {isHindi ? craft.titleHindi : craft.title}
                </h4>
                <p className="creative-card__description">
                  {isHindi ? craft.descriptionHindi : craft.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <GalleryLightbox
          isOpen={lightboxIndex >= 0}
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </Container>
    </section>
  );
}
