import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const reactions: FeatureModule = {
  manifest: {
    id: 'reactions',
    name: 'Reactions',
    description: 'Helpful / Ship it / Learned something / Same here. Private by design: only the author sees totals.',
    permissions: ['reaction:read', 'reaction:toggle'],
  },
  router,
};

export default reactions;
