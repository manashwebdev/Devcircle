'use client';

import { notFound, usePathname, useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useApp } from '@/core/auth/AppContext';
import { resolveRoute } from '@/core/features/registry';
import { Mascot } from '@/core/ui';

/**
 * The single catch-all page. It looks the URL up in the feature registry and renders that feature's component.
 * That is what keeps app/ thin and lets a feature be deleted without touching anything in app/:
 * no matching enabled feature = real 404.
 */
export default function FeaturePage() {
  const pathname = usePathname();
  const router = useRouter();
  const { features, user } = useApp();

  const match = resolveRoute(features, pathname);
  const needsLogin = match ? (match.route.auth ?? 'required') === 'required' && !user : false;

  useEffect(() => {
    if (needsLogin) router.replace('/');
  }, [needsLogin, router]);

  if (!match) return notFound();
  if (needsLogin) return null;

  const Page = match.route.component;
  return (
    <Suspense fallback={<Mascot mood="typing" size={64} label="Loading" />}>
      <Page params={match.params} />
    </Suspense>
  );
}
