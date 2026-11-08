import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import { meaningThemes, traditions } from '../../data/meaningData';
import { useLanguage } from '../../components/ui/LanguageToggle';
import './Meaning.css';

export default function Meaning() {
  const { isHindi } = useLanguage();

  return (
    <section id="meaning" className="meaning-section py-16 sm:py-20 lg:py-24">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          hindi="अर्थ और परंपराएँ"
          title="More Than a Festival. A Meaning."
          description={
            isHindi
              ? "दीपावली केवल दीपों का पर्व नहीं, बल्कि आत्म-ज्ञान, आशा और मानवीय संबंधों का उत्सव है।"
              : "Diwali transcends fireworks and illumination. It is an inner awakening to compassion, wisdom, and the eternal return of hope."
          }
          className="mb-10 sm:mb-12"
        />

        {/* 4 Pillars Grid — 4 cols wide desktop, 2 cols tablet, 1 col mobile */}
        <div className="meaning-cards-grid">
          {meaningThemes.map((theme) => (
            <div key={theme.id} className="meaning-card group">
              {/* Image Frame with Consistent Aspect Ratio (16/10) */}
              <div className="meaning-card__image-frame">
                <img
                  src={theme.image}
                  alt={theme.title}
                  className="meaning-card__image"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-midnight)]/90 via-transparent to-transparent pointer-events-none" />
                <span className="meaning-card__badge">
                  {isHindi ? theme.titleHindi : theme.title}
                </span>
              </div>

              {/* Text Content Area */}
              <div className="meaning-card__content">
                <h3 className="meaning-card__title">
                  {isHindi ? theme.titleHindi : theme.title}
                </h3>
                <p className="meaning-card__description">
                  {isHindi ? theme.descriptionHindi : theme.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Traditions We Keep — Responsive Grid (5 cols wide, 3 cols medium, 2 sm, 1 mobile) */}
        <div className="traditions-wrapper">
          <SectionHeading
            hindi={isHindi ? "हमारी रीतियाँ" : "परंपरा"}
            title={isHindi ? "परंपराएँ जो हम निभाते हैं" : "The Traditions We Keep"}
            description={
              isHindi
                ? "सदियों से चली आ रही वो पावन रीतियाँ जो हर वर्ष हमारे परिवार और मन को जोड़ती हैं।"
                : "Timeless rituals lovingly preserved and passed down from one generation to the next."
            }
            className="mb-10 sm:mb-12"
          />

          <div className="traditions-grid">
            {traditions.map((item) => (
              <div key={item.id} className="tradition-card">
                <div className="tradition-card__icon" aria-hidden="true">
                  ✦
                </div>
                <h4 className="tradition-card__title">
                  {isHindi ? item.titleHindi : item.title}
                </h4>
                <p className="tradition-card__description">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
