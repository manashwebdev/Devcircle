import Link from 'next/link';
import { PixelAvatar, PixelCard } from '@/core/ui';
import { TYPE_INFO, type PostSummary } from '../types';
import { timeAgo } from '../utils';

const REQUEST_LABEL = { try: 'Try it', review: 'Review it' } as const;

/** One post in the feed. The whole title row links to the post page. */
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <PixelCard as="article" tag={TYPE_INFO[post.type].label.toUpperCase()} title={post.title}>
      <div className="mb-3 flex items-center gap-2 text-xs text-muted">
        {post.author && (
          <Link href={`/u/${post.author.username}`} className="flex items-center gap-2 hover:text-ink">
            <PixelAvatar character={post.author.character} size={28} />
            @{post.author.username}
          </Link>
        )}
        <span>· {timeAgo(post.createdAt)}</span>
        {post.request !== 'none' && (
          <span className="ml-auto border-2 border-dashed border-accent-strong px-2 py-0.5 uppercase text-accent-strong">{REQUEST_LABEL[post.request]}</span>
        )}
      </div>
      <p className="text-sm">{post.excerpt}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {post.tags.map((t) => (
          <span key={t} className="border-2 border-dashed border-line px-2 py-0.5 text-xs">{t}</span>
        ))}
        <Link href={`/post/${post.id}`} className="ml-auto text-sm uppercase underline decoration-dashed underline-offset-4 hover:text-accent-strong">
          Read post →
        </Link>
      </div>
    </PixelCard>
  );
}
