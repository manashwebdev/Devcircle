import { z } from 'zod';

export const usernameParam = z.object({
  username: z.string().trim().toLowerCase().min(3).max(24).regex(/^[a-z0-9_-]+$/),
});
export const circleIdParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id') });