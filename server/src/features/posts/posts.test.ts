import { describe, expect, it } from 'vitest';
import { createPostBody, listPostsQuery } from './schema';
import { makeExcerpt } from './service';

describe('posts: createPostBody', () => {
  const ok = { type: 'built', title: 'Hello world', body: 'Some **markdown**' };

  it('accepts a minimal post and applies defaults', () => {
    const out = createPostBody.parse(ok);
    expect(out.request).toBe('none');
    expect(out.tags).toEqual([]);
  });
  it('normalises and dedupes tags', () => {
    expect(createPostBody.parse({ ...ok, tags: ['React', 'react', 'Next.js'] }).tags).toEqual(['react', 'next.js']);
  });
  it('treats an empty link as no link', () => {
    expect(createPostBody.parse({ ...ok, link: '' }).link).toBeUndefined();
  });
  it('rejects javascript: links and unknown types', () => {
    expect(() => createPostBody.parse({ ...ok, link: 'javascript:alert(1)' })).toThrow();
    expect(() => createPostBody.parse({ ...ok, type: 'spam' })).toThrow();
  });
  it('rejects fields it does not know (no setting hidden or authorId)', () => {
    expect(() => createPostBody.parse({ ...ok, hidden: true })).toThrow();
  });
});

describe('posts: listPostsQuery + excerpt', () => {
  it('caps the page size and defaults it', () => {
    expect(listPostsQuery.parse({}).limit).toBe(15);
    expect(() => listPostsQuery.parse({ limit: '500' })).toThrow();
  });
  it('strips markdown from the excerpt', () => {
    expect(makeExcerpt('# Hi\n```js\nx()\n```\nSee [docs](https://a.dev) **now**')).toBe('Hi See docs now');
  });
});
