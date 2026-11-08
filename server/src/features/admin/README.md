# admin

A small moderation panel at `/admin`, visible only to users with `role: 'admin'`.

Make yourself admin (once, from the `server/` folder, after you have signed in once):
`npm run make-admin -- <your-github-username>` (it uses the same username you see on your profile).

API (all need a session AND the admin role, enforced on the server):
- `GET  /api/admin/stats` users, banned, new this week, posts, hidden posts, comments
- `GET  /api/admin/users?q=` search users
- `POST /api/admin/users/:id/ban` `{ banned }` bans or unbans; banning deletes all of that person's sessions. Admins and yourself cannot be banned.
- `GET  /api/admin/posts` latest 50 posts including hidden ones
- `POST /api/admin/posts/:id/hidden` `{ hidden }` hides or restores a post everywhere

Hidden posts stay in MongoDB, so a mistake is reversible.

**How to remove:** delete `server/src/features/admin`, `client/src/features/admin`, and the `admin` line in both `features.config.ts` files.
