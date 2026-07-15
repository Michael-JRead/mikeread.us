// Registry of walkthrough documents. Each retired-box write-up is a typed
// WalkthroughDoc (see ./types). Add a box by importing its doc and listing it
// here — the dossier cards, routes, and deep-link prerender all derive from this.
//
// HTB policy: only RETIRED machines are documented publicly. Do not add a box
// here until its retirement is verified.

import type { Walkthrough } from "@/data/siteContent";
import type { WalkthroughDoc } from "./types";

import { whiterabbit } from "./whiterabbit";
import { sorcery } from "./sorcery";
import { zero } from "./zero";
import { ghost } from "./ghost";
import { mist } from "./mist";

// Order shown on the dossier: most-recently-retired first. Only RETIRED,
// compliance-verified boxes appear here. (Cobblestone is verified retired too
// but its transcription is pending, and Odyssey/Nimbus/PingPong remain active.)
export const WALKTHROUGH_LIST: WalkthroughDoc[] = [
  sorcery, // retired Apr 2026
  whiterabbit, // retired Dec 2025
  zero, // retired Aug 2025
  ghost, // retired Apr 2025
  mist, // retired Oct 2024
];

export const WALKTHROUGH_DOCS: Record<string, WalkthroughDoc> = Object.fromEntries(
  WALKTHROUGH_LIST.map((d) => [d.slug, d])
);

export const WALKTHROUGH_SLUGS: string[] = WALKTHROUGH_LIST.map((d) => d.slug);

// Summary cards consumed by the offensive-security dossier (section 07).
export const WALKTHROUGHS: Walkthrough[] = WALKTHROUGH_LIST.map((d) => ({
  name: d.name,
  platform: d.platform,
  kind: "Machine",
  os: d.os,
  difficulty: d.difficulty,
  date: d.retired,
  tags: d.tags,
  summary: d.summary,
  url: `/offensive-security/walkthroughs/${d.slug}`,
}));
