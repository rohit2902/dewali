import { useState } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import DiyaInteraction from './DiyaInteraction';
import MemoryForm from './MemoryForm';
import { useLanguage } from '../../components/ui/LanguageToggle';
import './SpreadLight.css';

export default function SpreadLight() {
  const { isHindi } = useLanguage();
  const [litDiyas, setLitDiyas] = useState(() => new Set([0, 1, 2]));

  const toggleDiya = (index) => {
    setLitDiyas((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const lightAllDiyas = () => {
    setLitDiyas(new Set(Array.from({ length: 12 }, (_, i) => i)));
  };

  return (
    <section id="spread-light" className="spread-light-section py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          hindi="रोशनी फैलाएँ"
          title="Every Light Has a Wish."
          description={
            isHindi
              ? "अपने हाथों से दीये जलाएँ, अपनी पुरानी यादें संजोएँ और इस पावन प्रकाश को आगे बढ़ाएँ।"
              : "Light a ceremonial diya on our interactive courtyard, write down a cherished memory, and carry the blessing forward."
          }
          className="mb-10 sm:mb-12"
        />

        {/* 1. Diya Lighting Interactive Courtyard */}
        <DiyaInteraction
          litDiyas={litDiyas}
          onToggleDiya={toggleDiya}
          onLightAll={lightAllDiyas}
          isHindi={isHindi}
        />

        {/* 2. Personal Memory Sanctuary */}
        <MemoryForm isHindi={isHindi} />

        {/* 3. The Light Lives On — Grand Finale Blessing */}
        <div className="grand-finale-blessing">
          <div className="grand-finale-icon">
            🪔
          </div>
          <p className="grand-finale-shloka">
            दीपो ज्योतिः परंब्रह्म दीपो ज्योतिर्जनार्दनः
          </p>
          <h2 className="grand-finale-title">
            The Light Lives On.
          </h2>
          <p className="grand-finale-desc">
            {isHindi
              ? "आपका घर खुशियों से, आपका मन शांति से और आपका जीवन अनंत प्रकाश से परिपूर्ण रहे।"
              : "May your home be filled with love, your heart with peace, and your life with endless light."}
          </p>
          <div className="grand-finale-badge">
            HAPPY DIWALI — THE ART OF LIGHT
          </div>
        </div>
      </Container>
    </section>
  );
}
