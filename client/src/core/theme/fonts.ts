import { Pixelify_Sans, Courier_Prime } from 'next/font/google';

/**
 * ALL FONTS LIVE HERE. Swap either import and the whole app follows
 * (tailwind.config.ts reads --font-display / --font-body).
 *
 * Picked from the reference video (no exact font names were given):
 *  - display: chunky pixel letterforms in the "Hi, I'm Anubhav!" headline  -> Pixelify Sans
 *  - body:    bold typewriter-style monospace with slab serifs             -> Courier Prime
 * Press Start 2P or Silkscreen are good alternatives for display; Space Mono / JetBrains Mono for body.
 */
export const displayFont = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const bodyFont = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});
