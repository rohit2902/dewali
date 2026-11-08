import { motion } from 'motion/react';

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
  primary:
    'bg-[var(--color-gold)] text-[var(--color-midnight)] font-semibold hover:shadow-[var(--shadow-glow-strong)]',
  secondary:
    'bg-transparent border border-[var(--color-gold)] text-[var(--color-gold)] font-medium hover:bg-[var(--color-gold)] hover:text-[var(--color-midnight)]',
  ghost:
    'bg-transparent text-[var(--color-gold)] font-medium hover:underline underline-offset-4 decoration-[var(--color-gold)]',
};

/**
 * Reusable Button component with primary, secondary, and ghost variants.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 * @param {string} [props.href] - If provided, renders as an anchor tag.
 * @param {React.ElementType} [props.as] - Custom element type to render.
 * @param {boolean} [props.disabled]
 * @param {function} [props.onClick]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  href,
  as,
  disabled = false,
  ...rest
}) {
  const Component = as || (href ? 'a' : 'button');
  const isButton = Component === 'button';

  const classes = [
    'inline-flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-300 cursor-pointer',
    'tracking-wide leading-none whitespace-nowrap select-none',
    sizeClasses[size],
    variantClasses[variant],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className="inline-block"
    >
      <Component
        className={classes}
        onClick={disabled ? undefined : onClick}
        href={href}
        {...(isButton && { type: rest.type || 'button', disabled })}
        {...rest}
      >
        {children}
      </Component>
    </motion.div>
  );
}
