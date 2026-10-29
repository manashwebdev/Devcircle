import type { CharacterId } from '../types';

/**
 * Pixel mascot as text grids (12 x 12). One letter = one pixel. No image files needed.
 *   . empty   o outline   h hair   s skin   e eye   m mouth   b shirt   w white   k sparkle   z sleep "z"
 * A mood only replaces a few rows of the base grid.
 */
export type Mood = 'idle' | 'typing' | 'celebrating' | 'sleeping';
export const MOODS: Mood[] = ['idle', 'typing', 'celebrating', 'sleeping'];
export const CHARACTERS: CharacterId[] = ['ember', 'moss', 'azure', 'plum', 'blaze', 'frost', 'rose', 'bruno', 'coco', 'jax', 'luna'];

const BASE = [
  '..oooooooo..',
  '.ohhhhhhhho.',
  '.ohhhhhhhho.',
  '.osssssssso.',
  '.osesssseso.',
  '.osssssssso.',
  '.ossssmmsso.',
  '..oooooooo..',
  '..obbbbbbo..',
  '.obbbbbbbbo.',
  '.obbbbbbbbo.',
  '..oo....oo..',
];

// row index -> replacement row
const OVERRIDES: Record<Mood, Record<number, string>> = {
  idle: {},
  // looks down at a laptop, hands on keys
  typing: { 4: '.osssssssso.', 5: '.osesssseso.', 10: '.obwwwwwwbo.' },
  // open mouth, arms up, sparkles
  celebrating: { 0: 'k..oooooo..k', 6: '.ossmmmmsso.', 8: 'o.obbbbbbo.o' },
  // eyes shut, a "z" floating up
  sleeping: { 0: '..ooooooooz.', 4: '.osossssoso.' },
};

// Hair / headwear styles. They only touch rows 1-3 and 7, which moods never change, so every style works in every mood.
const STYLES: Record<string, Record<number, string>> = {
  spike: { 1: '.ohhohhohho.', 2: '.ohhhhhhhho.' },
  mohawk: { 1: '.osshhhhsso.', 2: '.osshhhhsso.' },
  long: { 3: '.ohssssssho.', 7: '.hooooooooh.' },
  beard: { 7: '..ohhhhhho..' },
  afro: { 1: 'hhhhhhhhhhhh', 2: 'hhhhhhhhhhhh', 3: 'hhossssssohh' },
  cap: { 1: '.ohhhhhhhho.', 2: '.ohhhhhhhho.', 3: '.ohhhhhhhhhh' },
  bangs: { 3: '.ohhsssshho.' },
};

/** Which style each character wears. Characters not listed use the plain base hair. */
const CHARACTER_STYLE: Partial<Record<CharacterId, keyof typeof STYLES>> = { blaze: 'spike', frost: 'mohawk', rose: 'long', bruno: 'beard', coco: 'afro', jax: 'cap', luna: 'bangs' };

export function spriteRows(mood: Mood, character: CharacterId = 'ember'): string[] {
  const over = OVERRIDES[mood];
  const style = STYLES[CHARACTER_STYLE[character] ?? ''] ?? {};
  return BASE.map((row, i) => over[i] ?? style[i] ?? row);
}

/** Map a grid letter to a CSS color. Colors come from tokens.css, so themes and characters can change them. */
export function pixelFill(ch: string, character: CharacterId): string | null {
  switch (ch) {
    case 'o':
      return 'rgb(var(--sprite-outline))';
    case 's':
      return `rgb(var(--ch-${character}-skin))`;
    case 'e':
      return 'rgb(var(--sprite-eye))';
    case 'm':
      return 'rgb(var(--sprite-mouth))';
    case 'w':
      return 'rgb(var(--sprite-white))';
    case 'k':
      return 'rgb(var(--accent-strong))';
    case 'z':
      return 'rgb(var(--muted))';
    case 'h':
      return `rgb(var(--ch-${character}-hair))`;
    case 'b':
      return `rgb(var(--ch-${character}-shirt))`;
    default:
      return null;
  }
}

/** 7 x 7 icon grids for the nav. '#' = filled pixel. Painted with currentColor. */
export const ICONS = {
  feed: ['...#...', '..###..', '.#####.', '#######', '.##.##.', '.##.##.', '.#####.'],
  circles: ['.#####.', '#.....#', '#.....#', '#.....#', '#.....#', '#.....#', '.#####.'],
  profile: ['..###..', '.#####.', '.#####.', '..###..', '.#####.', '#######', '#######'],
  settings: ['#.###.#', '.#####.', '###.###', '##...##', '###.###', '.#####.', '#.###.#'],
  explore: ['...#...', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...'],
  bell: ['...#...', '..###..', '.#####.', '.#####.', '#######', '#######', '...#...'],
  search: ['.###...', '#...#..', '#...#..', '.###...', '...##..', '....##.', '.....##'],
  digest: ['#.#####', '.......', '#.#####', '.......', '#.#####', '.......', '#.####.'],
  flame: ['...#...', '..##...', '..###..', '.#####.', '#######', '#######', '.#####.'],
  admin: ['..###..', '.#####.', '#######', '#######', '#######', '.#####.', '..###..'],
  compose: ['...#...', '...#...', '...#...', '#######', '...#...', '...#...', '...#...'],
  more: ['.......', '.......', '#.#.#.#', '.......', '.......', '.......', '.......'],
} as const;
