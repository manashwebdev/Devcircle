import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const googleAuth: FeatureModule = {
  manifest: {
    id: 'google-auth',
    name: 'Google sign-in',
    description: 'Adds "Continue with Google" next to GitHub.',
    permissions: [],
  },
  router,
};

export default googleAuth;