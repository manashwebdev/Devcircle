import type { ReactNode } from 'react';

/**
 * Safe markdown renderer. It builds React elements (never innerHTML), and React escapes all text,
 * so a post containing <script> or <img onerror=...> is shown as plain text, never executed.
 * Links are only allowed for http(s) URLs. Supported: # headings, - lists, ``` code blocks,
 * **bold**, *italic*, `code`, [text](url), paragraphs.
 */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function inline(text: string, keyBase: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={key} className="bg-surface-2 px-1 text-accent-strong">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label = '', url = ''] = link;
      // Anything that is not http(s) (javascript:, data:, ...) is shown as plain text.
      if (!/^https?:\/\//i.test(url)) return label;
      return (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-dashed underline-offset-4 hover:text-accent-strong">
          {label}
        </a>
      );
    }
    return part;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    const key = `b${i}`;

    if (line.trim().startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) code.push(lines[i++] ?? '');
      i++; // closing fence
      out.push(<pre key={key} className="my-3 overflow-x-auto border-2 border-dashed border-line bg-surface-2 p-3 text-xs"><code>{code.join('\n')}</code></pre>);
      continue;
    }

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      out.push(<h4 key={key} className={`mb-2 mt-4 font-display ${level === 1 ? 'text-2xl' : 'text-xl'} text-accent-strong`}>{inline(heading[2] ?? '', key)}</h4>);
      i++;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? '')) items.push((lines[i++] ?? '').replace(/^\s*[-*]\s+/, ''));
      out.push(<ul key={key} className="my-3 list-disc space-y-1 pl-5">{items.map((t, n) => <li key={n}>{inline(t, `${key}-${n}`)}</li>)}</ul>);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph: consecutive plain lines.
    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? '').trim() !== '' && !/^(#{1,3}\s|\s*[-*]\s|\s*```)/.test(lines[i] ?? '')) para.push(lines[i++] ?? '');
    out.push(<p key={key} className="my-3 text-sm leading-relaxed">{para.map((t, n) => <span key={n}>{n > 0 && <br />}{inline(t, `${key}-${n}`)}</span>)}</p>);
  }

  return <div>{out}</div>;
}
