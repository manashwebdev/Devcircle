import { manifests } from '@/config/features.generated';
import { isEnabledInClient } from '@/config/features.config';
import type { FeatureManifest, FeatureRoute } from '../types';

/**
 * A feature is active only if the client flag AND the server (GET /api/features) both say yes.
 * Everything else (nav, routes) is derived from the active manifests, so a disabled feature leaves no trace.
 */
export function activeManifests(serverEnabled: ReadonlySet<string>): FeatureManifest[] {
  return manifests.filter((m) => isEnabledInClient(m.id) && serverEnabled.has(m.id));
}

export function navItems(active: FeatureManifest[]) {
  return active
    .flatMap((m) => (m.nav ? (Array.isArray(m.nav) ? m.nav : [m.nav]) : []))
    .sort((a, b) => a.order - b.order);
}

/** Does '/circles/abc' match '/circles/:id'? Returns the params if so. */
function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const a = pathname.split('/').filter(Boolean);
  if (p.length !== a.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    const seg = p[i]!;
    const actual = a[i]!;
    if (seg.startsWith(':')) params[seg.slice(1)] = decodeURIComponent(actual);
    else if (seg !== actual) return null;
  }
  return params;
}

export function resolveRoute(active: FeatureManifest[], pathname: string): { route: FeatureRoute; params: Record<string, string> } | null {
  for (const m of active) {
    for (const route of m.routes) {
      const params = matchPath(route.path, pathname);
      if (params) return { route, params };
    }
  }
  return null;
}
