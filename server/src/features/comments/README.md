# comments

Comments under a post: markdown (code blocks work), replies one level deep, `@username` mentions.
Shows up on the post page through the client `postFooter` slot, so the posts feature never imports it.

API (all need a session):
- `GET    /api/comments/post/:postId` the whole thread, oldest first (max 300), flat; the client nests by `parentId`
- `POST   /api/comments/post/:postId` `{ body, parentId? }`
- `DELETE /api/comments/:id` the comment's author, the post's author, or an admin (replies go with it)

Events: emits `comment.created` (with the post author, the parent comment's author and mentioned users, so `notifications` can react). Listens to nothing.

Model: `Comment` (`postId`, `authorId`, `parentId`, `body`). The post is checked through `core/lookup.ts`, never imported.

**How to remove:** delete `server/src/features/comments`, `client/src/features/comments`, and the `comments` line in both `features.config.ts` files.
