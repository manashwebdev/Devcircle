import { events } from '../../core/events';
import type { FeatureModule } from '../../core/types';
import { router } from './routes';
import { onComment, onFollow, onReaction } from './service';

const logError = (err: unknown) => console.error('[notifications]', err);

const notifications: FeatureModule = {
  manifest: {
    id: 'notifications',
    name: 'Notifications',
    description: 'In-app notifications for comments, replies, @mentions, reactions and new followers. Built entirely from events.',
    permissions: ['notification:read'],
  },
  router,
  // The bus is synchronous and these handlers are async, so every promise gets its own .catch.
  init: () => {
    events.on('comment.created', (p) => void onComment(p).catch(logError));
    events.on('reaction.created', (p) => void onReaction(p).catch(logError));
    events.on('user.followed', (p) => void onFollow(p).catch(logError));
  },
};

export default notifications;
