import type { Router } from 'express';
import type { UserDoc } from './models/User';

/** Shape of src/features/<id>/index.ts default export. The registry mounts it. */
export interface FeatureManifest {
  id: string;
  name: string;
  description: string;
  /** Permissions this feature adds (documentation + future role checks). */
  permissions: string[];
}

export interface FeatureModule {
  manifest: FeatureManifest;
  /** Mounted at /api/<id>. */
  router: Router;
  /** Optional: demo data for scripts/seed.ts. Must be safe to run twice. */
  seed?: () => Promise<void>;
  /** Optional: subscribe to events from core/events.ts here. */
  init?: () => void;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Set by requireAuth / optionalAuth. */
      auth?: { user: UserDoc; sessionId: string };
    }
  }
}
