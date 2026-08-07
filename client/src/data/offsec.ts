// Offensive-security disclosure data. Every row is the owner's real, externally
// verifiable upstream security work.

export type DisclosureStatus =
  | "Merged"
  | "Advisory pending"
  | "CVE published"
  | "Fix in progress"
  | "Vendor hardening";

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
    title:
      "Quarkus 3.38.0: reintroduced CVE-2026-50559 path-normalization authorization bypass",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-863",
    type: "Authorization bypass (path normalization) — regression report",
    status: "Merged",
    ref: "GHSA-qcxp-gm7m-4j5v",
    url: "https://github.com/quarkusio/quarkus/security/advisories/GHSA-qcxp-gm7m-4j5v",
    note: "Reported that the fix for CVE-2026-50559 was reintroduced in Quarkus 3.38.0 GA. Vendor confirmed the regression, updated the advisory metadata to mark 3.38.0 affected, and refixed in Quarkus 3.38.1 (also 3.33.3.1 / 3.27.5.1).",
  },
  {
    title:
      "Apache Kafka: CIDR ACL bypass in Authorizer.authorizeByResourceType() default impl",
    vendor: "Apache Kafka",
    cwe: "CWE-863",
    type: "Authorization bypass (ACL)",
    status: "Fix in progress",
    ref: "PR #22883",
    url: "https://github.com/apache/kafka/pull/22883",
    note: "Reported to Apache Kafka security; maintainers confirmed and pointed to an already-open fix PR. Issue is not yet in a shipped release.",
  },
  {
    title:
      "Quarkus OIDC DPoP: no iat window / no jti replay cache (RFC 9449 conformance)",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-294",
    type: "Auth bypass by capture-replay — vendor treated as hardening (no CVE)",
    status: "Vendor hardening",
    ref: "issue #55916",
    url: "https://github.com/quarkusio/quarkus/issues/55916",
    links: [
      {
        label: "issue #55916",
        url: "https://github.com/quarkusio/quarkus/issues/55916",
      },
      {
        label: "issue #55917",
        url: "https://github.com/quarkusio/quarkus/issues/55917",
      },
    ],
    credited: true,
    note: 'Vendor declined a CVE (nonce checks are SHOULD/optional per RFC 9449) but opened two enhancement issues (#55916 and #55917) crediting me as "Mike Read".',
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
