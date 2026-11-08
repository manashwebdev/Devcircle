# explore

One page to find things to do: **trending tags** (last 14 days), posts that want a **review**, posts that want you to **try** them,
and **developers who share your stack** (newest members if you have not set a stack yet).

API (session required): `GET /api/explore` returns `{ trendingTags, needsReview, tryIt, people }`.
Reads posts through `core/lookup.ts` (never imported); with posts off the boards are simply empty.

**How to remove:** delete `server/src/features/explore`, `client/src/features/explore`, and the `explore` line in both `features.config.ts` files.
