/**
 * SectionHeading — Decorative section heading with Hindi subtitle,
 * gold ornament line, English title and optional description.
 */
export default function SectionHeading({
  hindi,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col gap-3 mb-12 ${alignClass} ${className}`}>
      {/* Hindi subtitle */}
      {hindi && (
        <span
          className="text-[var(--color-gold)] tracking-widest uppercase"
          style={{
            fontFamily: 'var(--font-hindi-heading)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {hindi}
        </span>
      )}

      {/* Decorative gold ornament */}
      <div
        className={`flex items-center gap-3 ${
          align === 'left' ? 'justify-start' : 'justify-center'
        }`}
      >
        <span className="block w-8 h-px bg-[var(--color-gold)] opacity-60" />
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[var(--color-gold)] opacity-80"
          aria-hidden="true"
        >
          <path
            d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z"
            fill="currentColor"
          />
        </svg>
        <span className="block w-8 h-px bg-[var(--color-gold)] opacity-60" />
      </div>

      {/* Main English heading */}
      <h2
        className="text-[var(--color-ivory)] leading-tight"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-4xl)',
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h2>

      {/* Optional description */}
      {description && (
        <p
          className="max-w-2xl text-[var(--color-champagne)] leading-relaxed mt-2"
          style={{ fontSize: 'var(--text-base)' }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
