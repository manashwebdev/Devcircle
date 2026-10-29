import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for the always-on "profiles" feature. The server has the same id in server/src/features/profiles. */
const profiles: FeatureManifest = {
  id: 'profiles',
  name: 'Profiles',
  nav: [
    { label: 'Profile', href: '/u/me', icon: 'profile', order: 90 },
    { label: 'Settings', href: '/settings', icon: 'settings', order: 95 },
  ],
  routes: [
    { path: '/u/:username', component: lazy(() => import('./components/ProfilePage')), auth: 'public' },
    { path: '/settings', component: lazy(() => import('./components/SettingsPage')), auth: 'required' },
  ],
};

export default profiles;
