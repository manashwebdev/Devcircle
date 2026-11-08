import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const bookmarks: FeatureModule = {
  manifest: {
    id: 'bookmarks',
    name: 'Saved',
    description: 'Save posts to read later. Private to you.',
    permissions: ['bookmark:read', 'bookmark:toggle'],
  },
  router,
};

export default bookmarks;
