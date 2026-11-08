import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const admin: FeatureModule = {
  manifest: {
    id: 'admin',
    name: 'Admin',
    description: 'Moderation: site stats, ban / unban users (revokes their sessions), hide / unhide posts.',
    permissions: ['admin:*'],
  },
  router,
};

export default admin;
