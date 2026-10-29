import { EventEmitter } from 'node:events';

/**
 * The event bus: the ONLY way server features talk to each other.
 * e.g. "streaks" listens for 'checkin.completed' that "circles" emits,
 * without either folder importing the other. Delete one and the other still runs.
 *
 * Event payloads are the shared contract, so they live here in core.
 * Add new events to this map when a new feature needs to announce something.
 */
export interface CoreEvents {
  'user.created': { userId: string };
  'profile.updated': { userId: string };
  'post.created': { postId: string; authorId: string };
  'checkin.completed': { userId: string; circleId: string; day: string };
  'review.created': { reviewId: string; postId: string; authorId: string; reviewerId: string };
}

class TypedBus {
  private emitter = new EventEmitter();

  emit<K extends keyof CoreEvents>(event: K, payload: CoreEvents[K]) {
    // A broken listener must never break the request that emitted the event.
    try {
      this.emitter.emit(event, payload);
    } catch (err) {
      console.error(`[events] listener for ${event} threw`, err);
    }
  }

  on<K extends keyof CoreEvents>(event: K, handler: (payload: CoreEvents[K]) => void) {
    this.emitter.on(event, handler);
  }
}

export const events = new TypedBus();
