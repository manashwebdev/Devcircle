import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "search". */
const search: FeatureManifest = {
  id: 'search',
  name: 'Search',
  nav: { label: 'Search', href: '/search', icon: 'search', order: 22 },
  routes: [{ path: '/search', component: lazy(() => import('./components/SearchPage')) }],
};

export default search;
