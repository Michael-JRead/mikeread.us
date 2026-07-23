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

// Meta descriptions are plain prose: drop the inline-markdown tokens the walkthrough
// summaries carry (backticks, ** emphasis) and collapse whitespace.
function plain(s) {
  return String(s)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function applyMeta(html, { title, description, url }) {
  const t = esc(title);
  const d = esc(plain(description));
  const u = esc(url);
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${u}" />`
    )
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${d}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${t}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${d}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${u}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${t}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${d}" />`
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

// 404.html is the GitHub Pages SPA fallback — keep the home page's metadata.
fs.copyFileSync(indexPath, notFoundPath);
console.log(
  "Generated dist/public/404.html for GitHub Pages routing fallback."
);

// Build the full route table with per-route metadata.
const routes = [
  {
    route: "offensive-security",
    title: "Offensive Security — HTB Walkthroughs & Research | Michael Read",
    description:
      "Offensive security dossier: Hack The Box machine walkthroughs, live HTB rank and stats, and upstream vulnerability research including merged Quarkus hardening fixes and a confirmed CVE.",
  },
];

for (const s of summaries) {
  routes.push({
    route: `offensive-security/walkthroughs/${s.slug}`,
    title: `${s.name} — HTB ${s.difficulty} ${s.os} Walkthrough | Michael Read`,
    description: s.summary,
  });
}

for (const { route, title, description } of routes) {
  const url = `${ORIGIN}/${route}`;
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  const html = applyMeta(baseHtml, { title, description, url });
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
  ...summaries.map(s => ({
    loc: `${ORIGIN}/offensive-security/walkthroughs/${s.slug}`,
    priority: "0.7",
  })),
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
