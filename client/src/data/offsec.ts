// Offensive-security disclosure data. Every row is the owner's real, externally
// verifiable upstream security work.

export type DisclosureStatus =
  | "Merged"
  | "Advisory pending"
  | "CVE published"
  | "Confirmed — CVE pending"
  | "Fix in progress"
  | "Accepted (hardening)";

export interface Disclosure {
  title: string;
  /** Short display title for compact renders (finding rows, pending cards). */
  short?: string;
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
  /** One-line description used by compact renders (the CVE hero). */
  tagline?: string;
  /**
   * Longer scannable bullets. Kept as the canonical record for each finding;
   * the page intentionally renders links instead of prose — readers click through.
   */
  summary?: string[];
}

/**
 * A vendor/product the owner has contributed security research to.
 * `match` joins against Disclosure.vendor; `key` joins against the logo map
 * in @/components/VendorLogos.
 */
export interface VendorInfo {
  key: string;
  /** Exact Disclosure.vendor string this card aggregates. */
  match: string;
  name: string;
  org: string;
  blurb: string;
  /** Brand tint for the logo mark (hex). */
  brand: string;
}

// Card order on the page — largest body of work first.
export const VENDORS: VendorInfo[] = [
  {
    key: "quarkus",
    match: "Quarkus / Red Hat",
    name: "Quarkus",
    org: "Red Hat",
    blurb: "Red Hat's Kubernetes-native Java framework — the supersonic, subatomic runtime.",
    brand: "#4695EB",
  },
  {
    key: "kafka",
    match: "Apache Kafka",
    name: "Apache Kafka",
    org: "Apache Software Foundation",
    blurb: "The distributed event-streaming platform powering most of the world's data pipelines.",
    brand: "#e2e8f0",
  },
  {
    key: "artemis",
    match: "Apache ActiveMQ Artemis",
    name: "ActiveMQ Artemis",
    org: "Apache Software Foundation",
    blurb: "Apache's high-performance, multi-protocol message broker.",
    brand: "#D22128",
  },
  {
    key: "spring",
    match: "Spring",
    name: "Spring Boot",
    org: "Spring team / Broadcom",
    blurb: "The most widely deployed Java application framework in the world.",
    brand: "#6DB33F",
  },
  {
    key: "keycloak",
    match: "Keycloak",
    name: "Keycloak",
    org: "CNCF / Red Hat",
    blurb: "The open-source identity and access management platform behind Red Hat SSO.",
    brand: "#4D4D4D",
  },
];

