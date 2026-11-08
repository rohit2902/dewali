import { Heart, Copy, Check, Share2 } from 'lucide-react';
import { shareViaWhatsApp } from '../../utils/shareContent';

export default function MemeCard({
  meme,
  isFavorite,
  onToggleFavorite,
  onCopyCaption,
  isCopied,
  isHindi,
}) {
  const captionText = isHindi ? meme.captionHindi : meme.caption;

  return (
    <article className="meme-card">
      <div className="meme-card__image-frame">
        <img
          src={meme.image}
          alt={meme.alt || 'Diwali humor'}
          className="meme-card__image"
          loading="lazy"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(meme.id)}
          className={`meme-card__fav-btn ${isFavorite ? 'is-favorite' : ''}`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="meme-card__body">
        <p className="meme-card__caption font-sans">
          {captionText}
        </p>

        <div className="meme-card__actions">
          <button
            type="button"
            onClick={() => onCopyCaption(meme.id, captionText)}
            className="meme-card__action-btn"
          >
            {isCopied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            <span className={isCopied ? 'text-emerald-400' : ''}>
              {isCopied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'कैप्शन कॉपी करें' : 'Copy Caption')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => shareViaWhatsApp(captionText)}
            className="meme-card__action-btn hover:text-emerald-400"
          >
            <Share2 size={14} />
            <span>{isHindi ? 'शेयर' : 'Share'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

