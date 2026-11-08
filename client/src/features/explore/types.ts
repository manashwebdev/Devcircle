import type { PersonLite, PostLite } from '@/core/types';

export interface ExploreData {
  trendingTags: { tag: string; count: number }[];
  needsReview: PostLite[];
  tryIt: PostLite[];
  people: (PersonLite & { shared: string[] })[];
}
