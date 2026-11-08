import type { FeatureModule } from '../../core/types';
import { router } from './routes';

const aiSummaries: FeatureModule = {
  manifest: {
    id: 'ai-summaries',
    name: 'AI summaries',
    description: 'A 3-bullet TL;DR for long posts, written by Gemini on the server and cached per post.',
    permissions: ['ai:summarise'],
  },
  router,
};

export default aiSummaries;
