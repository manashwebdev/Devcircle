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
  circles: { enabled: false },
  streaks: { enabled: false },
  reactions: { enabled: false },
  reviews: { enabled: false },
  digest: { enabled: false },
  'ai-summaries': { enabled: false },
  notifications: { enabled: false },
  search: { enabled: false },
  'google-auth': { enabled: false },
  explore: { enabled: false },
  admin: { enabled: false },
};

export function isEnabledInClient(id: string): boolean {
  return (coreFeatures as readonly string[]).includes(id) || Boolean(featureFlags[id]?.enabled);
}
