import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "bookmarks". A Saved page, plus a Save button in the postActions slot. */
const bookmarks: FeatureManifest = {
  id: 'bookmarks',
  name: 'Saved',
  nav: { label: 'Saved', href: '/saved', icon: 'bookmark', order: 35 },
  routes: [{ path: '/saved', component: lazy(() => import('./components/SavedPage')) }],
  slots: { postActions: lazy(() => import('./components/SaveButton')) },
};

export default bookmarks;
