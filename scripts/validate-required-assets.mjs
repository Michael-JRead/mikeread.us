import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredAssets = [
  path.join(root, "client", "public", "assets", "profile-photo.png"),
];

const missing = requiredAssets.filter((assetPath) => !fs.existsSync(assetPath));

if (missing.length > 0) {
  console.error("Missing required portfolio assets:");
  for (const assetPath of missing) {
    console.error(`- ${assetPath}`);
  }
  process.exit(1);
}

console.log("Required assets verified.");
