import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "explore". */
const explore: FeatureManifest = {
  id: 'explore',
  name: 'Explore',
  nav: { label: 'Explore', href: '/explore', icon: 'explore', order: 24 },
  routes: [{ path: '/explore', component: lazy(() => import('./components/ExplorePage')) }],
};

export default explore;
