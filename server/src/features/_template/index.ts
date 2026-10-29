import type { FeatureModule } from '../../core/types';
import { router } from './routes';

/**
 * Copy this folder to src/features/<your-feature>, rename the id below,
 * then add `'<your-feature>': { enabled: true }` to src/config/features.config.ts.
 * The folder name MUST equal manifest.id.
 */
const template: FeatureModule = {
  manifest: {
    id: '_template',
    name: 'Template',
    description: 'Starter feature. Copy me.',
    permissions: [],
  },
  router,
  // seed: async () => {},           // optional demo data for scripts/seed.ts
  // init: () => { events.on(...) }, // optional: react to other features through core/events.ts
};

export default template;
