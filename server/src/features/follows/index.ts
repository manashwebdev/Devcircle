import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const follows: FeatureModule = {
  manifest: {
    id: 'follows',
    name: 'Following',
    description: 'Follow developers and get a Following feed. No follower counts anywhere.',
    permissions: ['follow:read', 'follow:toggle'],
  },
  router,
};

export default follows;
