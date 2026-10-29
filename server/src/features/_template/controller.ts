import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { echo } from './service';
import type { EchoInput } from './schema';

export const echoController = asyncHandler(async (req, res) => {
  ok(res, await echo(req.body as EchoInput));
});
