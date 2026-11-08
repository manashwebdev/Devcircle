import { describe, expect, it } from 'vitest';
import { commentTargets } from './service';

const base = { commentId: 'c', postId: 'p', postTitle: 't', snippet: 's', authorId: 'me', postAuthorId: 'owner', parentAuthorId: null, mentionedIds: [] as string[] };

describe('notifications: commentTargets', () => {
  it('tells the post author about a new comment', () => {
    expect([...commentTargets(base)]).toEqual([['owner', 'comment']]);
  });
  it('a reply notifies the parent author as "reply" and the post author as "comment"', () => {
    const t = commentTargets({ ...base, parentAuthorId: 'other' });
    expect(t.get('other')).toBe('reply');
    expect(t.get('owner')).toBe('comment');
  });
  it('one notification per person: the strongest reason wins', () => {
    const t = commentTargets({ ...base, parentAuthorId: 'owner', mentionedIds: ['owner', 'x'] });
    expect(t.get('owner')).toBe('reply');
    expect(t.get('x')).toBe('mention');
    expect(t.size).toBe(2);
  });
  it('never notifies the person who wrote the comment', () => {
    expect(commentTargets({ ...base, postAuthorId: 'me', mentionedIds: ['me'] }).size).toBe(0);
  });
});
