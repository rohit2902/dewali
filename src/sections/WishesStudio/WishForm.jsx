import { wishTemplates, greetingCategories, defaultMessages } from '../../data/wishesData';
import { useLanguage } from '../../components/ui/LanguageToggle';

/**
 * WishForm — Interactive form controls for generating personalized Diwali cards.
 */
export default function WishForm({
  recipient,
  setRecipient,
  sender,
  setSender,
  category,
  setCategory,
  lang,
  setLang,
  selectedTemplate,
  setSelectedTemplate,
  customMessage,
  setCustomMessage
}) {
  const { isHindi } = useLanguage();

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    setCustomMessage(defaultMessages[catId][lang]);
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setCustomMessage(defaultMessages[category][newLang]);
  };

  return (
    <div className="wishes-form-container space-y-6">
      {/* Recipient */}
      <div className="wish-input-group">
        <label className="wish-input-label">
          {isHindi ? 'प्राप्तकर्ता का नाम' : 'Recipient Name'}
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={isHindi ? 'उदा. शर्मा परिवार / राहुल' : 'e.g. Sharma Family / Priya'}
          className="wish-input-field"
        />
      </div>

      {/* Language & Relationship Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="wish-input-group mb-0">
          <label className="wish-input-label">
            {isHindi ? 'भाषा' : 'Language'}
          </label>
          <div className="flex rounded-lg border border-[var(--color-gold)]/30 overflow-hidden">
            <button
              type="button"
              onClick={() => handleLangChange('en')}
              className={`flex-1 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                lang === 'en'
                  ? 'bg-[var(--color-gold)] text-[var(--color-midnight)]'
                  : 'bg-transparent text-[var(--color-ivory)]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('hi')}
              className={`flex-1 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                lang === 'hi'
                  ? 'bg-[var(--color-gold)] text-[var(--color-midnight)]'
                  : 'bg-transparent text-[var(--color-ivory)]'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        <div className="wish-input-group mb-0">
          <label className="wish-input-label">
            {isHindi ? 'संबंध' : 'Relationship'}
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="wish-input-field py-2 text-xs"
          >
            {greetingCategories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--color-midnight)]">
                {c.label} ({c.labelHindi})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Template Selector */}
      <div className="wish-input-group">
        <label className="wish-input-label">
          {isHindi ? 'कार्ड डिज़ाइन थीम' : 'Card Design Template'}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {wishTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => setSelectedTemplate(tmpl)}
              className={`template-card ${selectedTemplate.id === tmpl.id ? 'active' : ''}`}
            >
              <span className="block font-serif font-medium text-xs text-[var(--color-ivory)]">
                {isHindi ? tmpl.nameHindi : tmpl.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Message Textarea */}
      <div className="wish-input-group">
        <label className="wish-input-label">
          {isHindi ? 'शुभकामना संदेश' : 'Greeting Message'}
        </label>
        <textarea
          rows={4}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="wish-input-field"
        />
      </div>

      {/* Sender Signature */}
      <div className="wish-input-group">
        <label className="wish-input-label">
          {isHindi ? 'प्रेषक / आपका नाम' : 'Your Signature / From'}
        </label>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder={isHindi ? 'उदा. राहुल और सुनीता' : 'e.g. Rahul & Sunita'}
          className="wish-input-field"
        />
      </div>
    </div>
  );
}

