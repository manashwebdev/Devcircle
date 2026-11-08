'use client';

import Link from 'next/link';
import { Markdown, PixelAvatar } from '@/core/ui';
import { timeAgo } from '@/core/time';
import type { CommentItem } from '../types';

/** One comment (no replies; the section nests them). */
export function CommentItemView({
  comment,
  onReply,
  onDelete,
}: {
  comment: CommentItem;
  onReply?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-3">
      {comment.author ? <PixelAvatar character={comment.author.character} size={32} /> : <div className="size-8 shrink-0" />}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          {comment.author ? (
            <Link href={`/u/${comment.author.username}`} className="text-ink hover:text-accent-strong">
              {comment.author.displayName} <span className="text-muted">@{comment.author.username}</span>
            </Link>
          ) : (
            <span>deleted user</span>
          )}
          <span>· {timeAgo(comment.createdAt)}</span>
        </div>
        <div className="text-sm">
          <Markdown source={comment.body} />
        </div>
        <div className="mt-1 flex gap-3 text-xs uppercase text-muted">
          {onReply && (
            <button type="button" onClick={onReply} className="hover:text-ink">
              Reply
            </button>
          )}
          {comment.canDelete && (
            <button type="button" onClick={onDelete} className="hover:text-accent-strong">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
