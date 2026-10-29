import { EmptyState, PixelButton } from '@/core/ui';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-4">
      <EmptyState title="404: nothing here" description="This page does not exist, or its module is switched off." mood="sleeping" action={<PixelButton href="/">Back to start</PixelButton>} />
    </div>
  );
}
