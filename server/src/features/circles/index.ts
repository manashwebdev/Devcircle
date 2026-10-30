import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { seedCircles } from './seed';

const circles: FeatureModule = {
  manifest: {
    id: 'circles',
    name: 'Circles',
    description: 'Small groups of 5 to 8 developers, joined by invite link. Private by default, optionally public.',
    permissions: ['circle:read', 'circle:create', 'circle:join', 'circle:kick:own'],
  },
  router,
  seed: seedCircles,
};

export default circles;