'use client';

import { useState, type KeyboardEvent } from 'react';
import { PixelButton, PixelTextarea, useToast } from '@/core/ui';

/** Textarea + send button. Ctrl/Cmd + Enter sends. Used for new comments and for replies. */
export function Composer({
  initial = '',
  placeholder,
  submitLabel,
  autoFocus,
  onSubmit,
  onCancel,
}: {
  initial?: string;
  placeholder: string;
  submitLabel: string;
  autoFocus?: boolean;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const toast = useToast();
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      await onSubmit(body);
      setText('');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not post', 'error');
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div>
      <PixelTextarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        placeholder={placeholder}
        maxLength={1500}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="min-h-20"
      />
      <div className="mt-2 flex items-center gap-2">
        <PixelButton onClick={() => void send()} disabled={busy || !text.trim()}>
          {busy ? 'Sending…' : submitLabel}
        </PixelButton>
        {onCancel && (
          <PixelButton variant="ghost" onClick={onCancel}>
            Cancel
          </PixelButton>
        )}
        <span className="ml-auto text-xs text-muted">Markdown works · Ctrl+Enter to send</span>
      </div>
    </div>
  );
}
