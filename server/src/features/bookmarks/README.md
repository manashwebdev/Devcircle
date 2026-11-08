# bookmarks

Save any post to read later; the **Saved** page lists them. Private: nobody else can see what you saved.

API (session required):
- `GET  /api/bookmarks` your saved posts, newest save first (max 100)
- `GET  /api/bookmarks/post/:postId` `{ saved }`
- `POST /api/bookmarks/post/:postId` toggles saved on or off

Events: none. Posts are read through `core/lookup.ts` (never imported).

**How to remove:** delete `server/src/features/bookmarks`, `client/src/features/bookmarks`, and the `bookmarks` line in both `features.config.ts` files.
