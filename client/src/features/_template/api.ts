import { api } from '@/core/api';
import type { EchoResult } from './types';

/** Calls to the server's /api/<feature-id>/... endpoints. */
export const echo = (text: string) => api<EchoResult>('/_template/echo', { method: 'POST', body: { text } });
