import type { Config } from 'tailwindcss';

/**
 * Tailwind reads colors and fonts from CSS variables, so the whole look is swapped in two files:
 *   colors -> src/core/theme/tokens.css
 *   fonts  -> src/core/theme/fonts.ts
 */
const rgb = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: rgb('bg'),
        surface: rgb('surface'),
        'surface-2': rgb('surface-2'),
        ink: rgb('ink'),
        muted: rgb('muted'),
        line: rgb('line'),
        accent: rgb('accent'),
        'accent-strong': rgb('accent-strong'),
        'on-accent': rgb('on-accent'),
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-monospace', 'monospace'],
        body: ['var(--font-body)', 'ui-monospace', 'monospace'],
      },
      // Stepped, blur-free shadows: a solid offset block, like a pixel drop shadow.
      boxShadow: {
        pixel: '4px 4px 0 0 rgb(var(--shadow))',
        'pixel-sm': '2px 2px 0 0 rgb(var(--shadow))',
        'pixel-lg': '6px 6px 0 0 rgb(var(--shadow))',
      },
      borderRadius: { none: '0' },
    },
  },
  plugins: [],
};
export default config;
