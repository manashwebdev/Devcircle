import type { CharacterId } from '@/core/types';

/** Body of PATCH /api/profiles/me. All fields optional. */
export interface UpdateProfileInput {
  username?: string;
  displayName?: string;
  bio?: string;
  character?: CharacterId;
  techStack?: string[];
  links?: { label: string; url: string }[];
}
