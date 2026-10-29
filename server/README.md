# DevCircle server

Express + TypeScript + Mongoose. All business logic, auth and (later) Gemini calls.

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5000
npm run seed     # demo data from enabled features
npm test
npm run build && npm start
```

## Layout

- `src/core/`: always on. `env`, `db`, `errors`, `response` ({ ok, data, error }), `validate` (Zod), `events` (the only way features talk), `rateLimit`, `csrf`, `cookies`, `jwt`, `authMiddleware`, `registry`, `models/{User,Session}`, `auth/` (GitHub OAuth, /me, logout).
- `src/features/<name>/`: `index.ts` (manifest + router), `routes.ts` > `controller.ts` > `service.ts` > `model.ts`, `schema.ts` (Zod), `README.md`.
- `src/config/features.config.ts`: flags. `app.ts` mounts only enabled features under `/api/<id>`.

## API now

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET | `/api/health`, `/api/features` | none |
| GET | `/api/auth/github`, `/api/auth/github/callback` | none (OAuth) |
| GET | `/api/auth/me` | session |
| POST | `/api/auth/logout` | session |
| GET | `/api/profiles/:username` | none |
| PATCH | `/api/profiles/me` | session |
| GET, POST | `/api/posts` | session |
| GET, DELETE | `/api/posts/:id` | session |
