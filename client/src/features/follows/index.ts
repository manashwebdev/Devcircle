import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "follows". A Following page, plus a Follow button on profile pages (profile slot). */
const follows: FeatureManifest = {
  id: 'follows',
  name: 'Following',
  nav: { label: 'Following', href: '/following', icon: 'profile', order: 26 },
  routes: [{ path: '/following', component: lazy(() => import('./components/FollowingPage')) }],
  slots: { profile: lazy(() => import('./components/FollowButton')) },
};

export default follows;
