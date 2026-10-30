import { registerCircleAccess } from '../../core/access';
import type { FeatureModule } from '../../core/types';
import { Circle } from './model';
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
  // Runs once at startup: tell other features how to check circle access (members, or anyone if public).
  init: () =>
    registerCircleAccess(async (userId, circleId) => {
      const c = await Circle.findById(circleId).select('visibility members.userId').lean();
      return !!c && (c.visibility === 'public' || c.members.some((m) => String(m.userId) === userId));
    }),
};

export default circles;