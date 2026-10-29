import type { EchoInput } from './schema';

/** Business logic lives here, not in the controller. Talk to your model (model.ts) from here. */
export async function echo(input: EchoInput) {
  return { text: input.text };
}
