import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'ghost' | 'outline' | 'light';

/**
 * The only button in the app. Dashed pixel border, stepped shadow,
 * lifts on hover and presses flat on click.
 * Pass `href` for a link (internal route) or `external` for a plain <a> (e.g. the OAuth start URL).
 */
const styles: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent border-accent-strong',
  ghost: 'bg-surface-2 text-ink border-line',
  outline: 'bg-transparent text-ink border-accent',
  light: 'bg-ink text-bg border-ink',
};

const base =
  'inline-flex items-center justify-center gap-2 border-2 border-dashed px-4 py-2 font-body text-sm font-bold uppercase tracking-wide ' +
  'shadow-pixel-sm transition-transform duration-75 select-none ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-pixel ' +
  'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ' +
  'disabled:pointer-events-none disabled:opacity-50';

interface Common {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function PixelButton({
  variant = 'primary',
  className,
  href,
  external,
  children,
  ...rest
}: Common & { href?: string; external?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = cn(base, styles[variant], className);
  if (href && external) return <a href={href} className={cls}>{children}</a>;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
