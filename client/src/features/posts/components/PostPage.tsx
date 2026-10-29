'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApiError } from '@/core/api';
import type { RouteProps } from '@/core/types';
import { EmptyState, Markdown, Mascot, Modal, PixelAvatar, PixelButton, PixelCard, useToast } from '@/core/ui';
import { deletePost, getPost } from '../api';
import { TYPE_INFO, type PostFull } from '../types';
import { timeAgo } from '../utils';

/** /post/:id */
export default function PostPage({ params }: RouteProps) {
  const id = params.id ?? '';
  const router = useRouter();
  const toast = useToast();
  const [post, setPost] = useState<PostFull | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setState('loading');
    getPost(id, ctrl.signal)
      .then((p) => { setPost(p); setState('ready'); })
      .catch((e: unknown) => {
        if (ctrl.signal.aborted) return;
        setState(e instanceof ApiError && (e.status === 404 || e.code === 'VALIDATION_ERROR') ? 'missing' : 'error');
      });
    return () => ctrl.abort();
  }, [id]);

  if (state === 'loading') return <Mascot mood="typing" size={64} label="Loading post" />;
  if (state === 'missing') return <EmptyState title="Post not found" description="It may have been deleted." action={<PixelButton href="/feed">Back to feed</PixelButton>} />;
  if (state === 'error' || !post) return <EmptyState title="Couldn't load this post" mood="sleeping" />;

  const remove = async () => {
    try {
      await deletePost(post.id);
      toast('Post deleted', 'success');
      router.replace('/feed');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not delete', 'error');
    }
  };

  return (
    <article>
      <Link href="/feed" className="mb-4 inline-block text-sm text-muted hover:text-ink">← Feed</Link>
      <PixelCard tag={TYPE_INFO[post.type].label.toUpperCase()} title={post.title}>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted">
          {post.author && (
            <Link href={`/u/${post.author.username}`} className="flex items-center gap-2 hover:text-ink">
              <PixelAvatar character={post.author.character} size={32} />
              {post.author.displayName} · @{post.author.username}
            </Link>
          )}
          <span>{timeAgo(post.createdAt)}</span>
          {post.request !== 'none' && <span className="border-2 border-dashed border-accent-strong px-2 py-0.5 uppercase text-accent-strong">{post.request === 'try' ? 'Try it' : 'Review it'}</span>}
        </div>

        <Markdown source={post.body} />

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-line pt-4">
          {post.tags.map((t) => <span key={t} className="border-2 border-dashed border-line px-2 py-0.5 text-xs">{t}</span>)}
          {post.link && <PixelButton href={post.link} external variant="outline" className="ml-auto">Open repo / demo</PixelButton>}
          {post.mine && <PixelButton variant="ghost" onClick={() => setConfirm(true)}>Delete</PixelButton>}
        </div>
      </PixelCard>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Delete this post?">
        <p className="mb-4 text-sm text-muted">This cannot be undone.</p>
        <div className="flex gap-2">
          <PixelButton onClick={() => void remove()}>Delete</PixelButton>
          <PixelButton variant="ghost" onClick={() => setConfirm(false)}>Cancel</PixelButton>
        </div>
      </Modal>
    </article>
  );
}
