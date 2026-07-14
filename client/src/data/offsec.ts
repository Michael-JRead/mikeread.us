// Offensive-security dossier data. Everything here is evidence-backed:
// - ATT&CK techniques are only listed where a real credential (GIAC), a
//   published/merged security contribution, or hands-on HTB category work
//   demonstrably backs them. Framed as "exercised", never as client work.
// - Disclosures are the owner's real, verifiable upstream security work.

import { SITE_META } from "./siteContent";

const HTB = SITE_META.social.hackthebox;
const CERTS = "/#certifications";
const SECRETHOUND = "https://github.com/Michael-JRead/Secrethound";

export interface TechEvidence {
  type: "htb" | "giac" | "cve" | "tool";
  label: string;
  url?: string;
}

export interface Technique {
  id: string; // MITRE ATT&CK technique ID
  name: string;
  tactic: string; // must match a TACTICS entry
  evidence: TechEvidence[];
}

// Enterprise tactics used as matrix columns (subset relevant to the work shown).
export const TACTICS: string[] = [
  "Reconnaissance",
  "Initial Access",
  "Execution",
  "Credential Access",
  "Discovery",
  "Privilege Escalation",
  "Lateral Movement",
  "Impact",
];

export const TECHNIQUES: Technique[] = [
  { id: "T1595", name: "Active Scanning", tactic: "Reconnaissance", evidence: [{ type: "giac", label: "GPEN", url: CERTS }, { type: "htb", label: "HTB", url: HTB }] },
  { id: "T1190", name: "Exploit Public-Facing Application", tactic: "Initial Access", evidence: [{ type: "giac", label: "GWAPT", url: CERTS }, { type: "cve", label: "Quarkus CVE", url: "https://github.com/quarkusio/quarkus/pull/55361" }, { type: "htb", label: "HTB Web", url: HTB }] },
  { id: "T1078", name: "Valid Accounts", tactic: "Initial Access", evidence: [{ type: "giac", label: "GCPN", url: CERTS }, { type: "htb", label: "HTB", url: HTB }] },
  { id: "T1059", name: "Command & Scripting Interpreter", tactic: "Execution", evidence: [{ type: "htb", label: "HTB", url: HTB }] },
  { id: "T1203", name: "Exploitation for Client Execution", tactic: "Execution", evidence: [{ type: "giac", label: "GWAPT", url: CERTS }] },
  { id: "T1110", name: "Brute Force", tactic: "Credential Access", evidence: [{ type: "giac", label: "GPEN", url: CERTS }, { type: "tool", label: "hashcat / john", url: HTB }] },
  { id: "T1003", name: "OS Credential Dumping", tactic: "Credential Access", evidence: [{ type: "giac", label: "GPEN", url: CERTS }, { type: "htb", label: "HTB AD", url: HTB }] },
  { id: "T1552", name: "Unsecured Credentials", tactic: "Credential Access", evidence: [{ type: "tool", label: "SecretHound", url: SECRETHOUND }, { type: "giac", label: "GCPN", url: CERTS }] },
  { id: "T1046", name: "Network Service Discovery", tactic: "Discovery", evidence: [{ type: "giac", label: "GPEN", url: CERTS }, { type: "htb", label: "HTB", url: HTB }] },
  { id: "T1526", name: "Cloud Service Discovery", tactic: "Discovery", evidence: [{ type: "giac", label: "GCPN", url: CERTS }] },
  { id: "T1068", name: "Exploitation for Privilege Escalation", tactic: "Privilege Escalation", evidence: [{ type: "htb", label: "HTB", url: HTB }, { type: "giac", label: "GPEN", url: CERTS }] },
  { id: "T1548", name: "Abuse Elevation Control Mechanism", tactic: "Privilege Escalation", evidence: [{ type: "htb", label: "HTB", url: HTB }] },
  { id: "T1021", name: "Remote Services", tactic: "Lateral Movement", evidence: [{ type: "giac", label: "GPEN", url: CERTS }, { type: "htb", label: "HTB AD", url: HTB }] },
  { id: "T1550", name: "Use Alternate Authentication Material", tactic: "Lateral Movement", evidence: [{ type: "giac", label: "GPEN", url: CERTS }] },
  { id: "T1499", name: "Endpoint Denial of Service", tactic: "Impact", evidence: [{ type: "cve", label: "Quarkus CVE (pending)", url: "https://github.com/quarkusio/quarkus" }] },
];

export type DisclosureStatus = "Merged" | "Advisory pending";

export interface Disclosure {
  title: string;
  vendor: string;
  cwe?: string;
  type: string; // vulnerability class in plain language
  status: DisclosureStatus;
  ref?: string; // PR number label
  url?: string;
  credited?: boolean;
  note?: string;
}

// All rows are the owner's real, externally verifiable upstream security work.
// The CVE row is intentionally minimal — details are withheld pending the
// coordinated-disclosure window agreed with the Quarkus/Red Hat security team.
export const DISCLOSURES: Disclosure[] = [
  {
    title: "Unauthenticated denial-of-service vulnerability",
    vendor: "Quarkus / Red Hat",
    type: "Unauthenticated DoS",
    status: "Advisory pending",
    credited: true,
    note: "Discovered and responsibly disclosed; confirmed and fixed by the Quarkus security team, which credited me as the reporter in the pending advisory. Details withheld pending the coordinated-disclosure window.",
  },
  {
    title: "Remote dev mode: path traversal + unsafe deserialization",
    vendor: "Quarkus",
    cwe: "CWE-22 / CWE-502",
    type: "Path Traversal + Insecure Deserialization",
    status: "Merged",
    ref: "PR #55380",
    url: "https://github.com/quarkusio/quarkus/pull/55380",
  },
  {
    title: "Pulsar extension silently skipped TLS hostname verification",
    vendor: "Quarkus",
    cwe: "CWE-297",
    type: "Improper Certificate Validation (MITM)",
    status: "Merged",
    ref: "PR #55308",
    url: "https://github.com/quarkusio/quarkus/pull/55308",
  },
  {
    title: "SmallRye GraphQL unauthenticated memory-exhaustion DoS",
    vendor: "Quarkus",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption",
    status: "Merged",
    ref: "PR #55361",
    url: "https://github.com/quarkusio/quarkus/pull/55361",
  },
  {
    title: "Dev MCP endpoints missing localhost / CORS / Host checks",
    vendor: "Quarkus",
    cwe: "CWE-346",
    type: "Origin Validation / Dev-endpoint Exposure",
    status: "Merged",
    ref: "PR #55353",
    url: "https://github.com/quarkusio/quarkus/pull/55353",
    credited: true,
  },
];
