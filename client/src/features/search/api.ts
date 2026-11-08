import { api } from '@/core/api';
import type { SearchResults } from './types';

export const search = (q: string, signal?: AbortSignal) => api<SearchResults>(`/search?${new URLSearchParams({ q })}`, { signal });
