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
