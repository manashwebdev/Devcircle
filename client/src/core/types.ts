import type { ComponentType, LazyExoticComponent } from 'react';
import type { IconName } from './ui/PixelIcon';

/** Shared across features, so features never need to import each other. */
export type CharacterId = 'ember' | 'moss' | 'azure' | 'plum' | 'blaze' | 'frost' | 'rose' | 'bruno' | 'coco' | 'jax' | 'luna';

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  character: CharacterId;
  bio: string;
  links: { label: string; url: string }[];
  techStack: string[];
  streak: { current: number; longest: number };
  joinedAt: string;
}

/** The signed-in user, as returned by GET /api/auth/me. */
export type SessionUser = PublicUser & { role: 'user' | 'admin' };

/** Props every routed page component receives. `params` holds values like { username: 'ada' }. */
export interface RouteProps {
  params: Record<string, string>;
}

export interface FeatureRoute {
  /** Path with :params, e.g. '/circles/:id'. */
  path: string;
  /** Use React.lazy so a page's code only loads when visited. */
  component: LazyExoticComponent<ComponentType<RouteProps>>;
  /** 'required' (default) sends signed-out visitors to the landing page. */
  auth?: 'required' | 'public';
}

export interface NavEntry {
  label: string;
  href: string;
  icon: IconName;
  /** Lower comes first in the sidebar / bottom bar. */
  order: number;
  /** Optional tiny component drawn next to the label (e.g. an unread count). It fetches its own data. */
  badge?: ComponentType;
  /** Only shown to users with role 'admin' (the server still enforces access). */
  adminOnly?: boolean;
}

/** What src/features/<id>/index.ts must export (default). The generated registry collects them. */
export interface FeatureManifest {
  id: string;
  name: string;
  /** One entry, or several (e.g. Feed + Compose). */
  nav?: NavEntry | NavEntry[];
    routes: FeatureRoute[];
  /** Small widgets this feature adds to pages that belong to other features (see core/features/Slot.tsx). */
  slots?: { [K in SlotName]?: SlotComponent<SlotProps[K]> };
  
}
/** The named places other features can plug widgets into, and what each place hands the widget. */
/** What the post page hands to widgets in its three slots: postTop (above the text), postActions (button row), postFooter (below the card). */
export interface PostSlotProps {
  postId: string;
  title: string;
  authorUsername: string;
  isMine: boolean;
}
export interface SlotProps {
  profile: { username: string; isMe: boolean };
  circle: { circleId: string; isMember: boolean };
  postTop: PostSlotProps;
  postActions: PostSlotProps;
  postFooter: PostSlotProps;
}
export type SlotName = keyof SlotProps;
export type SlotComponent<P> = ComponentType<P> | LazyExoticComponent<ComponentType<P>>;

/** Small shapes shared by features that list posts or people (search, explore, saved). Same as server core/lookup.ts. */
export interface PostLite {
  id: string;
  type: 'built' | 'broke' | 'learned';
  title: string;
  excerpt: string;
  tags: string[];
  request: 'none' | 'try' | 'review';
  createdAt: string;
  author: { username: string; displayName: string; character: CharacterId } | null;
}
export interface PersonLite {
  username: string;
  displayName: string;
  character: CharacterId;
  bio: string;
  techStack: string[];
}
