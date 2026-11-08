import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const explore: FeatureModule = {
  manifest: {
    id: 'explore',
    name: 'Explore',
    description: 'Trending tags, posts asking for a review or a try, and developers who share your stack.',
    permissions: ['explore:read'],
  },
  router,
};

export default explore;
