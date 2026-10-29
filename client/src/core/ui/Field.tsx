import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

const control =
  'w-full border-2 border-dashed border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent-strong';

/** Label + control + hint/error. The base form pieces, so features never restyle inputs themselves. */
export function Field({ label, hint, error, htmlFor, children }: { label: string; hint?: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1 block text-sm text-accent-strong">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-accent-strong">{error}</p> : hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function PixelInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...rest} />;
}

export function PixelTextarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, 'min-h-24', className)} {...rest} />;
}
