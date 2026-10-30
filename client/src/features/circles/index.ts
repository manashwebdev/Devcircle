import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "circles". Same id as server/src/features/circles. */
const circles: FeatureManifest = {
  id: 'circles',
  name: 'Circles',
  nav: { label: 'Circles', href: '/circles', icon: 'circles', order: 30 },
  routes: [
    { path: '/circles', component: lazy(() => import('./components/CirclesPage')) },
    { path: '/circles/join/:code', component: lazy(() => import('./components/JoinPage')) },
    { path: '/circles/:id', component: lazy(() => import('./components/CirclePage')) },
  ],
};

export default circles;