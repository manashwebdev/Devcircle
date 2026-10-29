'use client';

import { useState } from 'react';
import { echo } from '../api';

export function useEcho() {
  const [result, setResult] = useState<string | null>(null);
  const run = async (text: string) => setResult((await echo(text)).text);
  return { result, run };
}
