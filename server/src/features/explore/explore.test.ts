import { describe, expect, it } from 'vitest';
import { sharedTech } from './service';

describe('explore: sharedTech', () => {
  it('returns only the technologies both people use', () => {
    expect(sharedTech(['rust', 'go', 'react'], ['react', 'python', 'rust'])).toEqual(['react', 'rust']);
  });
  it('is empty when you have no stack yet', () => {
    expect(sharedTech([], ['react'])).toEqual([]);
  });
});
