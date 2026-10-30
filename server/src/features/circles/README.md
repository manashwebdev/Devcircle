# circles

Groups of 5 to 8 developers joined by invite link. "forming" below 5 members, "active" at 5+.
Private by default (members only). The owner can make a circle public: any signed-in developer can then view it read-only, but never sees the invite code.

API (all need a session):
- GET    /api/circles                      my circles
- GET    /api/circles/public               public circles
- POST   /api/circles                      create
- GET    /api/circles/invite/:code         preview before joining
- POST   /api/circles/join/:code           join
- GET    /api/circles/:id                  members, or anyone if public
- PATCH  /api/circles/:id                  owner: set visibility
- POST   /api/circles/:id/leave            leave (ownership passes on; last one out deletes it)
- DELETE /api/circles/:id/members/:userId  owner removes a member (they cannot rejoin)

How to remove: delete server/src/features/circles, client/src/features/circles, and the circles line in both features.config.ts files.