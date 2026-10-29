/** Pixel characters a user can pick as their avatar. The client draws them (client/src/core/ui/sprites.ts). */
export const CHARACTER_IDS = ['ember', 'moss', 'azure', 'plum', 'blaze', 'frost', 'rose', 'bruno', 'coco', 'jax', 'luna'] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];
