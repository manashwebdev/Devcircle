/**
 * Feature flags (server side).
 *
 * KEEP IN SYNC with client/src/config/features.config.ts.
 * The client also asks GET /api/features, so the server is the final authority:
 * if a flag is off here, the router is never mounted and the model is never loaded.
 *
 * Core features (auth, profiles) are not listed here: they are always on.
 */
export interface FeatureFlag {
  enabled: boolean;
}

/** Always mounted. Folder names under src/features/. */
export const coreFeatures = ['profiles'] as const;

/** Optional modules. Flip `enabled`; a module that is not built yet must stay false. */
export const features: Record<string, FeatureFlag> = {
  posts: { enabled: true },
  circles: { enabled: true },
  streaks: { enabled: true },
  comments: { enabled: true },
  bookmarks: { enabled: true },
  follows: { enabled: true },
  reactions: { enabled: true },
  reviews: { enabled: false },
  digest: { enabled: false },
  'ai-summaries': { enabled: true },
  notifications: { enabled: true },
  search: { enabled: true },
  'google-auth': { enabled: true },
  explore: { enabled: true },
  admin: { enabled: true },
};
