# profiles (core, always on)

Public developer profile: username, pixel character, bio, links, tech stack, streak.

- `GET   /api/profiles/:username` public profile
- `PATCH /api/profiles/me`        edit your own profile (Zod-validated, rate limited)

The data lives on the core `User` model; this feature owns the routes and rules.
The `streak` numbers are written by the optional `streaks` module through the event bus.

**How to remove:** you can't, it's core. Switch off its parts (e.g. links) by editing `schema.ts`.
