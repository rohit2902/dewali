import { BookOpen } from 'lucide-react';
import { useLanguage } from '../../components/ui/LanguageToggle';

/**
 * StoryCard — Editorial card displaying story preview with cultural badges
 * and read story trigger.
 */
export default function StoryCard({ story, onRead }) {
  const { isHindi } = useLanguage();

  return (
    <article className="story-card group">
      <div className="story-card__image-container">
        <img
          src={story.image}
          alt={story.title}
          className="story-card__image"
          loading="lazy"
        />
        <div className="story-card__badges">
          <span className="story-card__badge-tradition">
            {isHindi ? story.traditionHindi : story.tradition}
          </span>
          <span className="story-card__badge-region">
            {isHindi ? story.regionHindi : story.region}
          </span>
        </div>
      </div>

      <div className="story-card__body">
        <div>
          <h3 className="story-card__title">
            {isHindi ? story.titleHindi : story.title}
          </h3>
          <p className="story-card__intro">
            {isHindi ? story.introHindi : story.intro}
          </p>
        </div>

        <button
          onClick={() => onRead(story)}
          className="story-card__action"
          aria-label={isHindi ? `पूरी कथा पढ़ें: ${story.titleHindi}` : `Read story: ${story.title}`}
        >
          <BookOpen size={16} aria-hidden="true" />
          <span>{isHindi ? "पूरी कथा पढ़ें" : "Read Full Story"}</span>
        </button>
      </div>
    </article>
  );
}

