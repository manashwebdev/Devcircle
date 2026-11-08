import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { seedComments } from './seed';

const comments: FeatureModule = {
  manifest: {
    id: 'comments',
    name: 'Comments',
    description: 'Markdown comments under every post, one level of replies, @mentions.',
    permissions: ['comment:read', 'comment:create', 'comment:delete:own'],
  },
  router,
  seed: seedComments,
};

export default comments;
