// Registry of walkthrough documents. Each retired-box write-up is a typed
// WalkthroughDoc (see ./types). Add a box by importing its doc and listing it
// here — the dossier cards, routes, and deep-link prerender all derive from this.
//
// HTB policy: only RETIRED machines are documented publicly. Do not add a box
// here until its retirement is verified.

import type { Walkthrough } from "@/data/siteContent";
import type { WalkthroughDoc } from "./types";

// Order shown on the dossier (newest / most impressive first is fine).
// Only RETIRED, compliance-verified boxes appear here. Docs are appended as
// each retired box is transcribed into a typed WalkthroughDoc (./<slug>.ts):
//   whiterabbit, sorcery, zero, mist, ghost, cobblestone (all verified retired).
export const WALKTHROUGH_LIST: WalkthroughDoc[] = [];

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
