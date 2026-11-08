# reactions

Four developer reactions on a post: **Helpful**, **Ship it**, **Learned something**, **Same here**.
No public like counts (that is the DevCircle rule): you see your own reactions, the post's author also sees the totals.
Rendered on the post page through the client `postActions` slot.

API (session required):
- `GET  /api/reactions/post/:postId` `{ kinds, mine, isAuthor, counts }` (`counts` is `null` unless you are the author)
- `POST /api/reactions/post/:postId` `{ kind }` toggles that reaction on or off, returns the same shape

Events: emits `reaction.created` (never for reacting to your own post). Listens to nothing.

**How to remove:** delete `server/src/features/reactions`, `client/src/features/reactions`, and the `reactions` line in both `features.config.ts` files.
