import { Flame } from 'lucide-react';

export default function DiyaInteraction({
  litDiyas,
  onToggleDiya,
  onLightAll,
  isHindi,
}) {
  return (
    <div className="diya-courtyard">
      <div className="diya-courtyard__header">
        <div>
          <h3 className="diya-courtyard__title">
            {isHindi ? 'दीप प्रज्वलन — वर्चुअल प्रांगण' : 'Light a Diya in the Courtyard'}
          </h3>
          <p className="diya-courtyard__subtitle">
            {isHindi
              ? 'किसी भी दीये को स्पर्श कर उसे प्रज्वलित करें'
              : 'Tap any diya to illuminate it with an auspicious flame'}
          </p>
        </div>

        <div className="diya-courtyard__controls">
          <span className="diya-counter-badge">
            {litDiyas.size} / 12 {isHindi ? 'दीये प्रज्वलित' : 'Diyas Lit'}
          </span>
          <button
            type="button"
            onClick={onLightAll}
            className="diya-light-all-btn"
          >
            {isHindi ? 'सभी जलाएँ' : 'Light All'}
          </button>
        </div>
      </div>

      {/* 12 Diyas Grid */}
      <div className="diyas-grid">
        {Array.from({ length: 12 }).map((_, i) => {
          const isLit = litDiyas.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggleDiya(i)}
              className="diya-slot"
              aria-label={
                isLit
                  ? (isHindi ? `दीया ${i + 1} बुझाएँ` : `Extinguish Diya ${i + 1}`)
                  : (isHindi ? `दीया ${i + 1} प्रज्वलित करें` : `Light Diya ${i + 1}`)
              }
            >
              {/* Flame element */}
              <div
                className={`diya-flame-container ${isLit ? 'is-lit' : ''}`}
              >
                <Flame
                  size={28}
                  className={
                    isLit
                      ? 'text-[var(--color-saffron)] drop-shadow-[0_0_12px_#E99A3A]'
                      : 'text-slate-600'
                  }
                />
              </div>

              {/* Diya Base Image */}
              <img
                src="/images/spread-light/spread-diya.webp"
                alt={isHindi ? `दीया ${i + 1}` : `Diya ${i + 1}`}
                className={`diya-image ${isLit ? 'is-lit' : ''}`}
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

