# follows

Follow developers; the **Following** page shows their newest posts and who you follow.
DevCircle rule kept: **no follower counts**. You only ever learn whether *you* follow someone.
A Follow button appears on profile pages through the client `profile` slot.

API (session required):
- `GET  /api/follows/user/:username` `{ following }`
- `POST /api/follows/user/:username` toggle follow / unfollow (not yourself)
- `GET  /api/follows/people` the developers you follow
- `GET  /api/follows/feed?before=&limit=` posts from them, newest first (`nextBefore` cursor)

Events: emits `user.followed` (`notifications` turns it into an alert). Posts are read through `core/lookup.ts`.

**How to remove:** delete `server/src/features/follows`, `client/src/features/follows`, and the `follows` line in both `features.config.ts` files.
