# ai-summaries

A **TL;DR (AI)** button on the post page gives 3 short bullets. Gemini is called from the server only
(`GEMINI_API_KEY`, optional `GEMINI_MODEL`, default `gemini-2.5-flash`); the key never reaches the browser.
Results are cached per post and refreshed automatically when the post text changes. Without a key the feature
answers `503 AI_DISABLED` and the client hides the button. The post text is sent as untrusted data and the reply is
reduced to plain-text bullets, so a prompt-injection attempt in a post cannot inject markup.

API (session required):
- `GET  /api/ai-summaries/status` `{ enabled }`
- `POST /api/ai-summaries/post/:postId` `{ bullets, cached }` (10 requests per minute)

**How to remove:** delete `server/src/features/ai-summaries`, `client/src/features/ai-summaries`, and the `ai-summaries` line in both `features.config.ts` files.
