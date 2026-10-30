import { events } from '../../core/events';
import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { recordCircleDay, recordPersonalCheckin } from './service';

const logError = (err: unknown) => console.error('[streaks]', err);

const streaks: FeatureModule = {
  manifest: {
    id: 'streaks',
    name: 'Streaks',
    description: 'Personal and circle streaks with calendar heatmaps. Built entirely from events.',
    permissions: ['streak:read'],
  },
  router,
  // Listen to what other features announce. We never import them.
  // The handlers are async and the bus is not, so every promise needs its own .catch.
  init: () => {
    events.on('checkin.completed', (p) => void recordPersonalCheckin(p.userId, p.day).catch(logError));
    events.on('circle.day.completed', (p) => void recordCircleDay(p.circleId, p.day).catch(logError));
  },
};

export default streaks;