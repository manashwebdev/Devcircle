/**
 * Feature flags (client side).
 *
 * KEEP IN SYNC with server/src/config/features.config.ts.
 * A feature shows up only if BOTH this file and the server (GET /api/features) say it is on.
 */
export interface FeatureFlag {
  enabled: boolean;
}

/** Always on. Folder names under src/features/. */
export const coreFeatures = ['profiles'] as const;

export const featureFlags: Record<string, FeatureFlag> = {
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

export function isEnabledInClient(id: string): boolean {
  return (coreFeatures as readonly string[]).includes(id) || Boolean(featureFlags[id]?.enabled);
}
