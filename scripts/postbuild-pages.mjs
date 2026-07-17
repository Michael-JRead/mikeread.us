import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist", "public");
const indexPath = path.join(outDir, "index.html");
const notFoundPath = path.join(outDir, "404.html");

if (!fs.existsSync(indexPath)) {
  console.error(`Expected build artifact not found: ${indexPath}`);
  process.exit(1);
}

fs.copyFileSync(indexPath, notFoundPath);
console.log("Generated dist/public/404.html for GitHub Pages routing fallback.");

// Emit a real index.html for each client-side route so deep links resolve with
// HTTP 200 (and correct SPA boot) instead of relying on the 404 fallback.
const ROUTES = ["offensive-security"];

// Retired-machine walkthrough routes. Source of truth: WALKTHROUGH_SUMMARIES
// in client/src/data/walkthroughs/summaries.ts. Kept in sync manually — grep
// that file for slugs when adding a new box.
const WALKTHROUGH_SLUGS = [
  "orion", "nexus", "odyssey", "sorcery", "cobblestone",
  "whiterabbit", "thefrizz", "zero", "escapetwo", "ghost",
  "certified", "cicada", "magicgardens", "sea", "mist",
  "skyfall", "ouija", "twomillion", "flight", "response",
  "scanned", "timelapse", "cap", "sauna", "forest",
  "bastion", "rope", "active", "nibbles", "legacy", "lame",
];
for (const slug of WALKTHROUGH_SLUGS) {
  ROUTES.push(`offensive-security/walkthroughs/${slug}`);
}

for (const route of ROUTES) {
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(dir, "index.html"));
  console.log(`Generated dist/public/${route}/index.html for deep-link routing.`);
}
