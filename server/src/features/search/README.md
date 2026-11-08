# search

One box for posts and developers. `rust` searches post titles, text previews and tags plus names and tech stacks;
`#rust` searches tags / tech stacks only. User input is regex-escaped. Posts are read through `core/lookup.ts`.

API (session required): `GET /api/search?q=&scope=all|posts|people` returns `{ posts, people }` (max 15 / 10).

Scaling note: this uses indexed-prefix-free regex matching, which is fine for thousands of posts. If DevCircle grows a lot, swap `service.ts` for MongoDB Atlas Search; the route and client do not change.

**How to remove:** delete `server/src/features/search`, `client/src/features/search`, and the `search` line in both `features.config.ts` files.
