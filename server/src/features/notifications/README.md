# notifications

In-app notifications: someone **commented** on your post, **replied** to you, **@mentioned** you, or **reacted**.
Built only from events (`comment.created`, `reaction.created`), so it never imports comments or reactions.
Delete either of those features and this one still runs. Notifications expire after 60 days (TTL index).

API (session required):
- `GET  /api/notifications` latest 40 + `unread` count
- `GET  /api/notifications/unread-count` `{ unread }` (the nav badge polls this)
- `POST /api/notifications/read-all`
- `POST /api/notifications/:id/read`

**How to remove:** delete `server/src/features/notifications`, `client/src/features/notifications`, and the `notifications` line in both `features.config.ts` files.
