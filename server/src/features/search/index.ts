import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const search: FeatureModule = {
  manifest: {
    id: 'search',
    name: 'Search',
    description: 'Search posts (title, text, tags) and developers (name, username, tech stack). #tag searches tags only.',
    permissions: ['search:read'],
  },
  router,
};

export default search;
