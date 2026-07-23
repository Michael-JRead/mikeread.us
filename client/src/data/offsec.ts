// Offensive-security disclosure data. Every row is the owner's real, externally
// verifiable upstream security work.

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
  {
    title: "Dev-mode Host validation missing on sibling routes",
    vendor: "Quarkus",
    cwe: "CWE-346 / CWE-668",
    type: "Missing Origin / Host Validation",
    status: "Merged",
    ref: "PR #55431",
    url: "https://github.com/quarkusio/quarkus/pull/55431",
  },
  {
    title: "Micrometer HTTP method tag — unbounded meter leak",
    vendor: "Quarkus",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption (DoS)",
    status: "Merged",
    ref: "PR #55030",
    url: "https://github.com/quarkusio/quarkus/pull/55030",
  },
];
