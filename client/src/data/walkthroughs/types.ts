// Typed content model for HTB machine walkthroughs.
//
// Walkthroughs are stored as DATA (not hand-written JSX) so that shell/SQL/code
// — full of `{ } < > $` and quotes — never has to be escaped into JSX. Code
// blocks are plain string arrays; prose supports a tiny inline-markdown subset
// rendered by <RichText> (see components/walkthrough/RichText.tsx):
//   `code`  •  **bold**  •  *italic*  •  [text](https://url or /internal or #anchor)
//
// Everything renders through <Walkthrough> using the site's own design tokens,
// so the pages are real React and match the offensive-security dossier exactly.

export type Block =
  | { kind: "p"; text: string }
  | { kind: "epigraph"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "h4"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; lang?: string; label?: string; lines: string[]; highlight?: number[] }
  | { kind: "callout"; variant: "note" | "tip" | "warn" | "key"; title: string; text: string }
  | { kind: "table"; columns: string[]; rows: string[][] };

export interface WalkSection {
  id: string; // anchor id, kebab-case
  num: string; // "00", "01", ... shown in the TOC + heading
  title: string;
  blocks: Block[];
}

export interface WalkthroughDoc {
  slug: string; // URL slug: /offensive-security/walkthroughs/<slug>
  name: string; // display name, e.g. "White Rabbit"
  platform: string; // "Hack The Box"
  os: "Linux" | "Windows" | "Other";
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  retired: string; // human date the box retired, e.g. "Dec 2025"
  ip?: string; // e.g. "10.10.11.x"
  tags: string[]; // technique chips
  lede: string; // hero sub-paragraph (inline markdown supported)
  summary: string; // one-liner for the dossier card
  sections: WalkSection[];
}
