// Blog post parsing, shared by the site (client/src/content/blog) and the
// prerender script (scripts/postbuild-pages.mjs). It must stay free of runtime
// imports: the prerender step transpiles this file on its own, without bundling.

export interface BlogPost {
  /** URL segment, taken from the file name: my-first-post.md → my-first-post. */
  slug: string;
  title: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  /** One or two sentences. Used on the index, in meta descriptions and in RSS. */
  summary: string;
  tags: string[];
  /** Markdown body, everything after the front matter. */
  body: string;
  readingMinutes: number;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function unquote(v: string): string {
  const t = v.trim();
  if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
    return t.slice(1, -1);
  }
  return t;
}

/**
 * Split a post into its front matter and body. The front matter is a small,
 * strict subset of YAML — `key: value` lines, with `[a, b]` for lists — which
 * is all a post needs and keeps the site free of a YAML dependency.
 */
export function splitFrontMatter(raw: string, file: string): { data: Record<string, string | string[]>; body: string } {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) {
    throw new Error(`${file}: a post must start with a front matter block opened by "---"`);
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    throw new Error(`${file}: front matter is not closed by a "---" line`);
  }
  const data: Record<string, string | string[]> = {};
  const lines = text.slice(4, end).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) throw new Error(`${file}: front matter line ${i + 1} is not "key: value": ${line}`);
    const [, key, value] = m;
    const v = value.trim();
    data[key] = v.startsWith("[") && v.endsWith("]")
      ? v.slice(1, -1).split(",").map(unquote).filter(Boolean)
      : unquote(v);
  }
  const body = text.slice(end + 4).replace(/^[^\n]*\n/, "");
  return { data, body };
}

/** Words per minute for the reading-time estimate. */
const WPM = 225;

export function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ") // code blocks are skimmed, not read
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WPM));
}

/** Parse and validate one post. Throws with the file name on any problem. */
export function parsePost(slug: string, raw: string): BlogPost {
  const file = `client/src/content/blog/${slug}.md`;
  if (!SLUG.test(slug)) {
    throw new Error(`${file}: file names must be lowercase words joined by hyphens (e.g. my-first-post.md)`);
  }
  const { data, body } = splitFrontMatter(raw, file);
  const str = (key: string): string => {
    const v = data[key];
    if (typeof v !== "string" || !v) throw new Error(`${file}: front matter needs a "${key}"`);
    return v;
  };
  const date = str("date");
  if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new Error(`${file}: "date" must be a real date written YYYY-MM-DD, got "${date}"`);
  }
  const tags = data.tags === undefined ? [] : Array.isArray(data.tags) ? data.tags : [data.tags];
  if (!body.trim()) throw new Error(`${file}: the post has no body`);
  return {
    slug,
    title: str("title"),
    date,
    summary: str("summary"),
    tags,
    body,
    readingMinutes: readingMinutes(body),
  };
}

/** Newest first; posts sharing a date fall back to title order. */
export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/** "2026-10-29" → "October 29, 2026", independent of the viewer's time zone. */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
