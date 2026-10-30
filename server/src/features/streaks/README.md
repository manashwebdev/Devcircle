# streaks

Personal streak (stored on the User, shown on profiles) and circle streak, each with a calendar heatmap.
This feature imports no other feature. It listens to events:
- checkin.completed    -> personal streak + activity day
- circle.day.completed -> circle streak + circle day
It asks "can this user see this circle?" through core/access.ts.

API (needs a session): GET /api/streaks/users/:username, GET /api/streaks/circles/:id

If you enable it after check-ins already exist, those old check-ins are not counted (it only learns from new events).

How to remove: delete server/src/features/streaks, client/src/features/streaks, and the streaks line in both features.config.ts files.