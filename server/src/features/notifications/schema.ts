import { z } from 'zod';

export const notificationIdParam = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'invalid id') });
