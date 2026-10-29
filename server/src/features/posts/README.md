# posts

Developers post what they **built**, **broke** or **learned**. Title, markdown body, tech tags, optional repo/demo link, and a "Try it" / "Review it" request flag. No public like counts.

API (all need a session):
- `GET    /api/posts?type=&tag=&author=&before=&limit=` feed, newest first, cursor pagination (`nextBefore`)
- `POST   /api/posts` create
- `GET    /api/posts/:id` one post (includes full markdown body)
- `DELETE /api/posts/:id` author (or admin) only

Events: emits `post.created`. Listens to nothing.

Model: `Post`, indexed for feed, feed-by-type, feed-by-tag, by-author and by-request queries.
Markdown is stored raw; the client renders it with a React-based renderer that never uses innerHTML and only allows http(s) links.

**How to remove:** delete `server/src/features/posts`, delete `client/src/features/posts`, delete the `posts` line in both `features.config.ts` files. Existing `posts` documents stay in MongoDB, harmless.
