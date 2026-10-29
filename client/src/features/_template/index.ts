import { lazy } from 'react';
import type { FeatureManifest } from '@/core/types';

/**
 * Copy this folder to src/features/<your-feature> and rename:
 *  1. `id` below must equal the folder name AND the server folder name.
 *  2. add `'<id>': { enabled: true }` to src/config/features.config.ts (and the server one).
 *  3. `npm run dev` re-generates the registry automatically.
 */
const template: FeatureManifest = {
  id: '_template',
  name: 'Template',
  nav: { label: 'Template', href: '/template', icon: 'circles', order: 50 },
  routes: [{ path: '/template', component: lazy(() => import('./components/TemplatePage')), auth: 'required' }],
};

export default template;
