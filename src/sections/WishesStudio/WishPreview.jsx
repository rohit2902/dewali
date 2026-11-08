import { useRef, useState } from 'react';
import { Download, Share2, MessageCircle } from 'lucide-react';
import { downloadGreeting } from '../../utils/downloadGreeting';
import { shareViaWhatsApp, shareNative } from '../../utils/shareContent';
import { useLanguage } from '../../components/ui/LanguageToggle';

/**
 * WishPreview — Live updating greeting card preview with high-res PNG export
 * and instant WhatsApp & native social sharing.
 */
export default function WishPreview({
  recipient,
  sender,
  lang,
  selectedTemplate,
  customMessage
}) {
  const { isHindi } = useLanguage();
  const cardRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    const safeName = recipient.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'greeting';
    await downloadGreeting(cardRef.current, `diwali-wish-${safeName}.png`);
    setIsExporting(false);
  };

  const handleWhatsApp = () => {
    const text = `🪔 *Happy Diwali Wish from ${sender}*\n\n"${customMessage}"\n\nWishing you and your family abundant peace, joy, and light!`;
    shareViaWhatsApp(text);
  };

  return (
    <div className="wishes-preview-container">
      {/* Live Greeting Card Element to Export */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--color-gold)] p-8 flex flex-col justify-between text-center min-h-[560px]"
        style={{
          backgroundImage: `url(${selectedTemplate.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'var(--color-midnight)'
        }}
      >
        {/* Color Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: selectedTemplate.overlayColor }}
          aria-hidden="true"
        />

        {/* Card Content */}
        <div className="relative z-10 flex flex-col items-center h-full justify-between">
          <div>
            <div className="w-12 h-12 mx-auto mb-3 text-[var(--color-gold)] flex items-center justify-center text-2xl">
              🪔
            </div>
            <h3
              className="font-serif text-3xl font-semibold tracking-wide mb-1"
              style={{ color: selectedTemplate.textColor }}
            >
              {lang === 'hi' ? 'शुभ दीपावली' : 'Happy Diwali'}
            </h3>
            <p
              className="text-xs uppercase tracking-widest opacity-80"
              style={{ color: selectedTemplate.accentColor }}
            >
              The Art of Light
            </p>
          </div>

          <div className="my-6 px-4">
            <p
              className="font-serif italic text-lg mb-4"
              style={{ color: selectedTemplate.textColor }}
            >
              {lang === 'hi' ? `प्रिय ${recipient},` : `Dear ${recipient},`}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: selectedTemplate.accentColor }}
            >
              {customMessage}
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--color-gold)]/30 w-full">
            <p
              className="text-xs uppercase tracking-wider mb-1 opacity-75"
              style={{ color: selectedTemplate.accentColor }}
            >
              {lang === 'hi' ? 'सप्रेम स्नेह' : 'With Warmth & Light'}
            </p>
            <p
              className="font-serif text-lg font-medium"
              style={{ color: selectedTemplate.textColor }}
            >
              {sender}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-8 justify-center w-full max-w-[420px]">
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex-1 min-w-[140px] py-3 px-5 rounded-full bg-[var(--color-gold)] text-[var(--color-midnight)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--color-gold-light)] shadow-[var(--shadow-glow)] transition-all cursor-pointer"
          aria-label="Download greeting card as PNG"
        >
          <Download size={16} aria-hidden="true" />
          <span>{isExporting ? (isHindi ? 'डाउनलोड हो रहा...' : 'Generating...') : (isHindi ? 'PNG डाउनलोड' : 'Download PNG')}</span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="py-3 px-5 rounded-full bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          aria-label="Share wish on WhatsApp"
        >
          <MessageCircle size={16} aria-hidden="true" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => shareNative({ title: 'Happy Diwali Wish', text: customMessage })}
          className="p-3 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all cursor-pointer"
          aria-label="Share via device menu"
        >
          <Share2 size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

