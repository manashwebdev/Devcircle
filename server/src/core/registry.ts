import { coreFeatures, features } from '../config/features.config';
import type { FeatureModule } from './types';

/**
 * Which feature ids are on: all core ones + every optional one with enabled: true.
 */
export function enabledFeatureIds(): string[] {
  const optional = Object.entries(features)
    .filter(([, flag]) => flag.enabled)
    .map(([id]) => id);
  return [...coreFeatures, ...optional];
}

/**
 * Load ONLY the enabled features.
 * The dynamic import() is the important part: a disabled feature's files (router, model, ...) are never
 * even loaded, so its Mongoose model does not exist and its routes are not mounted.
 */
export async function loadFeatures(): Promise<FeatureModule[]> {
  const loaded: FeatureModule[] = [];
  for (const id of enabledFeatureIds()) {
    const mod = (await import(`../features/${id}/index`)) as { default: FeatureModule };
    if (mod.default.manifest.id !== id) {
      throw new Error(`Feature folder "${id}" has a manifest with id "${mod.default.manifest.id}"`);
    }
    mod.default.init?.();
    loaded.push(mod.default);
  }
  return loaded;
}
