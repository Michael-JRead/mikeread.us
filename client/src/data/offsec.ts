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
  /** Short scannable bullets. Rendered as a bulleted list in the ledger's Summary column. */
  summary?: string[];
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
      { label: "CVE-2026-16308", url: "https://www.cve.org/CVERecord?id=CVE-2026-16308" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-16308" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-16308" },
      { label: "RHSA-2026:47189", url: "https://access.redhat.com/errata/RHSA-2026:47189" },
      { label: "IBM", url: "https://www.ibm.com/support/pages/security-bulletin-ibm-enterprise-build-quarkus-affected-dos-vulnerability" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "Unauthenticated multipart/form-data request with an oversized part-header section exhausts the JVM heap in RESTEasy Reactive's MultipartParser (OutOfMemoryError)",
      "Fixed in Red Hat build of Quarkus 3.27.4.SP3; downstream advisories issued by IBM and others",
    ],
  },
  {
    title: "Quarkus 3.38.0: reintroduced CVE-2026-50559 path-normalization authorization bypass",
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
    vendor: "Apache Kafka",
    cwe: "CWE-863",
    type: "Authorization bypass (ACL)",
    status: "Fix in progress",
    ref: "PR #22883",
    url: "https://github.com/apache/kafka/pull/22883",
    summary: [
      "Reported to Apache Kafka security team",
      "Maintainers confirmed the issue and pointed to an already-open fix PR",
      "Not yet in a shipped release",
    ],
  },
  {
    title: "Quarkus OIDC DPoP: no iat window / no jti replay cache (RFC 9449 conformance)",
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
    title: "Apache ActiveMQ Artemis: JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
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
];
