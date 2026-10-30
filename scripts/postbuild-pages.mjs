import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = process.cwd();
const outDir = path.join(root, "dist", "public");
const indexPath = path.join(outDir, "index.html");
const notFoundPath = path.join(outDir, "404.html");

const ORIGIN = "https://www.mikeread.us";

if (!fs.existsSync(indexPath)) {
  console.error(`Expected build artifact not found: ${indexPath}`);
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexPath, "utf8");

// --- Per-route metadata ------------------------------------------------------
// The generated deep-link HTML files are otherwise byte-identical to the home
// page, which means every route shared the home page's <title>, description, and
// canonical — telling crawlers 30 walkthroughs were duplicates of "/". We rewrite
// the head tags per route so each page is independently indexable and shareable.

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function collapse(s) {
  return String(s).replace(/\s+/g, " ").trim();
}

// Meta descriptions are plain prose: drop the inline-markdown tokens the walkthrough
// summaries carry (backticks, ** emphasis) and collapse whitespace.
function plain(s) {
  return collapse(
    String(s)
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
  );
}

// `markdown: false` keeps a description's * and ` characters, for text that the
// site shows literally (blog summaries). Every replacement is a function so a
// "$&" or "$'" in a title is inserted as written, not read as a replace pattern.
function applyMeta(html, { title, description, url, markdown = true }) {
  const t = esc(title);
  const d = esc(markdown ? plain(description) : collapse(description));
  const u = esc(url);
  return html
    .replace(/<title>[^<]*<\/title>/, () => `<title>${t}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      () => `<link rel="canonical" href="${u}" />`
    )
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      () => `<meta name="description" content="${d}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      () => `<meta property="og:title" content="${t}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      () => `<meta property="og:description" content="${d}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      () => `<meta property="og:url" content="${u}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      () => `<meta name="twitter:title" content="${t}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      () => `<meta name="twitter:description" content="${d}" />`
    );
}

