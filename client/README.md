# DevCircle client

Next.js (App Router) + TypeScript + Tailwind. UI only: no database, no secrets. It talks to `server/` through one helper, `src/core/api.ts`.

```bash
cp .env.example .env.local
npm install
npm run dev      # http://localhost:3000  (needs the server on :5000)
npm run build && npm start
npm run lint
```

## Layout

- `src/core/`: always on. `ui/` (pixel kit), `theme/` (tokens + fonts), `layout/`, `auth/` (AppContext), `features/registry.ts`, `api.ts`, `types.ts`.
- `src/features/<name>/`: `index.ts` (manifest: id, nav, routes), `components/`, `hooks/`, `api.ts`, `types.ts`.
- `src/app/`: thin. `page.tsx` is the landing page; `(app)/[...slug]/page.tsx` resolves every other URL through the feature registry.
- `src/config/features.config.ts`: flags (keep in sync with the server). `features.generated.ts` is auto-generated.

## Restyle in one place

- Colors: `src/core/theme/tokens.css` (dark + light, accent, mascot palettes)
- Fonts: `src/core/theme/fonts.ts` (display = Pixelify Sans, body = Courier Prime, chosen to match the reference video)
