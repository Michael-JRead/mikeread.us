// Downloads the official Credly badge art for each certification into
// client/public/assets/certs/ so the site serves them from its own domain.
// URLs were resolved from the issuers' official Credly badge-template pages
// (og:image). Each entry may list fallback URLs tried in order.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT_DIR = resolve("client/public/assets/certs");

const BADGES = {
  // ISACA
  cism: [
    "https://images.credly.com/images/d0891dee-6360-496c-9981-40652523b502/dbdea6794f1a6bbcc18d90eea923421aac7df6b5.png",
  ],
  // ISC2
  cissp: ["https://images.credly.com/images/6eeb0a98-33cb-4f72-bfc3-f89d65a3286c/image.png"],
  ccsp: ["https://images.credly.com/images/38b12225-5b48-44e1-8750-20928cc595ea/image.png"],
  // GIAC
  gdsa: ["https://images.credly.com/images/4a1f018b-712c-44a7-b494-52ecdfe1ed35/image.png"],
  gcih: ["https://images.credly.com/images/c3e2745b-2f30-4e6b-9290-f7557a705181/image.png"],
  gpen: ["https://images.credly.com/images/394a708e-5858-4a2c-89ff-407fc4c34509/image.png"],
  gcpn: ["https://images.credly.com/images/1ad1b824-83e6-497a-ad19-b067c0840644/image.png"],
  gwapt: ["https://images.credly.com/images/f535241f-edd3-4dd2-93fd-2243dbc0826e/image.png"],
  gsec: ["https://images.credly.com/images/8e6bde54-8a33-4ec0-9d70-90fcde581bcf/image.png"],
  // AWS
  "aws-sap": ["https://images.credly.com/images/2d84e428-9078-49b6-a804-13c15383d0de/image.png"],
  "aws-ans": ["https://images.credly.com/images/4d08274f-64c1-495e-986b-3143f51b1371/image.png"],
  "aws-scs": ["https://images.credly.com/images/53acdae5-d69f-4dda-b650-d02ed7a50dd7/image.png"],
  // CompTIA — classic red hexagon art for a consistent set; CASP+ falls back
  // to the post-rebrand SecurityX art if the classic file is ever purged.
  "comptia-casp": [
    "https://images.credly.com/images/7b0fab0d-c9d5-409d-bdc0-1772143cdab1/CompTIA_CASP_2Bce.png",
    "https://images.credly.com/images/5343b652-c9a0-418e-bfaf-7ed5a2ddd0c4/blob",
  ],
  "comptia-cysa": [
    "https://images.credly.com/images/5cb4b153-44d8-410c-97c6-6afba3faa4af/Comptia_CySA_2Bce.png",
    "https://images.credly.com/images/dcd99b5b-da24-40a6-9364-62126d590c37/blob",
  ],
  "comptia-security": [
    "https://images.credly.com/images/74790a75-8451-400a-8536-92d792c5184a/CompTIA_Security_2Bce.png",
    "https://images.credly.com/images/80d8a06a-c384-42bf-ad36-db81bce5adce/blob",
  ],
  "comptia-network": [
    "https://images.credly.com/images/e1fc05b2-959b-45a4-8d20-124b1df121fe/CompTIA_Network_2Bce.png",
    "https://images.credly.com/images/c70ba73e-3c8a-46fa-9d60-4a9af94ad662/blob",
  ],
  "comptia-linux": [
    "https://images.credly.com/images/6edb32c5-37d8-4fd4-98cd-2811932f0185/CompTIA_Linux_2Bce.png",
    "https://images.credly.com/images/c8ba8fa6-ab8b-4df7-879f-4ae7b98b2765/blob",
  ],
};

mkdirSync(OUT_DIR, { recursive: true });

const failures = [];
for (const [slug, urls] of Object.entries(BADGES)) {
  let saved = false;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "image/*",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) throw new Error(`unexpected content-type ${type}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`suspiciously small (${buf.length} bytes)`);
      writeFileSync(resolve(OUT_DIR, `${slug}.png`), buf);
      console.log(`ok ${slug}: ${buf.length} bytes (${url})`);
      saved = true;
      break;
    } catch (err) {
      console.warn(`fail ${slug}: ${err.message} (${url})`);
    }
  }
  if (!saved) failures.push(slug);
}

if (failures.length > 0) {
  console.error(`Failed badges: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`All ${Object.keys(BADGES).length} badges downloaded.`);
