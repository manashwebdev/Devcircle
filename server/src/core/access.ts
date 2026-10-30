/**
 * A tiny hook so one feature can ask "can this user see this circle?" without importing the circles feature.
 * The circles feature registers the real check when it starts. If circles is off, nobody can see any circle.
 */
type CircleAccessCheck = (userId: string, circleId: string) => Promise<boolean>;

let check: CircleAccessCheck | null = null;

export function registerCircleAccess(fn: CircleAccessCheck) {
  check = fn;
}

export async function canViewCircle(userId: string, circleId: string): Promise<boolean> {
  return check ? check(userId, circleId) : false;
}