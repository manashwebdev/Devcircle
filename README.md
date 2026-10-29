# DevCircle

A developer-only social platform: **build in public** + **small accountable circles** (5 to 8 people, daily proof of work).
No follower counts, no public likes. Sign in with GitHub.

Two apps in one repo, no workspace tooling:

| Folder    | What                                                | Deploy          |
| --------- | --------------------------------------------------- | --------------- |
| `client/` | Next.js (App Router) + TypeScript + Tailwind. UI only, no secrets, no DB | Vercel |
| `server/` | Express + TypeScript + Mongoose. Auth, business logic, Gemini | Render |
| MongoDB   | Atlas                                               | MongoDB Atlas   |

## Run it locally (two terminals)

Requirements: Node 20+, a MongoDB (local or Atlas), a GitHub OAuth app.

**1. GitHub OAuth app** (github.com > Settings > Developer settings > OAuth Apps > New)
- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:5000/api/auth/github/callback`
- Copy the Client ID and a new Client Secret.

**2. Server (terminal 1)**
```bash
cd server
cp .env.example .env      # fill MONGODB_URI, JWT_SECRET, GITHUB_CLIENT_ID/SECRET
npm install
npm run seed              # optional: demo users (ada, lin, kai, mira, ravi)
npm run dev               # http://localhost:5000
```

**3. Client (terminal 2)**
```bash
cd client
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

Open http://localhost:3000, click **Continue with GitHub**. You land on your profile.
Sample public profile without signing in: http://localhost:3000/u/ada (after `npm run seed`).

## Environment variables

| App    | Variable | Notes |
| ------ | -------- | ----- |
| server | `MONGODB_URI` | required |
| server | `JWT_SECRET` | required, 32+ chars |
| server | `CLIENT_URL`, `SERVER_URL` | CORS is locked to `CLIENT_URL`; `SERVER_URL` builds the OAuth callback |
| server | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | required for sign-in |
| server | `CROSS_SITE_COOKIES`, `COOKIE_DOMAIN` | production cookie mode, see below |
| server | `GOOGLE_*`, `GEMINI_API_KEY` | only needed by the optional modules (not built yet) |
| client | `NEXT_PUBLIC_API_URL` | the server's base URL. Public by design; the client holds no secrets |

## Scripts

| Where  | Command | Does |
| ------ | ------- | ---- |
| client | `npm run dev` / `build` / `start` / `lint` | `dev` and `build` first regenerate the feature registry |
| server | `npm run dev` | `tsx watch` |
| server | `npm run build` / `start` | compile to `dist/`, run it |
| server | `npm run seed` | demo data from every **enabled** feature (refuses production without `--force`) |
| server | `npm run lint` / `test` | ESLint / Vitest |

## Cookies and CORS (local vs production)

- **Local:** `localhost:3000` and `localhost:5000` are the same *site*, so the cookie is `SameSite=Lax`, not Secure.
- **Production, two unrelated domains** (e.g. `*.vercel.app` + `*.onrender.com`): `CROSS_SITE_COOKIES=true` gives `SameSite=None; Secure`.
  Some browsers block third-party cookies, so sign-in can break there.
