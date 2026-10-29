import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "wouter";

// Renders a blog post body. react-markdown does not render raw HTML and drops
// unsafe URL schemes (javascript: and the like), so a post can only produce the
// elements mapped below. GFM adds tables, strikethrough, task lists and
// autolinked URLs.

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

/** Heading text → anchor id, so a section can be linked to directly. */
function anchorId(children: ReactNode): string {
  return textOf(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const components: Components = {
  h1: ({ children }) => (
    <h2 id={anchorId(children)} className="mt-14 mb-5 scroll-mt-24 text-3xl font-bold tracking-tight text-white">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 id={anchorId(children)} className="mt-14 mb-5 scroll-mt-24 text-2xl md:text-3xl font-bold tracking-tight text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={anchorId(children)} className="mt-10 mb-4 scroll-mt-24 text-xl font-semibold text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className="mt-8 mb-3 text-lg font-semibold text-slate-100">{children}</h4>,
  p: ({ children }) => <p className="mb-6 text-[1.05rem] leading-[1.8] text-gray-300">{children}</p>,
  a: ({ href = "", children }) => {
    const internal = href.startsWith("/") && !href.startsWith("//");
    const cls =
      "text-red-300 underline decoration-red-500/40 underline-offset-4 transition-colors hover:text-red-200 hover:decoration-red-300";
    // An unsafe URL arrives here emptied; show the text rather than a dead link.
    if (!href) return <>{children}</>;
    if (internal) {
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    }
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
  ul: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-[1.05rem] leading-[1.75] text-gray-300 marker:text-red-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-[1.05rem] leading-[1.75] text-gray-300 marker:text-red-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-2 border-red-500/60 bg-slate-900/40 py-1 pl-5 pr-3 text-gray-200 [&>p]:mb-3 [&>p]:text-gray-200">
      {children}
    </blockquote>
  ),
  // Inline code gets a chip; fenced blocks get a panel, and the <code> inside
  // them drops the chip styling via the [&>code] overrides on <pre>.
  code: ({ children, className }) => (
    <code
      className={`rounded border border-slate-700/80 bg-slate-900/80 px-1.5 py-0.5 font-mono text-[0.88em] text-red-200 ${className ?? ""}`}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-7 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/80 p-4 font-mono text-sm leading-relaxed text-slate-200 [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[0.95em] [&>code]:text-slate-200">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-12 border-0 border-t border-slate-800" />,
  img: ({ src, alt }) => (
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="my-8 w-full rounded-lg border border-slate-800"
    />
  ),
  table: ({ children }) => (
    <div className="mb-7 overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full border-collapse text-left text-sm text-gray-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-900/70 text-slate-200">{children}</thead>,
  th: ({ children }) => <th className="border-b border-slate-800 px-4 py-2.5 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-b border-slate-800/60 px-4 py-2.5 align-top">{children}</td>,
};

export default function MarkdownArticle({ markdown }: { markdown: string }) {
  return (
    <div className="min-w-0">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
