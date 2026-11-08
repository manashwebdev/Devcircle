import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "reactions". No pages and no nav entry: it fills the postActions slot on the post page. */
const reactions: FeatureManifest = {
  id: 'reactions',
  name: 'Reactions',
  routes: [],
  slots: { postActions: lazy(() => import('./components/ReactionBar')) },
};

export default reactions;
