// Lightweight walkthrough metadata for the dossier cards + routing. This file is
// deliberately free of the heavy `sections` content so the offensive-security page
// never pulls a full write-up into its bundle. The full WalkthroughDoc for each box
// is loaded lazily per-route (see ./loaders).
//
// Keep these headers in sync with each box's WalkthroughDoc header. HTB policy:
// only RETIRED, compliance-verified machines appear here.

import type { Walkthrough } from "@/data/siteContent";

export interface WalkthroughSummary {
  slug: string;
  name: string;
  platform: string;
  os: "Linux" | "Windows" | "Other";
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  retired: string;
  tags: string[];
  summary: string;
}

// Order shown on the dossier: most-recently-retired first.
export const WALKTHROUGH_SUMMARIES: WalkthroughSummary[] = [
  {
    slug: "sorcery",
    name: "Sorcery",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Apr 2026",
    tags: ["Cypher Injection", "Stored XSS", "SSRF", "Kafka RCE", "CA Compromise", "FreeIPA", "Pivoting"],
    summary:
      "An unparameterized Cypher injection unravels a microservice mesh — XSS, SSRF, a hand-built Kafka frame, a cracked CA, and FreeIPA — to root.",
  },
  {
    slug: "cobblestone",
    name: "Cobblestone",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "2026",
    tags: ["boolean-blind SQLi", "MySQL FILE read", "stored XSS", "Twig SSTI", "rbash jail", "Cobbler XML-RPC", "Cheetah RCE"],
    summary:
      "A seven-link web kill-chain: blind SQLi to LOAD_FILE source disclosure, stored-XSS-driven Twig SSTI, a cracked hash, an rbash jail, and a localhost Cobbler XML-RPC bypass into Cheetah RCE as root.",
  },
  {
    slug: "whiterabbit",
    name: "White Rabbit",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Dec 2025",
    tags: ["n8n / SQLi", "HMAC webhook", "restic", "7-Zip", "Docker escape", "PRNG RE"],
    summary:
      "An exposed Uptime Kuma leak and HMAC-signed webhook SQLi lead to restic backup abuse, a Docker escape, and a clock-seeded password generator to root.",
  },
  {
    slug: "zero",
    name: "Zero",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Aug 2025",
    tags: ["SFTP", "mod_userdir", "Arbitrary file read", "Password reuse", "Apache cron", "cmdline spoofing"],
    summary:
      "An Insane Linux box chaining self-service SFTP creds, an .htaccess arbitrary file read, and a root Apache config-check cron into full root.",
  },
  {
    slug: "ghost",
    name: "Ghost",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Insane",
    retired: "Apr 2025",
    tags: ["Active Directory", "LDAP Injection", "Golden SAML", "ADIDNS Poisoning", "gMSA", "MSSQL Linked Server", "Forest Trust"],
    summary:
      "An Insane Windows forest: LDAP wildcard bypass, container foothold, gMSA, Golden SAML, and a cross-realm golden ticket to Enterprise Admin.",
  },
  {
    slug: "mist",
    name: "Mist",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Insane",
    retired: "Oct 2024",
    tags: ["ADCS", "ESC13", "Shadow Credentials", "NTLM Relay", "PKINIT", "gMSA", "Backup Operators"],
    summary:
      "An Insane Windows AD box chaining a Pluck CMS file-read and RCE into ADCS abuse — PKINIT, NTLM relay, shadow creds, double ESC13 — to Domain Admin.",
  },
];

export const WALKTHROUGH_SLUGS: string[] = WALKTHROUGH_SUMMARIES.map((s) => s.slug);

// Card shape consumed by the offensive-security dossier (section 07).
export const WALKTHROUGHS: Walkthrough[] = WALKTHROUGH_SUMMARIES.map((s) => ({
  name: s.name,
  platform: s.platform,
  kind: "Machine",
  os: s.os,
  difficulty: s.difficulty,
  date: s.retired,
  tags: s.tags,
  summary: s.summary,
  url: `/offensive-security/walkthroughs/${s.slug}`,
}));
