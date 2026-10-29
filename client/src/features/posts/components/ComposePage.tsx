'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiError } from '@/core/api';
import { Field, Markdown, PixelButton, PixelInput, PixelTextarea, Tabs, useToast, cn } from '@/core/ui';
import { createPost } from '../api';
import { TYPE_INFO, type PostRequest, type PostType } from '../types';

const REQUESTS: { id: PostRequest; label: string }[] = [
  { id: 'none', label: 'Just sharing' },
  { id: 'try', label: 'Try it' },
  { id: 'review', label: 'Review it' },
];

/** /compose: structured composer. Type first, then title, markdown body, tags, link, request flag. */
export default function ComposePage() {
  const router = useRouter();
  const toast = useToast();
  const [type, setType] = useState<PostType>('built');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [link, setLink] = useState('');
  const [request, setRequest] = useState<PostRequest>('none');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const post = await createPost({
        type, title, body, request,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        link: link.trim() || undefined,
      });
      toast('Posted', 'success');
      router.push(`/post/${post.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'VALIDATION_ERROR' && err.details && typeof err.details === 'object') {
        setErrors(Object.fromEntries(Object.entries(err.details as Record<string, string[]>).map(([k, v]) => [k, v[0] ?? 'Invalid'])));
      }
      toast(err instanceof Error ? err.message : 'Could not post', 'error');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <h1 className="mb-6 font-display text-4xl">New post</h1>

      <fieldset className="mb-4">
        <legend className="mb-2 text-sm text-accent-strong">What kind of post?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(TYPE_INFO) as PostType[]).map((t) => (
            <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)}
              className={cn('border-2 border-dashed p-3 text-left', type === t ? 'border-accent-strong bg-accent text-on-accent' : 'border-line hover:border-ink')}>
              <span className="block font-display text-xl">{TYPE_INFO[t].label}</span>
              <span className="text-xs opacity-80">{TYPE_INFO[t].hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="Title" htmlFor="title" error={errors.title}>
        <PixelInput id="title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} placeholder="A tiny CLI that diffs two .env files" />
      </Field>

      <div className="mb-4">
        <p className="mb-1 text-sm text-accent-strong">Body (markdown)</p>
        <Tabs
          items={[
            { id: 'write', label: 'Write', content: <PixelTextarea aria-label="Post body" className="min-h-48" value={body} maxLength={10000} onChange={(e) => setBody(e.target.value)} placeholder={'What happened?\n\n- use **bold**, `code` and lists\n- fenced code blocks work too'} /> },
            { id: 'preview', label: 'Preview', content: body.trim() ? <Markdown source={body} /> : <p className="text-sm text-muted">Nothing to preview yet.</p> },
          ]}
        />
        {errors.body && <p className="text-xs text-accent-strong">{errors.body}</p>}
      </div>

      <Field label="Tech tags" htmlFor="tags" hint="Comma separated, up to 8. e.g. rust, cli" error={errors.tags}>
        <PixelInput id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </Field>
      <Field label="Repo or demo link (optional)" htmlFor="link" error={errors.link}>
        <PixelInput id="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://github.com/you/project" />
      </Field>

      <fieldset className="mb-6">
        <legend className="mb-2 text-sm text-accent-strong">Want something back?</legend>
        <div className="flex flex-wrap gap-2">
          {REQUESTS.map((r) => (
            <button key={r.id} type="button" aria-pressed={request === r.id} onClick={() => setRequest(r.id)}
              className={cn('border-2 border-dashed px-3 py-1 text-sm uppercase', request === r.id ? 'border-accent-strong bg-accent text-on-accent' : 'border-line text-muted hover:text-ink')}>
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <PixelButton type="submit" disabled={saving}>{saving ? 'Posting...' : 'Publish'}</PixelButton>
    </form>
  );
}
