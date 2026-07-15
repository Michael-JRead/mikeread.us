import type { WalkthroughDoc } from "./types";

// Dynamic imports so each box's full write-up (its heavy `sections` array) is a
// separate chunk that only downloads when that walkthrough route is opened —
// keeping the main and offensive-security bundles lean.
export const WALKTHROUGH_LOADERS: Record<string, () => Promise<WalkthroughDoc>> = {
  whiterabbit: () => import("./whiterabbit").then((m) => m.whiterabbit),
  sorcery: () => import("./sorcery").then((m) => m.sorcery),
  zero: () => import("./zero").then((m) => m.zero),
  mist: () => import("./mist").then((m) => m.mist),
  ghost: () => import("./ghost").then((m) => m.ghost),
  cobblestone: () => import("./cobblestone").then((m) => m.cobblestone),
};
