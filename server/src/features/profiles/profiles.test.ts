import { describe, expect, it } from 'vitest';
import { updateProfileBody } from './schema';

describe('profiles: updateProfileBody', () => {
  it('accepts a partial update and normalises tags', () => {
    const out = updateProfileBody.parse({ techStack: ['TypeScript', 'typescript', 'Next.js'] });
    expect(out.techStack).toEqual(['typescript', 'next.js']);
  });

  it('rejects javascript: links', () => {
    expect(() => updateProfileBody.parse({ links: [{ label: 'x', url: 'javascript:alert(1)' }] })).toThrow();
  });

  it('rejects unknown fields (no mass-assignment of role / banned)', () => {
    expect(() => updateProfileBody.parse({ role: 'admin' })).toThrow();
  });

  it('rejects unknown characters', () => {
    expect(() => updateProfileBody.parse({ character: 'dragon' })).toThrow();
  });
});