// All rows are the owner's real, externally verifiable upstream security work.
export const DISCLOSURES: Disclosure[] = [
  {
    title: "Quarkus Qute: server-side template injection in ReflectionValueResolver → RCE",
    short: "Qute SSTI via ReflectionValueResolver reflection chain → RCE",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-1336",
    type: "Server-Side Template Injection (SSTI) → remote code execution",
    status: "CVE published",
    severity: "High · CVSS 8.8",
    ref: "CVE-2026-12894",
    credited: true,
    tagline:
      "Qute's ReflectionValueResolver filters which methods a template may call, but the filter is escaped through a reflection chain — Enum.getDeclaringClass() hands back a Class, then getClassLoader() reaches further — turning a template expression into arbitrary code execution in the Java process. Fixed in Quarkus 3.39.2 and up; credited.",
    links: [
      { label: "CVE-2026-12894", url: "https://www.cve.org/CVERecord?id=CVE-2026-12894" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-12894" },
      { label: "GHSA-prf4-p7fp-fr79", url: "https://github.com/quarkusio/quarkus/security/advisories/GHSA-prf4-p7fp-fr79" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "Qute's ReflectionValueResolver enforces a filter over which methods a template may invoke; the filter is escaped via a reflection chain — Enum.getDeclaringClass() returns a Class, then getClassLoader() and friends reach further — enabling arbitrary remote code execution in the Java process (CVSS 8.8)",
      "Fixed in Quarkus 4.0.0 / 3.40.0 / 3.39.2 / 3.33.4 / 3.27.6; GitHub Security Advisory GHSA-prf4-p7fp-fr79 credits me (Michael-JRead)",
    ],
  },
  {
    title: "Quarkus REST multipart part-header memory-exhaustion DoS",
    short: "REST multipart part-header memory-exhaustion DoS",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption (unauthenticated DoS)",
    status: "CVE published",
    severity: "Important · CVSS 7.5",
    ref: "CVE-2026-16308",
    credited: true,
    tagline:
      "Unauthenticated multipart/form-data request exhausts the JVM heap in RESTEasy Reactive — fixed in Red Hat build of Quarkus 3.27.4.SP3, with downstream advisories from IBM and others.",
    links: [
      { label: "CVE-2026-16308", url: "https://www.cve.org/CVERecord?id=CVE-2026-16308" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-16308" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-16308" },
      { label: "RHSA-2026:47189", url: "https://access.redhat.com/errata/RHSA-2026:47189" },
      { label: "IBM", url: "https://www.ibm.com/support/pages/security-bulletin-ibm-enterprise-build-quarkus-affected-dos-vulnerability" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "Unauthenticated multipart/form-data request with an oversized part-header section exhausts the JVM heap in RESTEasy Reactive's MultipartParser (OutOfMemoryError)",
      "Fixed in Red Hat build of Quarkus 3.27.4.SP3; downstream advisories issued by IBM and others, with IBM's advisory crediting me by name",
    ],
  },
  {
    title: "Quarkus OIDC: cross-tenant authentication bypass via shared token-introspection cache",
    short: "OIDC cross-tenant auth bypass via shared token-introspection cache",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-524",
    type: "Cross-tenant authentication bypass (sensitive-cache reuse)",
    status: "CVE published",
    severity: "Important · CVSS 8.7",
    ref: "CVE-2026-19625",
    credited: true,
    tagline:
      "In multi-tenant Quarkus OIDC deployments, opaque access tokens are cached by token value alone — with no tenant discriminator — so a token introspected for one tenant is reused to authenticate it against another, defeating tenant isolation. Red Hat–assigned CVE, rated Important.",
    links: [
      { label: "CVE-2026-19625", url: "https://www.cve.org/CVERecord?id=CVE-2026-19625" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-19625" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-19625" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "Quarkus OIDC keys its token-introspection cache on the opaque token value only, with no tenant discriminator; in a multi-tenant application a token introspected under one tenant is served from cache for another, bypassing tenant isolation (scope-changed, CVSS 8.7)",
      "Red Hat assigned CVE-2026-19625 (RHBZ#2517693) and rated it Important; the fix is a tenant-scoped cache key",
    ],
  },
  {
    title: "Quarkus spring-web: authorization bypass via URL query-string manipulation (@RequestHeader)",
    short: "spring-web reads @RequestHeader from the URL query string (authz bypass)",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-551",
    type: "Authorization bypass (query string parsed as a request header)",
    status: "CVE published",
    severity: "Important · CVSS 7.4",
    ref: "CVE-2026-19651",
    credited: true,
    tagline:
      "The quarkus-spring-web compatibility layer resolves Spring @RequestHeader values from the URL query string, so an unauthenticated caller who cannot set a trusted request header can pass it as a query parameter instead — bypassing header-based authorization. Fixed in Quarkus 3.39.2 and up; credited.",
    links: [
      { label: "CVE-2026-19651", url: "https://www.cve.org/CVERecord?id=CVE-2026-19651" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-19651" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-19651" },
      { label: "GHSA-vv4c-mhvm-c6gv", url: "https://github.com/quarkusio/quarkus/security/advisories/GHSA-vv4c-mhvm-c6gv" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "quarkus-spring-web maps Spring's @RequestHeader binding such that header values are also read from the URL query string; a caller who cannot set a trusted header can instead supply it as a query parameter, defeating header-based authorization and tenant isolation (CVSS 7.4)",
      "Red Hat assigned CVE-2026-19651 (RHBZ#2517694, CWE-551) rated Important; fixed in Quarkus 4.0.0 / 3.40.0 / 3.39.2 / 3.33.4 / 3.27.6, and the GitHub Security Advisory GHSA-vv4c-mhvm-c6gv credits me (Michael-JRead)",
    ],
  },
  {
    title: "Quarkus 3.38.0: reintroduced CVE-2026-50559 path-normalization authorization bypass",
    short: "Reintroduced CVE-2026-50559 path-normalization bypass in 3.38.0 GA",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-863",
    type: "Authorization bypass (path normalization) — regression report",
    status: "Merged",
    ref: "GHSA-qcxp-gm7m-4j5v",
    url: "https://github.com/quarkusio/quarkus/security/advisories/GHSA-qcxp-gm7m-4j5v",
    summary: [
      "Reported that the fix for CVE-2026-50559 was reintroduced in Quarkus 3.38.0 GA",
      "Vendor confirmed the regression and updated the advisory metadata to mark 3.38.0 affected",
      "Refixed in Quarkus 3.38.1, 3.33.3.1, and 3.27.5.1",
    ],
  },
  {
    title: "Apache Kafka: CIDR ACL bypass in Authorizer.authorizeByResourceType() default impl",
    short: "CIDR ACL bypass in authorizeByResourceType()",
    vendor: "Apache Kafka",
    cwe: "CWE-863",
    type: "Authorization bypass (ACL)",
    status: "Merged",
    ref: "PR #22883",
    url: "https://github.com/apache/kafka/pull/22883",
    summary: [
      "Reported to Apache Kafka security team",
      "Maintainers confirmed the issue and pointed to an already-open fix PR",
      "Fix now merged upstream (PR #22883)",
    ],
  },
  {
    title: "Quarkus OIDC DPoP: no iat window / no jti replay cache (RFC 9449 conformance)",
    short: "OIDC DPoP proofs accepted with no iat window / jti replay cache",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-294",
    type: "Auth bypass by capture-replay",
    status: "Accepted (hardening)",
    ref: "issue #55916",
    url: "https://github.com/quarkusio/quarkus/issues/55916",
    links: [
      { label: "issue #55916", url: "https://github.com/quarkusio/quarkus/issues/55916" },
      { label: "issue #55917", url: "https://github.com/quarkusio/quarkus/issues/55917" },
    ],
    credited: true,
    summary: [
      "RFC 9449 gap: DPoP proofs accepted with no iat freshness window and no jti replay cache",
      "Vendor declined a CVE (nonce checks are SHOULD/optional per spec)",
      'Opened enhancement issues #55916 and #55917, crediting me as "Mike Read"',
    ],
  },
  {
    title: "Remote dev mode: path traversal + unsafe deserialization",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-22 / CWE-502",
    type: "Path Traversal + Insecure Deserialization",
    status: "Merged",
    ref: "PR #55380",
    url: "https://github.com/quarkusio/quarkus/pull/55380",
    summary: [
      "Path-traversal escape from the application root via unnormalized path resolution",
      "Unsafe deserialization of network input through a raw ObjectInputStream with no filter",
      "Both hardened in one backported fix",
    ],
  },
  {
    title: "Pulsar extension silently skipped TLS hostname verification",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-297",
    type: "Improper Certificate Validation (MITM)",
    status: "Merged",
    ref: "PR #55308",
    url: "https://github.com/quarkusio/quarkus/pull/55308",
    summary: [
      "Pulsar extension skipped TLS hostname verification even when explicitly configured",
      "Enables man-in-the-middle exposure against Pulsar brokers",
      "Fixed by properly enabling verification and honoring the trust settings",
    ],
  },
  {
    title: "SmallRye GraphQL unauthenticated memory-exhaustion DoS",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption",
    status: "Merged",
    ref: "PR #55361",
    url: "https://github.com/quarkusio/quarkus/pull/55361",
    summary: [
      "Unauthenticated deeply-nested queries against cyclic schemas balloon into multi-gigabyte heap allocation",
      "Resolved with a sensible default query-depth limit",
    ],
  },
  {
    title: "Dev MCP endpoints missing localhost / CORS / Host checks",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-346",
    type: "Origin Validation / Dev-endpoint Exposure",
    status: "Merged",
    ref: "PR #55353",
    url: "https://github.com/quarkusio/quarkus/pull/55353",
    credited: true,
    summary: [
      "Dev MCP endpoints exposed without the localhost, CORS, and Host-header checks that guard other dev-mode endpoints",
      "Lockdown fix landed with credit to me (milestone 3.27.5)",
    ],
  },
  {
    title: "Dev-mode Host validation missing on sibling routes",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-346 / CWE-668",
    type: "Missing Origin / Host Validation",
    status: "Merged",
    ref: "PR #55431",
    url: "https://github.com/quarkusio/quarkus/pull/55431",
    summary: [
      "Sibling dev routes (/q/arc/*, /q/quarkus-oidc/*, /q/open-in-ide/*, /q/dev-mcp) reachable via DNS rebinding or an off-loopback bind",
      "New global Host-validation filter that covers every dev-mode route",
    ],
  },
  {
    title: "quarkus-security: @PermissionChecker with String[] parameter invoked with null (object-level auth silently no-ops)",
    short: "@PermissionChecker invoked with null — object-level auth silently no-ops",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-863",
    type: "Incorrect authorization (silent evaluation on empty data)",
    status: "Merged",
    ref: "PR #56066",
    url: "https://github.com/quarkusio/quarkus/pull/56066",
    summary: [
      "@PermissionChecker methods whose only object parameter is String[] were invoked with null at call time",
      "Object-level authorization silently evaluated against no data, defaulting to allow in common check patterns",
      "Vendor confirmed and merged the fix within three days of the report (Quarkus 3.38.2)",
    ],
  },
  {
    title: "quarkus-spring-security: @PostAuthorize / @PreFilter / @PostFilter silently ignored on Spring migration",
    short: "Spring @PostAuthorize / @PreFilter / @PostFilter silently ignored",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-863",
    type: "Incorrect authorization (dropped object-level checks)",
    status: "Fix in progress",
    ref: "issue #56070",
    url: "https://github.com/quarkusio/quarkus/issues/56070",
    credited: true,
    summary: [
      "Spring @PostAuthorize / @PreFilter / @PostFilter annotations honored upstream are silently dropped when apps migrate to Quarkus via quarkus-spring-security",
      'Vendor opened public tracking issue #56070 crediting me as "Mike Read"',
      "Hardening / developer-experience fix in flight",
    ],
  },
  {
    title: "Keycloak: username enumeration via empty-password login timing (dummyHash bypassed)",
    short: "Username enumeration via empty-password login timing",
    vendor: "Keycloak",
    cwe: "CWE-208",
    type: "Username enumeration (observable timing discrepancy)",
    status: "Fix in progress",
    ref: "issue #51887",
    url: "https://github.com/keycloak/keycloak/issues/51887",
    credited: true,
    summary: [
      "Keycloak runs a dummy PBKDF2 hash for non-existent users to make login timing uniform — but the empty-password path early-returns for an existing user without hashing, so an existing username answers ~one PBKDF2 faster than a non-existent one",
      "Unauthenticated attacker can enumerate valid usernames from response latency alone; brute-force protection is off by default, so nothing masks it (Keycloak 26.7.2)",
      'Maintainer opened public tracking issue #51887, crediting "Mike Read for discovering the timing issue"',
    ],
  },
];

/** A published CVE surfaced as a compact chip (homepage hero strip). */
export interface PublishedCve {
  id: string;
  url: string;
  /** Short descriptor next to the id, e.g. "CVSS 8.7" or "Important". */
  label?: string;
}

// Compact chip label: prefer the "CVSS x.y" fragment of a severity string,
// else the leading severity word ("Important"), else nothing.
function cveChipLabel(severity?: string): string | undefined {
  if (!severity) return undefined;
  const cvss = severity.match(/CVSS\s+[\d.]+/i);
  if (cvss) return cvss[0];
  const lead = severity.split("·")[0].trim();
  return lead || undefined;
}

/**
 * Published CVEs, derived from DISCLOSURES so the homepage "CVEs Discovered"
 * strip and this ledger can never drift: add a `CVE published` row above and it
 * surfaces in both places automatically, in the same order.
 */
export const PUBLISHED_CVES: PublishedCve[] = DISCLOSURES.filter(
  (d): d is Disclosure & { ref: string } =>
    d.status === "CVE published" && !!d.ref && d.ref.startsWith("CVE-"),
).map((d) => {
  const canonical = d.links?.find((l) => l.label === d.ref) ?? d.links?.[0];
  return {
    id: d.ref,
    url: canonical?.url ?? d.url ?? `https://www.cve.org/CVERecord?id=${d.ref}`,
    label: cveChipLabel(d.severity),
  };
});
