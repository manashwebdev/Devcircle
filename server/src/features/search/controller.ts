import { asyncHandler } from '../../core/asyncHandler';
import { ok } from '../../core/response';
import type { SearchQuery } from './schema';
import { search } from './service';

export const run = asyncHandler(async (req, res) => ok(res, await search(req.query as unknown as SearchQuery)));
