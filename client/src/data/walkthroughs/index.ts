// Public surface for walkthroughs. Split for code-splitting:
//   - ./summaries — lightweight card/routing metadata (loaded eagerly, tiny)
//   - ./loaders   — dynamic import() per box, so each write-up's heavy `sections`
//                   content is a separate chunk fetched only when its route opens
//   - ./<slug>.ts — the full typed WalkthroughDoc for each box
//
// HTB policy: only RETIRED, compliance-verified machines are listed in ./summaries.

export type { Block, WalkSection, WalkthroughDoc } from "./types";
export {
  WALKTHROUGHS,
  WALKTHROUGH_SLUGS,
  WALKTHROUGH_SUMMARIES,
  type WalkthroughSummary,
} from "./summaries";
export { WALKTHROUGH_LOADERS } from "./loaders";
