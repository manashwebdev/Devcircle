import { describe, expect, it } from 'vitest';
import { searchQuery } from './schema';
import { escapeRegex, parseTerm } from './service';

describe('search', () => {
  it('escapes regex characters so user text stays literal', () => {
    const rx = new RegExp(escapeRegex('c++ (v2)?'), 'i');
    expect(rx.test('learning C++ (v2)? today')).toBe(true);
    expect(rx.test('cccc')).toBe(false);
  });
  it('treats a leading # as a tag-only search', () => {
    expect(parseTerm('#Rust')).toEqual({ term: 'rust', tagOnly: true });
    expect(parseTerm('  next.js ')).toEqual({ term: 'next.js', tagOnly: false });
  });
  it('rejects one-letter and huge queries', () => {
    expect(() => searchQuery.parse({ q: 'a' })).toThrow();
    expect(() => searchQuery.parse({ q: 'x'.repeat(61) })).toThrow();
    expect(searchQuery.parse({ q: 'react' }).scope).toBe('all');
  });
});
