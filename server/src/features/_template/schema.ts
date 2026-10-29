import { z } from 'zod';

/** Zod schemas for every input this feature accepts. */
export const echoBody = z.object({ text: z.string().trim().min(1).max(200) });
export type EchoInput = z.infer<typeof echoBody>;
