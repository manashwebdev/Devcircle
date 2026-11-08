import Link from 'next/link';
import { timeAgo } from '../time';
import type { PostLite } from '../types';
import { PixelAvatar } from './PixelAvatar';

const REQUEST_LABEL = { try: 'Try it', review: 'Review it' } as const;

/** Compact post card for lists (search results, saved posts, explore boards). The whole card is one link. */
export function PostRow({ post, note }: { post: PostLite; note?: string }) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="group block border-2 border-accent/80 bg-surface p-3 shadow-pixel transition-[transform,box-shadow,border-color] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-ink hover:shadow-pixel-lg"
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="bg-accent px-1.5 py-0.5 text-[10px] uppercase text-on-accent">{post.type}</span>
        {post.author && (
          <span className="flex items-center gap-1">
            <PixelAvatar character={post.author.character} size={20} />@{post.author.username}
          </span>
        )}
        <span>· {note ?? timeAgo(post.createdAt)}</span>
        {post.request !== 'none' && (
          <span className="ml-auto border-2 border-dashed border-accent-strong px-1.5 uppercase text-accent-strong">{REQUEST_LABEL[post.request]}</span>
        )}
      </div>
      <h3 className="font-display text-lg group-hover:text-accent-strong">{post.title}</h3>
      {post.excerpt && <p className="mt-1 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.map((t) => (
            <span key={t} className="border-2 border-dashed border-line px-1.5 text-xs">{t}</span>
          ))}
        </div>
      )}
    </Link>
  );
}
