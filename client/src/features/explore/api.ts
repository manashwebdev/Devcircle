import { api } from '@/core/api';
import type { ExploreData } from './types';

export const getExplore = (signal?: AbortSignal) => api<ExploreData>('/explore', { signal });
