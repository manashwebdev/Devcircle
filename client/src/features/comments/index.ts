import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "comments". No pages and no nav entry: it fills the postFooter slot on the post page. */
const comments: FeatureManifest = {
  id: 'comments',
  name: 'Comments',
  routes: [],
  slots: { postFooter: lazy(() => import('./components/CommentsSection')) },
};

export default comments;
