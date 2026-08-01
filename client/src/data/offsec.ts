// Offensive-security disclosure data. Every row is the owner's real, externally
// verifiable upstream security work.

export type DisclosureStatus = "Merged" | "Advisory pending" | "CVE published";

export interface Disclosure {
  title: string;
  vendor: string;
  cwe?: string;
  type: string; // vulnerability class in plain language
  status: DisclosureStatus;
  severity?: string; // e.g. "Important · CVSS 7.5"
  ref?: string; // short label for the single-link case (PR number, CVE id)
  url?: string;
  /** Multiple labeled public records (CVE, NVD, vendor advisory, errata). */
  links?: { label: string; url: string }[];
  credited?: boolean;
  note?: string;
}

// All rows are the owner's real, externally verifiable upstream security work.
export const DISCLOSURES: Disclosure[] = [
  {
    title: "Quarkus REST multipart part-header memory-exhaustion DoS",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption (unauthenticated DoS)",
    status: "CVE published",
    severity: "Important · CVSS 7.5",
    ref: "CVE-2026-16308",
    links: [
      {
        label: "CVE-2026-16308",
        url: "https://www.cve.org/CVERecord?id=CVE-2026-16308",
      },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-16308" },
      {
        label: "Red Hat",
        url: "https://access.redhat.com/security/cve/CVE-2026-16308",
      },
      {
        label: "RHSA-2026:47189",
        url: "https://access.redhat.com/errata/RHSA-2026:47189",
      },
      {
        label: "IBM",
        url: "https://www.ibm.com/support/pages/security-bulletin-ibm-enterprise-build-quarkus-affected-dos-vulnerability",
      },
    ],
    note: "Discovered and responsibly disclosed to the Quarkus / Red Hat security team. An unauthenticated multipart/form-data request with an oversized part-header section exhausts the JVM heap in RESTEasy Reactive's MultipartParser (OutOfMemoryError). Rated Important; fixed in Red Hat build of Quarkus 3.27.4.SP3, with downstream advisories from vendors including IBM.",
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
