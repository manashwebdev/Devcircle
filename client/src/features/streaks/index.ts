import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "streaks". No pages and no nav entry: it only fills slots on profile and circle pages. */
const streaks: FeatureManifest = {
  id: 'streaks',
  name: 'Streaks',
  routes: [],
  slots: {
    profile: lazy(() => import('./components/ProfileStreak')),
    circle: lazy(() => import('./components/CircleStreak')),
  },
};

export default streaks;