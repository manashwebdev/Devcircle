import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import { explore } from './service';

export const get = asyncHandler(async (req, res) => ok(res, await explore(req.auth!.user)));
