import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "posts". Same id as server/src/features/posts. */
const posts: FeatureManifest = {
  id: 'posts',
  name: 'Posts',
  nav: [
    { label: 'Feed', href: '/feed', icon: 'feed', order: 10 },
    { label: 'Compose', href: '/compose', icon: 'compose', order: 20 },
  ],
  routes: [
    { path: '/feed', component: lazy(() => import('./components/FeedPage')) },
    { path: '/compose', component: lazy(() => import('./components/ComposePage')) },
    { path: '/post/:id', component: lazy(() => import('./components/PostPage')) },
  ],
};

export default posts;
