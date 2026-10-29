import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { seedPosts } from './seed';

const posts: FeatureModule = {
  manifest: {
    id: 'posts',
    name: 'Posts',
    description: 'Built / Broke / Learned posts with markdown, tags, an optional link and a Try it / Review it flag.',
    permissions: ['post:read', 'post:create', 'post:delete:own'],
  },
  router,
  seed: seedPosts,
};

export default posts;
