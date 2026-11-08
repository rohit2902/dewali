import { useState } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import Container from '../../components/common/Container';
import WishForm from './WishForm';
import WishPreview from './WishPreview';
import { wishTemplates, defaultMessages } from '../../data/wishesData';
import { useLanguage } from '../../components/ui/LanguageToggle';
import './WishesStudio.css';

export default function WishesStudio() {
  const { isHindi } = useLanguage();
  const [recipient, setRecipient] = useState(isHindi ? 'प्रिय परिवार एवं मित्रगण' : 'Dear Family & Friends');
  const [sender, setSender] = useState(isHindi ? 'सप्रेम स्नेह सहित' : 'With warmth & love');
  const [category, setCategory] = useState('family');
  const [lang, setLang] = useState(isHindi ? 'hi' : 'en');
  const [selectedTemplate, setSelectedTemplate] = useState(wishTemplates[0]);
  const [customMessage, setCustomMessage] = useState(defaultMessages.family[isHindi ? 'hi' : 'en']);

  return (
    <section id="wishes" className="wishes-section py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          hindi="शुभकामना स्टूडियो"
          title="Create a Wish. Share the Light."
          description={
            isHindi
              ? "अपनों के लिए सुंदर दीपावली कार्ड तैयार करें — भाषा, संबंध और व्यक्तिगत संदेश चुनकर तुरंत PNG डाउनलोड या साझा करें।"
              : "Craft a personalized Deepavali greeting card with rich festive typography, bespoke themes, and instant PNG export."
          }
          className="mb-10 sm:mb-12"
        />

        <div className="wishes-layout">
          {/* Form Column */}
          <WishForm
            recipient={recipient}
            setRecipient={setRecipient}
            sender={sender}
            setSender={setSender}
            category={category}
            setCategory={setCategory}
            lang={lang}
            setLang={setLang}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            customMessage={customMessage}
            setCustomMessage={setCustomMessage}
          />

          {/* Live Preview Column */}
          <WishPreview
            recipient={recipient}
            sender={sender}
            lang={lang}
            selectedTemplate={selectedTemplate}
            customMessage={customMessage}
          />
        </div>
      </Container>
    </section>
  );
}