- **Production, recommended:** put both on one domain (`app.example.dev` + `api.example.dev`), set `CROSS_SITE_COOKIES=false` and `COOKIE_DOMAIN=.example.dev`. Cookie becomes `Lax`, first-party, and reliable.
- CSRF: the server rejects any POST/PATCH/DELETE that lacks the `X-Requested-With: devcircle` header or comes from an origin other than `CLIENT_URL`. The client's single API helper (`client/src/core/api.ts`) adds it.
- Route protection is client-side (the cookie belongs to the server's domain, so Next middleware cannot see it). The server enforces auth on every protected endpoint regardless.

## Deploy

1. **MongoDB Atlas:** create a cluster, a database user, allow Render's IPs (or `0.0.0.0/0` while testing), copy the connection string.
2. **Render (server):** New Web Service, root directory `server`, build `npm install && npm run build`, start `npm start`.
   Set every server env var. `NODE_ENV=production`, `CLIENT_URL=https://<your vercel url>`, `SERVER_URL=https://<your render url>`.
3. **GitHub OAuth:** add a second OAuth app (or edit yours) with callback `https://<render url>/api/auth/github/callback`.
4. **Vercel (client):** import the repo, root directory `client`, env `NEXT_PUBLIC_API_URL=https://<render url>`.

## Look and feel

- Dark is the default (black + red, from the reference video). Light is a cool paper-white variant with pale-red stepped shadows and a softer mascot outline.
- Cards, chips and the character picker have a hover state taken from the reference site: border turns white, title lights up, card lifts one step.
- 11 pixel characters (ember, moss, azure, plum, blaze, frost, rose, bruno, coco, jax, luna). To add one: three color lines in `client/src/core/theme/tokens.css`, an id in `CHARACTERS`/`CharacterId` (client) and `CHARACTER_IDS` (server), optionally a hair style in `sprites.ts`.

## Feature modules

A feature has the **same folder name** in both apps. Features never import each other: the server uses `server/src/core/events.ts`, the client uses shared types in `client/src/core/types.ts`.

Flags live in `server/src/config/features.config.ts` and `client/src/config/features.config.ts` (keep in sync). The client also asks `GET /api/features`, so a feature must be on in both places to appear. A disabled feature has no router mounted, no model loaded, no nav item, and its URLs return 404.

| Module          | Status        | Remove it |
| --------------- | ------------- | --------- |
| auth            | built, core   | not removable |
| profiles        | built, core   | not removable |
| layout          | built, core   | not removable |
| posts           | **built**     | delete `features/posts` in both apps + the `posts` line in both configs |
| circles         | not built yet | same, with `circles` |
| streaks         | not built yet | same, with `streaks` |
| reactions       | not built yet | same, with `reactions` |
| reviews         | not built yet | same, with `reviews` |
| digest          | not built yet | same, with `digest` |
| ai-summaries    | not built yet | same, with `ai-summaries` |
| notifications   | not built yet | same, with `notifications` |
| search          | not built yet | same, with `search` |
| google-auth     | not built yet | same, with `google-auth` |
| explore         | not built yet | same, with `explore` |
| admin           | not built yet | same, with `admin` |

Removing a feature never needs an edit anywhere else: the client registry (`client/src/config/features.generated.ts`) is regenerated by `scripts/gen-registry.mjs` on every `dev`/`build`, and the server loads features by flag with a dynamic `import()`.

## Adding a new feature

1. Copy `server/src/features/_template` to `server/src/features/<name>`; copy `client/src/features/_template` to `client/src/features/<name>`.
2. Change the `id` in both `index.ts` files to `<name>` (it must equal the folder name).
3. Add `'<name>': { enabled: true }` to both `features.config.ts` files.
4. Restart both dev servers. The nav item, routes and `/api/<name>/...` appear.

Server order inside a feature: `routes.ts` > `controller.ts` (thin) > `service.ts` (logic) > `model.ts`, with Zod in `schema.ts`.
Client: build only with components from `@/core/ui`.

## What's built and what's stubbed

**Built (core + posts):** `posts` (Built/Broke/Learned composer with markdown preview, feed with type filter and load-more, post page, delete own post, safe markdown renderer, 5 demo posts in the seed). Core: monorepo scaffold; server env validation, Mongo connection, `{ ok, data, error }` responses, central errors, Zod validation middleware, typed event bus, rate limiters, CORS lock, CSRF guard, httpOnly JWT cookie + `Session` documents (logout really revokes), GitHub OAuth with state check, `User`/`Session` models, feature registry; `profiles` feature (get + edit); seed script; tests (JWT, CSRF guard, username slugging, profile schema).
Client: pixel UI kit (Button, Card, Avatar, Modal, Tabs, Toast, EmptyState, inputs, Logo, 4-mood mascot x 4 characters, pixel icons), dark/light tokens in one file, fonts in one file, API client, auth/feature context, sidebar + mobile bottom bar built from the registry, landing page, 404, profile page, settings (profile / appearance / account).

**Stubbed / not built yet:** every other optional module (circles, streaks, reactions, reviews, digest, ai-summaries, notifications, search, google-auth, explore, admin); `/circles*`, `/explore`, `/notifications`, `/digest` routes; dashboard widgets; Markdown sanitising (arrives with `posts`); Gemini calls.

**Not verified yet:** I had no network in my sandbox, so `npm install`, `next build`, ESLint and Vitest have **not** been run. I only confirmed the TypeScript parses and the sprite/icon grids are well-formed. Expect to fix small type or lint nits on your first run.
