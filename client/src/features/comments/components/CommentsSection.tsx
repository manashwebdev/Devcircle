'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostSlotProps } from '@/core/types';
import { EmptyState, Modal, PixelButton, PixelCard, useToast } from '@/core/ui';
import { createComment, deleteComment, listComments } from '../api';
import type { CommentItem } from '../types';
import { CommentItemView } from './CommentItemView';
import { Composer } from './Composer';

/** Slot widget for the post page: the whole discussion under a post. */
export default function CommentsSection({ postId }: PostSlotProps) {
  const toast = useToast();
  const [items, setItems] = useState<CommentItem[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setState('loading');
    listComments(postId, ctrl.signal)
      .then((r) => {
        setItems(r.items);
        setState('ready');
      })
      .catch(() => !ctrl.signal.aborted && setState('error'));
    return () => ctrl.abort();
  }, [postId]);

  const { top, replies } = useMemo(() => {
    const byParent = new Map<string, CommentItem[]>();
    for (const c of items) {
      if (!c.parentId) continue;
      byParent.set(c.parentId, [...(byParent.get(c.parentId) ?? []), c]);
    }
    return { top: items.filter((c) => !c.parentId), replies: byParent };
  }, [items]);

  const add = useCallback(
    async (body: string, parentId?: string) => {
      const created = await createComment(postId, body, parentId);
      setItems((prev) => [...prev, created]);
      setReplyTo(null);
    },
    [postId],
  );

  const remove = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    try {
      await deleteComment(id);
      // The server deletes replies together with their parent, so mirror that here.
      setItems((prev) => prev.filter((c) => c.id !== id && c.parentId !== id));
      toast('Comment deleted', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete', 'error');
    }
  };

  return (
    <PixelCard title={`Comments${state === 'ready' ? ` (${items.length})` : ''}`}>
      <Composer placeholder="Add a comment. Use @username to mention someone." submitLabel="Comment" onSubmit={(b) => add(b)} />

      <div className="mt-6 space-y-5">
        {state === 'loading' && <p className="text-sm text-muted">Loading comments…</p>}
        {state === 'error' && <p className="text-sm text-accent-strong">Could not load comments.</p>}
        {state === 'ready' && top.length === 0 && (
          <EmptyState title="No comments yet" description="Be the first to say something useful." mood="idle" />
        )}
        {top.map((c) => (
          <div key={c.id}>
            <CommentItemView comment={c} onReply={() => setReplyTo(replyTo === c.id ? null : c.id)} onDelete={() => setConfirmId(c.id)} />
            {(replies.get(c.id)?.length ?? 0) > 0 && (
              <div className="ml-4 mt-3 space-y-4 border-l-2 border-dashed border-line pl-4 md:ml-11">
                {replies.get(c.id)!.map((r) => (
                  <CommentItemView
                    key={r.id}
                    comment={r}
                    onReply={() => setReplyTo(replyTo === r.id ? null : r.id)}
                    onDelete={() => setConfirmId(r.id)}
                  />
                ))}
              </div>
            )}
            {/* A reply box opens under whichever comment you pressed Reply on; the server keeps threads one level deep. */}
            {replyTo !== null && [c, ...(replies.get(c.id) ?? [])].some((x) => x.id === replyTo) && (
              <div className="ml-4 mt-3 md:ml-11">
                <Composer
                  autoFocus
                  initial={`@${[c, ...(replies.get(c.id) ?? [])].find((x) => x.id === replyTo)?.author?.username ?? ''} `}
                  placeholder="Write a reply"
                  submitLabel="Reply"
                  onSubmit={(b) => add(b, replyTo)}
                  onCancel={() => setReplyTo(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={confirmId !== null} onClose={() => setConfirmId(null)} title="Delete this comment?">
        <p className="mb-4 text-sm text-muted">Replies to it are deleted too. This cannot be undone.</p>
        <div className="flex gap-2">
          <PixelButton onClick={() => void remove()}>Delete</PixelButton>
          <PixelButton variant="ghost" onClick={() => setConfirmId(null)}>
            Cancel
          </PixelButton>
        </div>
      </Modal>
    </PixelCard>
  );
}
