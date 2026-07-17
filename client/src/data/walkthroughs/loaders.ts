import type { WalkthroughDoc } from "./types";

// Dynamic imports so each box's full write-up (its heavy `sections` array) is a
// separate chunk that only downloads when that walkthrough route is opened —
// keeping the main and offensive-security bundles lean.
export const WALKTHROUGH_LOADERS: Record<string, () => Promise<WalkthroughDoc>> = {
  // 2026
  orion: () => import("./orion").then((m) => m.orion),
  nexus: () => import("./nexus").then((m) => m.nexus),
  odyssey: () => import("./odyssey").then((m) => m.odyssey),
  sorcery: () => import("./sorcery").then((m) => m.sorcery),
  // 2025
  whiterabbit: () => import("./whiterabbit").then((m) => m.whiterabbit),
  thefrizz: () => import("./thefrizz").then((m) => m.thefrizz),
  zero: () => import("./zero").then((m) => m.zero),
  escapetwo: () => import("./escapetwo").then((m) => m.escapetwo),
  ghost: () => import("./ghost").then((m) => m.ghost),
  certified: () => import("./certified").then((m) => m.certified),
  cicada: () => import("./cicada").then((m) => m.cicada),
  magicgardens: () => import("./magicgardens").then((m) => m.magicgardens),
  // 2024
  sea: () => import("./sea").then((m) => m.sea),
  mist: () => import("./mist").then((m) => m.mist),
  skyfall: () => import("./skyfall").then((m) => m.skyfall),
  ouija: () => import("./ouija").then((m) => m.ouija),
  // 2023
  twomillion: () => import("./twomillion").then((m) => m.twomillion),
  flight: () => import("./flight").then((m) => m.flight),
  response: () => import("./response").then((m) => m.response),
  // 2022
  scanned: () => import("./scanned").then((m) => m.scanned),
  timelapse: () => import("./timelapse").then((m) => m.timelapse),
  // 2021
  cap: () => import("./cap").then((m) => m.cap),
  // 2020
  sauna: () => import("./sauna").then((m) => m.sauna),
  forest: () => import("./forest").then((m) => m.forest),
  // 2019
  bastion: () => import("./bastion").then((m) => m.bastion),
  rope: () => import("./rope").then((m) => m.rope),
  // 2018
  active: () => import("./active").then((m) => m.active),
  nibbles: () => import("./nibbles").then((m) => m.nibbles),
  // 2017
  legacy: () => import("./legacy").then((m) => m.legacy),
  lame: () => import("./lame").then((m) => m.lame),
};
