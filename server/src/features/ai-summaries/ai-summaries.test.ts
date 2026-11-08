import { describe, expect, it } from 'vitest';
import { parseBullets } from './service';

describe('ai-summaries: parseBullets', () => {
  it('strips bullet markers and markdown, keeps three lines', () => {
    const out = parseBullets('* **One** thing\n- two `things`\n3. three\n4. four');
    expect(out).toEqual(['One thing', 'two things', 'three']);
  });
  it('drops empty lines and caps length', () => {
    const out = parseBullets(`\n\n${'x'.repeat(500)}\n`);
    expect(out).toHaveLength(1);
    expect(out[0]!.length).toBe(220);
  });
  it('returns nothing for an empty reply', () => {
    expect(parseBullets('   ')).toEqual([]);
  });
});
