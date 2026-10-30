'use client';

import { Suspense, type ComponentType } from 'react';
import { useApp } from '../auth/AppContext';
import type { SlotName, SlotProps } from '../types';

/**
 * A named spot in a page. Every ACTIVE feature that declared a widget for this slot gets to draw it here.
 * Example: the profile page renders <Slot name="profile" .../> and the streaks feature fills it with a heatmap,
 * without the profiles feature ever importing streaks. Feature off = nothing renders.
 */
export function Slot<K extends SlotName>({ name, ...props }: { name: K } & SlotProps[K]) {
  const { features } = useApp();
  return (
    <>
      {features.map((f) => {
        const Widget = f.slots?.[name] as ComponentType<Record<string, unknown>> | undefined;
        if (!Widget) return null;
        return (
          <Suspense key={f.id} fallback={null}>
            <Widget {...(props as Record<string, unknown>)} />
          </Suspense>
        );
      })}
    </>
  );
}