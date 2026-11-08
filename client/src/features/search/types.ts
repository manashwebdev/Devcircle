import type { PersonLite, PostLite } from '@/core/types';

export interface SearchResults {
  posts: PostLite[];
  people: PersonLite[];
}
