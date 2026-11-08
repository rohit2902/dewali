import { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, Music } from 'lucide-react';

const MEMORY_PROMPTS = [
  { id: 'childhood', label: 'Favourite Childhood Diwali', labelHindi: 'बचपन की दिवाली', icon: Sparkles },
  { id: 'tradition', label: 'A Cherished Family Tradition', labelHindi: 'पारिवारिक परंपरा', icon: Heart },
  { id: 'grandparents', label: 'A Story from Grandparents', labelHindi: 'बुजुर्गों की सीख', icon: BookOpen },
  { id: 'song', label: 'A Song or Aarti That Touches You', labelHindi: 'प्रिय भजन या आरती', icon: Music },
];

export default function MemoryForm({ isHindi }) {
  const [activePrompt, setActivePrompt] = useState('childhood');
  const [memoryText, setMemoryText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [savedMemories, setSavedMemories] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('diwali-memories');
      if (stored) {
        setSavedMemories(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access restricted or unavailable
    }
  }, []);

  const handleSaveMemory = (e) => {
    e.preventDefault();
    if (!memoryText.trim()) return;

    const newMemory = {
      id: Date.now(),
      category: activePrompt,
      text: memoryText.trim(),
      author: authorName.trim() || (isHindi ? 'एक स्नेही' : 'A Grateful Heart'),
      date: new Date().toLocaleDateString(),
    };

    const updated = [newMemory, ...savedMemories];
    setSavedMemories(updated);
    try {
      localStorage.setItem('diwali-memories', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setMemoryText('');
  };

  return (
    <div className="memory-sanctuary">
      <h3 className="memory-sanctuary__title">
        {isHindi ? 'स्मृतियों का दीया — अपनी यादें साझा करें' : 'Share a Cherished Diwali Memory'}
      </h3>
      <p className="memory-sanctuary__subtitle">
        {isHindi
          ? 'आपकी यादें केवल आपके इस ब्राउज़र में सुरक्षित रहेंगी।'
          : 'Your memories are stored privately on this device for your reflection.'}
      </p>

      {/* Category Chips */}
      <div className="memory-prompt-chips">
        {MEMORY_PROMPTS.map((p) => {
          const Icon = p.icon;
          const isActive = activePrompt === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePrompt(p.id)}
              className={`memory-prompt-chip ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={13} />
              <span>{isHindi ? p.labelHindi : p.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSaveMemory} className="memory-form">
        <div>
          <textarea
            rows={3}
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            placeholder={
              isHindi
                ? 'अपनी सबसे प्यारी दिवाली याद यहाँ लिखें...'
                : 'Describe a moment of laughter, family ritual, or sweetness...'
            }
            maxLength={500}
            className="memory-textarea"
          />
          <div className="flex justify-end mt-1 text-[11px] text-[var(--color-champagne)]/60">
            {memoryText.length} / 500
          </div>
        </div>

        <div className="memory-form-footer">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder={isHindi ? 'आपका नाम (वैकल्पिक)' : 'Your name (optional)'}
            className="memory-input-author"
          />
          <button
            type="submit"
            disabled={!memoryText.trim()}
            className="memory-submit-btn"
          >
            {isHindi ? 'याद संजोएँ' : 'Preserve Memory'}
          </button>
        </div>
      </form>

      {/* Saved reflections */}
      {savedMemories.length > 0 && (
        <div className="saved-memories-container">
          <h4 className="saved-memories-heading">
            {isHindi ? 'आपकी सहेजी हुई स्मृतियाँ' : 'Your Saved Memories'}
          </h4>
          <div className="saved-memories-list">
            {savedMemories.map((m) => (
              <div key={m.id} className="saved-memory-card">
                <p className="saved-memory-card__quote">"{m.text}"</p>
                <span className="saved-memory-card__author">
                  — {m.author} • {m.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

