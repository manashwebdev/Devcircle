import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';
import { UnreadBadge } from './components/UnreadBadge';

/** Manifest for "notifications". The nav entry carries a live unread badge. */
const notifications: FeatureManifest = {
  id: 'notifications',
  name: 'Notifications',
  nav: { label: 'Alerts', href: '/notifications', icon: 'bell', order: 15, badge: UnreadBadge },
  routes: [{ path: '/notifications', component: lazy(() => import('./components/NotificationsPage')) }],
};

export default notifications;
