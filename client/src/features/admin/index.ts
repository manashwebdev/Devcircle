import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/** Manifest for "admin". The nav item is only shown to admins; the server checks the role on every call. */
const admin: FeatureManifest = {
  id: 'admin',
  name: 'Admin',
  nav: { label: 'Admin', href: '/admin', icon: 'admin', order: 90, adminOnly: true },
  routes: [{ path: '/admin', component: lazy(() => import('./components/AdminPage')) }],
};

export default admin;
