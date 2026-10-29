import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { seedProfiles } from './seed';

const profiles: FeatureModule = {
  manifest: {
    id: 'profiles',
    name: 'Profiles',
    description: 'Username, pixel character, bio, links, tech stack and streak.',
    permissions: ['profile:read', 'profile:update:self'],
  },
  router,
  seed: seedProfiles,
};

export default profiles;
