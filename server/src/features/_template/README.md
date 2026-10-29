# <feature name>

What it does: one paragraph.

API: list the routes.

Events: which `core/events.ts` events it emits / listens to.

**How to remove:** delete `server/src/features/<id>/`, delete `client/src/features/<id>/`,
delete the `<id>` line in both `features.config.ts` files. Nothing else references it.
