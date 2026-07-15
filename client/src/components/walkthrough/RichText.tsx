import { Fragment, type ReactNode } from "react";

// Renders a restricted inline-markdown subset as React nodes — no HTML injection,
// no JSX escaping of the source. Supported (non-nesting, evaluated left-to-right):
//   `code`   → <code>
//   **bold** → <strong>
//   *italic* → <em>
//   [text](url) → <a>  (external http(s) opens a new tab; /internal & #anchor stay in-page)
//
// Anything not matched renders as a literal text node, so `{ } < >` in prose are safe.

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function renderLink(token: string, key: number): ReactNode {
  const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
  if (!m) return token;
  const [, text, url] = m;
  const external = /^https?:\/\//i.test(url);
  return (
    <a
      key={key}
      href={url}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-red-300 underline decoration-red-500/40 underline-offset-2 hover:text-red-400 hover:decoration-red-400"
    >
      {text}
    </a>
  );
}

export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="font-mono text-[0.86em] text-red-300 bg-slate-800/70 border border-slate-700/70 rounded px-1.5 py-0.5"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={i} className="italic text-slate-300">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (part.startsWith("[")) {
          return <Fragment key={i}>{renderLink(part, i)}</Fragment>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