// --- Load walkthrough summaries (single source of truth) ---------------------
// Transpile summaries.ts with esbuild and import it so the route list, titles,
// and descriptions all derive from client/src/data/walkthroughs/summaries.ts.
// This removes the previously hand-maintained slug list that could silently drift.
async function loadWalkthroughSummaries() {
  const entry = path.join(root, "client/src/data/walkthroughs/summaries.ts");
  const outfile = path.join(os.tmpdir(), `wt-summaries-${process.pid}.mjs`);
  await build({
    entryPoints: [entry],
    outfile,
    bundle: false, // summaries.ts's only import is `import type`, erased at transpile
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  try {
    const mod = await import(pathToFileURL(outfile).href);
    return mod.WALKTHROUGH_SUMMARIES;
  } finally {
    fs.rmSync(outfile, { force: true });
  }
}

const summaries = await loadWalkthroughSummaries();
if (!Array.isArray(summaries) || summaries.length === 0) {
  console.error(
    "Failed to load walkthrough summaries; refusing to emit routes."
  );
  process.exit(1);
}

// --- Load published blog posts ------------------------------------------------
// Parsed with client/src/lib/blog.ts, the same validator the site uses, so a
// post that renders on the site gets the same title, summary and slug here. A
// malformed post throws and fails the build rather than silently vanishing.
async function loadBlogPosts() {
  const entry = path.join(root, "client/src/lib/blog.ts");
  const outfile = path.join(os.tmpdir(), `blog-lib-${process.pid}.mjs`);
  await build({
    entryPoints: [entry],
    outfile,
    bundle: false, // blog.ts has no runtime imports
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  try {
    const { parsePost, sortPosts } = await import(pathToFileURL(outfile).href);
    const dir = path.join(root, "client/src/content/blog");
    const files = fs.existsSync(dir)
      ? // Match the site's import.meta.glob("./*.md"): drafts/ is a folder and
        // dotfiles (editor lock files) are skipped.
        fs.readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("."))
      : [];
    return sortPosts(
      files.map((f) => parsePost(f.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, f), "utf8")))
    );
  } finally {
    fs.rmSync(outfile, { force: true });
  }
}

const posts = await loadBlogPosts();

// 404.html is the GitHub Pages SPA fallback — keep the home page's metadata.
fs.copyFileSync(indexPath, notFoundPath);
console.log(
  "Generated dist/public/404.html for GitHub Pages routing fallback."
);

// Build the full route table with per-route metadata.
const routes = [
  {
    route: "offensive-security",
    title: "Offensive Security Research — CVEs & Disclosures | Michael Read",
    description:
      "Offensive security research dossier: published CVEs and merged upstream security fixes across Quarkus / Red Hat, Eclipse Vert.x, Netty, Apache ActiveMQ Artemis, Apache Tomcat, Apache HTTP Server, Apache CXF, Apache Pulsar, FreeRDP, OpenBao, Jackson, node-forge, Gitea, Apache Kafka and Keycloak — plus engagement methodology and toolchain.",
  },
  {
    route: "hackthebox",
    title: "Hack The Box — Live Rank, Stats & Walkthroughs | Michael Read",
    description:
      "Live Hack The Box profile — Pro Hacker rank, category coverage, and detailed write-ups for retired machines. Stats sync daily from the live HTB profile.",
  },
];

for (const s of summaries) {
  routes.push({
    route: `hackthebox/walkthroughs/${s.slug}`,
    title: `${s.name} — HTB ${s.difficulty} ${s.os} Walkthrough | Michael Read`,
    description: s.summary,
  });
}

if (posts.length > 0) {
  routes.push({
    route: "blog",
    title: "Blog — Vulnerability Research & Disclosure Notes | Michael Read",
    description:
      "Notes on vulnerability research, coordinated disclosure, and the security work behind Michael Read's published CVEs.",
  });
  for (const post of posts) {
    routes.push({
      route: `blog/${post.slug}`,
      title: `${post.title} | Michael Read`,
      description: post.summary,
      markdown: false,
    });
  }
}

for (const { route, title, description, markdown } of routes) {
  const url = `${ORIGIN}/${route}`;
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  const html = applyMeta(baseHtml, { title, description, url, markdown });
  fs.writeFileSync(path.join(dir, "index.html"), html);
  console.log(
    `Generated dist/public/${route}/index.html (with per-route metadata).`
  );
}

// --- robots.txt + sitemap.xml -----------------------------------------------
const lastmod = new Date().toISOString().slice(0, 10);

const sitemapUrls = [
  { loc: `${ORIGIN}/`, priority: "1.0" },
  { loc: `${ORIGIN}/offensive-security`, priority: "0.9" },
  { loc: `${ORIGIN}/hackthebox`, priority: "0.9" },
  ...summaries.map(s => ({
    loc: `${ORIGIN}/hackthebox/walkthroughs/${s.slug}`,
    priority: "0.7",
  })),
  ...(posts.length > 0 ? [{ loc: `${ORIGIN}/blog`, priority: "0.8" }] : []),
  ...posts.map(p => ({ loc: `${ORIGIN}/blog/${p.slug}`, priority: "0.7" })),
];

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls
    .map(
      ({ loc, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;

fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
console.log(`Generated dist/public/sitemap.xml (${sitemapUrls.length} URLs).`);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
fs.writeFileSync(path.join(outDir, "robots.txt"), robots);
console.log("Generated dist/public/robots.txt.");

// --- rss.xml -------------------------------------------------------------------
// Always written, so the <link rel="alternate"> in index.html never 404s; an
// empty channel is valid RSS.
const xml = (v) =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
const rssItems = posts
  .map((p) => {
    const link = `${ORIGIN}/blog/${p.slug}`;
    return (
      `    <item>\n` +
      `      <title>${xml(p.title)}</title>\n` +
      `      <link>${link}</link>\n` +
      `      <guid isPermaLink="true">${link}</guid>\n` +
      `      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>\n` +
      `      <description>${xml(collapse(p.summary))}</description>\n` +
      p.tags.map((t) => `      <category>${xml(t)}</category>\n`).join("") +
      `    </item>`
    );
  })
  .join("\n");
const rss =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
  `  <channel>\n` +
  `    <title>Michael Read — Blog</title>\n` +
  `    <link>${ORIGIN}/blog</link>\n` +
  `    <description>Notes on vulnerability research, coordinated disclosure, and the security work behind published CVEs.</description>\n` +
  `    <language>en-us</language>\n` +
  `    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />\n` +
  (posts.length > 0 ? `    <lastBuildDate>${new Date(`${posts[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` : "") +
  (rssItems ? rssItems + "\n" : "") +
  `  </channel>\n` +
  `</rss>\n`;
fs.writeFileSync(path.join(outDir, "rss.xml"), rss);
console.log(`Generated dist/public/rss.xml (${posts.length} ${posts.length === 1 ? "post" : "posts"}).`);
