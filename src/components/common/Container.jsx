/**
 * Container — Responsive centered container with max-width ~1440px
 * and strictly applied responsive horizontal padding:
 *   - 64px on desktop (>=1024px)
 *   - 32px on tablet (768px - 1023px)
 *   - 20px on mobile (<768px)
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.narrow] - Uses --max-width-narrow (800px)
 */
export default function Container({ children, className = '', narrow }) {
  const maxWidthClass = narrow ? 'max-w-[var(--max-width-narrow)]' : '';

  return (
    <div className={`site-container ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
}
