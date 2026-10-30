import Link from 'next/link';
import { PixelCard } from '@/core/ui';
import type { CircleSummary } from '../types';

/** One circle in a list. The tag shows whether it has enough people yet. */
export function CircleCard({ circle }: { circle: CircleSummary }) {
  return (
    <PixelCard as="article" tag={circle.status.toUpperCase()} title={circle.name}>
      <p className="mb-3 text-sm">{circle.description || 'No description yet.'}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="border-2 border-dashed border-line px-2 py-0.5">{circle.memberCount} members</span>
        <span className="border-2 border-dashed border-line px-2 py-0.5">{circle.visibility}</span>
        {circle.isOwner && <span className="border-2 border-dashed border-accent-strong px-2 py-0.5 text-accent-strong">you own it</span>}
        <Link href={`/circles/${circle.id}`} className="ml-auto text-sm uppercase underline decoration-dashed underline-offset-4 hover:text-accent-strong">
          Open →
        </Link>
      </div>
    </PixelCard>
  );
}