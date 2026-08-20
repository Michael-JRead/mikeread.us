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
    title: "quarkus-spring-web reads @RequestHeader from the URL query string (RESTEasy Reactive) — auth / tenant-isolation bypass",
    short: "quarkus-spring-web reads @RequestHeader from the URL query string",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-290",
    type: "Authorization / tenant-isolation bypass (trusted header spoofing)",
    status: "Confirmed — CVE pending",
    summary: [
      "quarkus-spring-web binds a Spring @RequestHeader from the URL query string in RESTEasy Reactive, so a client can forge a header the application trusts for authorization or tenant isolation",
      "An unauthenticated request can override a security-relevant header without ever setting it at the transport layer",
      'Quarkus security team accepted it as an embargoed CVE and started the process — Guillaume Smet: "I believe this warrants a CVE... I would place it under embargo"; severity assessed around "important"',
    ],
  },
  {
    title: "Quarkus OIDC shared token-introspection cache (token-only key) enables cross-tenant authentication bypass",
    short: "OIDC token-introspection cache (token-only key) — cross-tenant auth bypass",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-287",
    type: "Cross-tenant authentication bypass (cache-key scoping)",
    status: "Confirmed — CVE pending",
    credited: true,
    summary: [
      "Quarkus OIDC caches token-introspection results under a token-only key, ignoring the tenant, so an opaque token accepted in one tenant can authenticate against another",
      "Confirmed end-to-end on a running Quarkus 3.38.0 app with a full PoC; the fix is tenant-scoped cache keys",
      'Sergey Beryozkin: "I\'ll be dealing with it as an embargoed CVE with a credit to you" — severity assessed around Moderate',
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
    title: "Micrometer HTTP method tag — unbounded meter leak",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption (DoS)",
    status: "Merged",
    ref: "PR #55030",
    url: "https://github.com/quarkusio/quarkus/pull/55030",
    summary: [
      "Micrometer HTTP-server binding tagged its metrics with the raw request-line method token",
      "An unauthenticated attacker could mint a permanent Timer per unique method string — an unbounded, never-evicted meter leak",
      "Closed by folding the tag to a bounded allowlist of known HTTP methods",
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
    title: "Apache Kafka: unbounded CreatePartitions crashes and cascade-kills the KRaft controller quorum",
    short: "Unbounded CreatePartitions cascade-kills the KRaft controller quorum",
    vendor: "Apache Kafka",
    cwe: "CWE-770",
    type: "Uncontrolled Resource Consumption (KRaft controller DoS)",
    status: "Confirmed — CVE pending",
    summary: [
      "A single low-privilege authenticated CreatePartitions request with an unbounded partition count crashes the active KRaft controller",
      "Standbys cascade-crash as they take over, taking down the whole control-plane quorum",
      "Apache Kafka Security Team acknowledged and confirmed the issue; CVE and release timeline pending",
    ],
  },
  {
    title: "Apache Kafka Streams: OOM via unchecked deserialization size fields in changelog / repartition records",
    short: "Kafka Streams OOM via unchecked deserialization size fields",
    vendor: "Apache Kafka",
    cwe: "CWE-789",
    type: "Memory Allocation with Excessive Size Value",
    status: "Confirmed — CVE pending",
    summary: [
      "Class of DoS bugs where any attacker with producer access can crash any Kafka Streams application via a single crafted record",
      "Size fields on changelog / repartition records are trusted verbatim during deserialization, driving allocation before validation",
      "Apache Kafka Security Team acknowledged and confirmed the issue; CVE and release timeline pending",
    ],
  },
  {
    title: "Apache Kafka: unvalidated per-record size field kills the log cleaner (broker-wide compaction DoS)",
    short: "Unvalidated per-record size field kills the log cleaner (compaction DoS)",
    vendor: "Apache Kafka",
    cwe: "CWE-20 / CWE-1284",
    type: "Improper input validation → memory exhaustion (compaction DoS)",
    status: "Confirmed — CVE pending",
    credited: true,
    summary: [
      "A low-privilege producer (WRITE on one compacted topic) sends a single small compressed batch whose per-record sizeOfBodyInBytes is a lie; it is accepted at ingest but makes the background log cleaner attempt a ~2 GB allocation and die with OutOfMemoryError",
      "The cleaner thread is never restarted, so compaction stops broker-wide — including __consumer_offsets and __transaction_state — and the poison record survives restarts (unrecoverable without manual segment surgery)",
      "Apache Kafka Security Team confirmed the issue and will assign a CVE, acknowledging my responsible disclosure in the advisory (co-reported by multiple researchers); reporter-assessed CVSS ~8.0 High",
    ],
  },
  {
    title: "Apache ActiveMQ Artemis: JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    short: "JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    vendor: "Apache ActiveMQ Artemis",
    cwe: "CWE-1333",
    type: "Regular Expression Denial of Service (ReDoS)",
    status: "Confirmed — CVE pending",
    summary: [
      "SQL92 LIKE operator in the JMS/Core message-selector engine compiles to a backtracking Java regex",
      "A single crafted selector pattern drives super-linear CPU consumption per delivered message, exhausting the broker",
      "Artemis PMC (Clebert Suconic) formally accepted the report; patch is under peer review with a CVE being assigned",
    ],
  },
  {
    title: "Spring Boot: Jedis SSL auto-configuration does not enable TLS hostname verification",
    short: "Jedis SSL auto-configuration skips TLS hostname verification",
    vendor: "Spring",
    cwe: "CWE-297",
    type: "Improper Certificate Validation (MITM)",
    status: "Confirmed — CVE pending",
    ref: "GHSA-j5r6-cj5p-9mg6",
    credited: true,
    summary: [
      "Spring Boot's Jedis (Redis) auto-configuration builds SSLParameters for ciphers/protocols but never sets EndpointIdentificationAlgorithm=\"HTTPS\", so the JSSE SSLSocket performs no hostname verification",
      "On-path attacker holding any chain-trusted certificate can MITM Redis traffic (cached sessions, tokens, data); the default Lettuce client verifies hostname and is not affected — same weakness class as the accepted CVE-2026-40974 (Cassandra)",
      "Spring team (Stéphane Nicoll) accepted the report under draft advisory GHSA-j5r6-cj5p-9mg6; CVE will be issued in the next release round with credit to me as \"Mike Read\"",
      "Patched versions: Spring Boot 3.5.18 / 3.4.19 / 2.7.36 and Spring Boot Data Redis 4.1.2 / 4.0.9",
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
