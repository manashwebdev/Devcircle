import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "ai-summaries". No pages and no nav entry: it fills the postTop slot on the post page. */
const aiSummaries: FeatureManifest = {
  id: 'ai-summaries',
  name: 'AI summaries',
  routes: [],
  slots: { postTop: lazy(() => import('./components/TldrCard')) },
};

export default aiSummaries;
