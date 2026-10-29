'use client';

import { PixelCard } from '@/core/ui';
import { useEcho } from '../hooks/useEcho';

/** Build the UI from '@/core/ui' only. Never define your own buttons, cards or inputs here. */
export default function TemplatePage() {
  const { result, run } = useEcho();
  return (
    <PixelCard title="Template feature">
      <button onClick={() => void run('hello')} className="underline">
        Call the server
      </button>
      {result && <p className="mt-2 text-sm">Server said: {result}</p>}
    </PixelCard>
  );
}
