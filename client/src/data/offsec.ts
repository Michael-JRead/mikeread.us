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
  /**
   * CVSS score per CVE identifier, keyed by id — a finding tracked under two
   * ids can be scored differently in each record (and under different CVSS
   * versions). Ids absent from this map have no score published in a source we
   * can cite, and render without one rather than borrowing another record's.
   */
  cveScores?: Record<string, string>;
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
  /**
   * Monogram shown when no logo is mapped. Defaults to the first two letters of
   * `name`, which reads badly for "Apache …" products — set it explicitly there.
   */
  mono?: string;
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
    key: "vertx",
    match: "Eclipse Vert.x",
    name: "Eclipse Vert.x",
    org: "Eclipse Foundation",
    blurb: "The reactive, event-driven toolkit for the JVM — and the engine underneath Quarkus.",
    brand: "#782A90",
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
  {
    key: "netty",
    match: "Netty",
    name: "Netty",
    org: "Netty project",
    blurb: "The asynchronous event-driven network framework underneath much of the JVM ecosystem.",
    brand: "#A3B8CC",
  },
  {
    key: "tomcat",
    match: "Apache Tomcat",
    name: "Apache Tomcat",
    org: "Apache Software Foundation",
    blurb: "The most widely deployed Java servlet container and web server.",
    brand: "#F8DC75",
  },
  {
    key: "httpd",
    match: "Apache HTTP Server",
    name: "Apache HTTP Server",
    org: "Apache Software Foundation",
    blurb: "The web server the open web was built on, and the project the Apache Foundation grew out of.",
    brand: "#D22128",
  },
  {
    key: "gitea",
    match: "Gitea",
    name: "Gitea",
    org: "Gitea",
    blurb: "The self-hosted Git service and CI platform behind a large share of private forges.",
    brand: "#609926",
  },
  {
    key: "cxf",
    match: "Apache CXF",
    name: "Apache CXF",
    org: "Apache Software Foundation",
    blurb: "The JAX-RS and JAX-WS services framework under a long tail of enterprise Java web services.",
    brand: "#6EA8DC",
    mono: "CX",
  },
  {
    key: "pulsar",
    match: "Apache Pulsar",
    name: "Apache Pulsar",
    org: "Apache Software Foundation",
    blurb: "The multi-tenant, geo-replicated messaging and streaming platform.",
    brand: "#35A7E0",
  },
  {
    key: "freerdp",
    match: "FreeRDP",
    name: "FreeRDP",
    org: "FreeRDP project",
    blurb: "The open-source Remote Desktop Protocol client and library behind most Linux RDP clients.",
    brand: "#4FA3D9",
  },
  {
    key: "openbao",
    match: "OpenBao",
    name: "OpenBao",
    org: "OpenSSF",
    blurb: "The open-source, community-governed fork of HashiCorp Vault for secrets management.",
    brand: "#336D5C",
  },
  {
    key: "jackson",
    match: "Jackson",
    name: "Jackson",
    org: "FasterXML",
    blurb: "The de-facto JSON and binary data-format library for Java.",
    brand: "#C0CA33",
    mono: "JK",
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
    cveScores: {
      "CVE-2026-16308": "CVSS 7.5",
    },
    tagline:
      "Unauthenticated multipart/form-data request exhausts the JVM heap in RESTEasy Reactive — fixed in Red Hat build of Quarkus 3.27.4.SP3, with downstream advisories from IBM and others.",
    links: [
      { label: "CVE-2026-16308", url: "https://www.cve.org/CVERecord?id=CVE-2026-16308" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-16308" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-16308" },
      { label: "GHSA-g8rv-gp9f-q875", url: "https://github.com/advisories/GHSA-g8rv-gp9f-q875" },
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
    cveScores: {
      "CVE-2026-19625": "CVSS 8.7",
    },
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
    cveScores: {
      "CVE-2026-19651": "CVSS 7.4",
    },
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
    title: "Apache ActiveMQ Artemis: JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    short: "JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    vendor: "Apache ActiveMQ Artemis",
    cwe: "CWE-1333",
    type: "Regular-expression denial of service (algorithmic complexity)",
    status: "CVE published",
    // Severity per the CVE record as imported into the GitHub Advisory
    // Database (GHSA-c9m2-388v-p4rq); no numeric CVSS published there.
    severity: "Moderate",
    ref: "CVE-2026-75880",
    credited: true,
    tagline:
      "The SQL92 LIKE operator in the JMS/Core message-selector engine compiled to a backtracking Java regex, so an authenticated client attaching a consumer with a crafted wildcard selector drove super-linear CPU per delivered message and occupied a shared broker thread. Fixed by the Artemis PMC with wildcard caps in the selector compiler.",
    links: [
      { label: "CVE-2026-75880", url: "https://www.cve.org/CVERecord?id=CVE-2026-75880" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-75880" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache ActiveMQ security team",
      "An authenticated client could attach a consumer whose selector used crafted wildcards, causing excessive evaluation during message delivery and occupying a shared broker thread",
      "Accepted by the Artemis PMC, who authored the fix in ComparisonExpression (wildcard caps) and assigned CVE-2026-75880",
    ],
  },
  {
    title: "Apache ActiveMQ Artemis: Java deserialization via message-based management parameter processing",
    short: "Java deserialization via message-based management requests",
    vendor: "Apache ActiveMQ Artemis",
    cwe: "CWE-502",
    type: "Deserialization of untrusted data",
    status: "CVE published",
    // Severity per the CVE record as imported into the GitHub Advisory
    // Database (GHSA-73q3-xq4g-44wj); no numeric CVSS published there.
    severity: "Moderate",
    ref: "CVE-2026-57822",
    credited: true,
    tagline:
      "When the broker processes management-via-messaging requests, parameter processing triggers Java deserialization of a client-supplied object — reachable by a messaging client holding MANAGE permission. Reported after tracing the deserialization ahead of the per-operation management check.",
    links: [
      { label: "CVE-2026-57822", url: "https://www.cve.org/CVERecord?id=CVE-2026-57822" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-57822" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache ActiveMQ security team",
      "Artemis deserialized an untrusted, client-supplied object out of a management message during parameter processing on the management-via-messaging path",
      "Apache assigned CVE-2026-57822, scoping the affected path to clients authorized with MANAGE permission",
    ],
  },
  {
    title: "Apache ActiveMQ Artemis: unauthenticated durable-queue creation over the Core protocol",
    short: "Unauthenticated durable-queue creation via the Core protocol",
    vendor: "Apache ActiveMQ Artemis",
    cwe: "CWE-306",
    type: "Missing authentication / authorization for a critical function",
    status: "CVE published",
    // Severity per the CVE record as imported into the GitHub Advisory
    // Database (GHSA-593h-2v8w-vxpx); no numeric CVSS published there.
    severity: "High",
    ref: "CVE-2026-49362",
    credited: true,
    tagline:
      "An unauthenticated remote attacker could create arbitrary durable queues through the Core protocol, manipulating broker state and opening a denial-of-service path — the CREATE_QUEUE packet was handled on channel 1 before authentication and authorization were enforced.",
    links: [
      { label: "CVE-2026-49362", url: "https://www.cve.org/CVERecord?id=CVE-2026-49362" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-49362" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache ActiveMQ security team",
      "A remote client could issue Core channel-1 CREATE_QUEUE to create durable queues and addresses with no authentication or authorization check (CWE-306 / CWE-862)",
      "Apache assigned CVE-2026-49362; unauthorized broker-state manipulation with a denial-of-service impact",
    ],
  },
  {
    title: "Netty: incomplete validation of malformed Transfer-Encoding enables HTTP request smuggling",
    short: "Malformed Transfer-Encoding validation gap → HTTP request smuggling",
    vendor: "Netty",
    cwe: "CWE-444",
    type: "HTTP request smuggling (inconsistent interpretation of requests)",
    status: "CVE published",
    severity: "Moderate · CVSS 6.5",
    ref: "CVE-2026-89044",
    credited: true,
    cveScores: {
      "CVE-2026-89044": "CVSS 6.5",
    },
    tagline:
      "Netty's HTTP/1 decoder validated Transfer-Encoding by suffix-matching the raw header value instead of parsing the coding list, so variants such as \"chunked, xchunked\" or a multi-line header slipped past the rejection rule — desynchronising a front-end/back-end pair into request smuggling. Fixed in 4.1.138.Final and 4.2.18.Final; credited.",
    links: [
      { label: "CVE-2026-89044", url: "https://www.cve.org/CVERecord?id=CVE-2026-89044" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-89044" },
      { label: "GHSA-hcvj-94mj-jp5c", url: "https://github.com/netty/netty/security/advisories/GHSA-hcvj-94mj-jp5c" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "The HTTP/1 decoder accepted malformed Transfer-Encoding headers in which \"chunked\" was present but not the final transfer coding, because validation suffix-matched the raw header value rather than parsing the coding list — enabling request smuggling in parser-differential deployments (CVSS 6.5)",
      "Fixed in netty-codec-http 4.1.138.Final and 4.2.18.Final; advisory GHSA-hcvj-94mj-jp5c credits me as a reporter",
    ],
  },
  {
    title: "Netty: unbounded per-connection queue growth in HttpServerCodec via HTTP/1.1 pipelining",
    short: "HttpServerCodec unbounded per-connection queue via HTTP/1.1 pipelining",
    vendor: "Netty",
    cwe: "CWE-770",
    type: "Uncontrolled resource consumption (unauthenticated DoS)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-93491",
    // A second id was once assigned to this report by another CNA and was
    // rejected as a duplicate of this one; it is deliberately not listed.
    credited: true,
    cveScores: {
      "CVE-2026-93491": "CVSS 7.5",
    },
    tagline:
      "HttpServerCodec packs the first 32 pipelined request methods into a single long, then spills every one after that into an unbounded queue. A client that pipelines requests while withholding reads on its own end grows that queue without limit, driving unbounded heap growth. Fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93491", url: "https://www.cve.org/CVERecord?id=CVE-2026-93491" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93491" },
      { label: "GHSA-pvjx-v7vp-62vq", url: "https://github.com/netty/netty/security/advisories/GHSA-pvjx-v7vp-62vq" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "The per-connection method-tracking overflow queue in HttpServerCodec has no cap, so an unauthenticated client pipelining HTTP/1.1 requests faster than it reads responses grows it without bound until the heap is exhausted",
      "The same defect class had already been fixed weeks earlier in the sibling HttpContentEncoder (CVE-2026-59899), which gained a maxPipelineDepth cap; HttpServerCodec — the codec essentially every Netty HTTP/1.1 server uses — never received the equivalent bound",
      "Affects netty-codec-http through 4.1.137.Final and 4.2.0–4.2.17.Final; fixed in 4.1.138.Final and 4.2.18.Final",
    ],
  },
  {
    title: "Netty: ByteBuf leak in StompSubframeDecoder when a frame body is never terminated",
    short: "StompSubframeDecoder ByteBuf leak on unterminated frame body",
    vendor: "Netty",
    cwe: "CWE-772",
    type: "Missing release of resource after effective lifetime (memory leak)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-93494",
    // A second id was once assigned to this report by another CNA and was
    // rejected as a duplicate of this one; it is deliberately not listed.
    credited: true,
    cveScores: {
      "CVE-2026-93494": "CVSS 7.5",
    },
    tagline:
      "Once a STOMP frame's declared content-length is satisfied, the decoder parks an allocator buffer in an instance field to await the single NUL byte that ends the frame. If that byte never arrives nothing releases it, so a peer leaks one buffer per connection — reclaimed by neither GC nor disconnect. Fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93494", url: "https://www.cve.org/CVERecord?id=CVE-2026-93494" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93494" },
      { label: "GHSA-ghg5-c4jg-8q5j", url: "https://github.com/netty/netty/security/advisories/GHSA-ghg5-c4jg-8q5j" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "A remote peer that sends a complete, well-formed STOMP body but omits its terminating NUL byte pins one allocator buffer per connection, with no path that ever releases it (CVSS 7.5)",
      "Affects netty-codec-stomp through 4.1.137.Final and 4.2.0–4.2.17.Final; fixed in 4.1.138.Final and 4.2.18.Final",
    ],
  },
  {
    title: "Netty: unbounded multi-line response accumulation in SmtpResponseDecoder",
    short: "SmtpResponseDecoder unbounded multi-line accumulation → memory exhaustion",
    vendor: "Netty",
    cwe: "CWE-400 / CWE-770",
    type: "Uncontrolled resource consumption (malicious-server DoS)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-93563",
    credited: true,
    cveScores: {
      "CVE-2026-93563": "CVSS 7.5",
    },
    tagline:
      "SmtpResponseDecoder collects multi-line SMTP response detail lines into a list with no size or count limit, so a malicious or compromised server can stream continuation lines indefinitely while withholding the final line and exhaust the client's heap. Fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93563", url: "https://www.cve.org/CVERecord?id=CVE-2026-93563" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93563" },
      { label: "GHSA-pq4x-537v-r54q", url: "https://github.com/netty/netty/security/advisories/GHSA-pq4x-537v-r54q" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "The multi-line response accumulator is unbounded in both line count and total size, so the server side of an SMTP conversation can drive the client to OutOfMemoryError simply by never terminating the response (CVSS 7.5)",
      "Affects netty-codec-smtp 4.1.0–4.1.137.Final and 4.2.0–4.2.17.Final; fixed in 4.1.138.Final and 4.2.18.Final",
    ],
  },
  {
    title: "Netty: HAProxy PROXY-v2 nested-TLV grandchild ByteBuf reference-count leak",
    short: "HAProxy PROXY-v2 nested-TLV grandchild ByteBuf leak (incomplete fix)",
    vendor: "Netty",
    type: "Missing release of resource (reference-count leak) — incomplete-fix report",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-93564",
    credited: true,
    cveScores: {
      "CVE-2026-93564": "CVSS 7.5",
    },
    tagline:
      "When PROXY-protocol v2 parsing hits a malformed sibling TLV after a nested SSL TLV, the error path releases only the top level of a tree-shaped TLV list. Grandchild TLVs stay pinned, so repeated crafted connections exhaust pooled memory. Reported as an incomplete fix of the earlier patch; fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93564", url: "https://www.cve.org/CVERecord?id=CVE-2026-93564" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93564" },
      { label: "GHSA-j58c-g352-8h4p", url: "https://github.com/netty/netty/security/advisories/GHSA-j58c-g352-8h4p" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "The flatten-aware release helper on the malformed-TLV error path does not reach TLVs nested inside child SSL TLVs, so each crafted connection pins pooled ByteBufs that are never returned to the allocator (CVSS 7.5)",
      "Identified as an incomplete fix of the project's earlier reference-leak patch; affects netty-codec-haproxy through 4.1.137.Final and 4.2.17.Final, fixed in 4.1.138.Final and 4.2.18.Final",
    ],
  },
  {
    title: "Netty: resource exhaustion in MqttDecoder via unvalidated Properties Length",
    short: "MqttDecoder resource exhaustion via unvalidated Properties Length",
    vendor: "Netty",
    cwe: "CWE-400",
    type: "Uncontrolled resource consumption — incomplete-fix report",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-93575",
    credited: true,
    cveScores: {
      "CVE-2026-93575": "CVSS 7.5",
    },
    tagline:
      "The MQTT decoder validates a packet's Remaining Length against the configured size limits but never checks the Properties Length against it. A packet declaring a small Remaining Length and an enormous Properties Length drives the decoder to buffer and re-parse huge property data, exhausting memory and CPU. Reported as an incomplete fix of CVE-2026-44248; fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93575", url: "https://www.cve.org/CVERecord?id=CVE-2026-93575" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93575" },
      { label: "GHSA-jqf3-r9ww-c5x8", url: "https://github.com/netty/netty/security/advisories/GHSA-jqf3-r9ww-c5x8" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "Size limits are enforced only against the packet's Remaining Length, so an attacker-declared Properties Length far larger than it is accepted and parsed; because the decoder replays on incomplete input, the oversized section is re-parsed repeatedly, burning CPU as well as heap (CVSS 7.5)",
      "Identified as an incomplete fix of CVE-2026-44248; affects netty-codec-mqtt through 4.1.137.Final and 4.2.17.Final, fixed in 4.1.138.Final and 4.2.18.Final",
    ],
  },
  {
    title: "Quarkus websockets-next: unbounded inbound message buffering enables a single-connection heap-exhaustion DoS",
    short: "websockets-next unbounded message buffering → single-connection OOM DoS",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-400 / CWE-770",
    type: "Uncontrolled resource consumption (unauthenticated DoS)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-87742",
    credited: true,
    cveScores: {
      "CVE-2026-87742": "CVSS 7.5",
    },
    tagline:
      "A @WebSocket endpoint on the documented default execution model buffers inbound messages with no bound and never applies read backpressure, so one connection streaming faster than the handler drains exhausts the JVM heap. Fixed by bounding the per-connection processing queue; credited.",
    links: [
      { label: "CVE-2026-87742", url: "https://www.cve.org/CVERecord?id=CVE-2026-87742" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-87742" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-87742" },
      { label: "GHSA-g4x4-8j33-p4h3", url: "https://github.com/advisories/GHSA-g4x4-8j33-p4h3" },
      { label: "RHBZ#2530522", url: "https://bugzilla.redhat.com/show_bug.cgi?id=2530522" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "The extension uses an unbounded queue and fails to apply read backpressure on the underlying network socket, so an attacker streaming messages over a single connection faster than the handler can process them rapidly exhausts heap space and crashes the JVM with java.lang.OutOfMemoryError (CVSS 7.5)",
      "Red Hat rated it High and credits me by name (RHBZ#2530522); affected versions 3.27 and 3.33",
    ],
  },
  {
    title: "Quarkus HTTP security: authorization bypass via path-normalization discrepancy in quarkus-vertx-http",
    short: "Path-normalization discrepancy in HTTP security → authorization bypass",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-285 / CWE-288 / CWE-436",
    type: "Authorization bypass (path-normalization discrepancy)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-87743",
    credited: true,
    cveScores: {
      "CVE-2026-87743": "CVSS 7.5",
    },
    tagline:
      "Paths are normalized differently by the Quarkus HTTP security matcher than by the request dispatchers behind it, so an unauthenticated attacker can craft a URL the matcher treats as public while the router dispatches it to a protected endpoint. Reported as an incomplete fix for CVE-2026-50559; credited.",
    links: [
      { label: "CVE-2026-87743", url: "https://www.cve.org/CVERecord?id=CVE-2026-87743" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-87743" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-87743" },
      { label: "RHBZ#2530523", url: "https://bugzilla.redhat.com/show_bug.cgi?id=2530523" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "The Quarkus HTTP security matcher normalizes paths differently from the request dispatchers behind it (RESTEasy, Undertow), so an unauthenticated attacker can craft a URL the matcher treats as public while the router dispatches it to a protected endpoint — bypassing path-based access-control rules (CVSS 7.5)",
      "Confirmed by the vendor as an incomplete fix for CVE-2026-50559; Red Hat rated it High and credits me by name (RHBZ#2530523); affected versions 3.27 and 3.33",
    ],
  },
  {
    title: "Quarkus Qute: {#eval} drops the parent template's content type, disabling output escaping",
    short: "Qute {#eval} drops the content type → escaping bypass (XSS / JSON injection)",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-79",
    type: "Cross-site scripting / injection via output-escaping bypass",
    status: "CVE published",
    severity: "Moderate · CVSS 6.1",
    ref: "CVE-2026-93432",
    credited: true,
    cveScores: {
      "CVE-2026-93432": "CVSS 6.1",
    },
    tagline:
      "When the {#eval} section helper renders a sub-template it fails to pass along the parent template's content type, so Qute's default HTML and JSON escaping never applies and untrusted data is emitted raw — reaching cross-site scripting and JSON injection. Its own sibling str:eval preserves the content type correctly.",
    links: [
      { label: "CVE-2026-93432", url: "https://www.cve.org/CVERecord?id=CVE-2026-93432" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93432" },
      { label: "Red Hat", url: "https://access.redhat.com/security/cve/CVE-2026-93432" },
      { label: "GHSA-6wxq-x76c-fqrf", url: "https://github.com/advisories/GHSA-6wxq-x76c-fqrf" },
    ],
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "The {#eval} section helper does not propagate the parent template's content type to the sub-template it renders, so the engine applies no output encoding and untrusted input is written as raw text (CVSS 6.1)",
      "Found by comparing {#eval} against its sibling str:eval, which preserves the content type correctly — the asymmetry between the two is what exposed the bug",
    ],
  },
  {
    title: "Apache Tomcat: OCSP certStatus=UNKNOWN accepted for client-cert auth even with ocspSoftFail=false",
    short: "OCSP certStatus=UNKNOWN accepted for client-cert auth despite soft-fail being disabled",
    vendor: "Apache Tomcat",
    cwe: "CWE-299",
    type: "Improper check for certificate revocation — incomplete-fix report",
    status: "CVE published",
    ref: "CVE-2026-86248",
    credited: true,
    tagline:
      "In the OpenSSL-FFM connector, a signed OCSP response carrying certStatus=UNKNOWN was accepted for client-certificate authentication even with ocspSoftFail=false — the setting whose entire purpose is to refuse a certificate whose revocation status cannot be established. Reported as a residual of the CVE-2026-34500 soft-fail fix.",
    links: [
      { label: "CVE-2026-86248", url: "https://www.cve.org/CVERecord?id=CVE-2026-86248" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-86248" },
      { label: "GHSA-c47j-g3rg-hrfq", url: "https://github.com/advisories/GHSA-c47j-g3rg-hrfq" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache Tomcat security team",
      "With ocspSoftFail=false, an UNKNOWN OCSP verdict should fail the handshake; instead the signed UNKNOWN response was treated as acceptable, so CLIENT_CERT authentication did not fail as expected and revocation checking was effectively skipped",
      "Confirmed as a residual of the earlier CVE-2026-34500 soft-fail fix; affects Tomcat 9.0.92–9.0.121, 10.1.22–10.1.59 and 11.0.0-M14–11.0.25, fixed in 9.0.122, 10.1.60 and 11.0.26",
    ],
  },
  {
    title:
      "Apache HTTP Server: mod_ssl SSLRequire reaches restricted ap_expr file functions from .htaccess",
    short: "SSLRequire reaches restricted ap_expr file() from .htaccess",
    vendor: "Apache HTTP Server",
    cwe: "CWE-269",
    type: "Improper privilege management — incomplete-fix report",
    status: "CVE published",
    // Apache publishes a textual severity for httpd rather than a CVSS vector;
    // the record for this one reads "low".
    severity: "Low",
    ref: "CVE-2026-59797",
    credited: true,
    tagline:
      "CVE-2026-44119 restricted ap_expr's file functions in .htaccess centrally, but mod_ssl parses SSLRequire's expression without passing through that restriction. A site author granted AllowOverride AuthConfig could use SSLRequire file(...) as a boolean oracle and read any file the httpd runtime user can — while Require expr with the identical call, in the same .htaccess, at the same override level, was correctly refused. Fixed in 2.4.69.",
    links: [
      { label: "CVE-2026-59797", url: "https://www.cve.org/CVERecord?id=CVE-2026-59797" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-59797" },
      { label: "Apache advisory", url: "https://httpd.apache.org/security/vulnerabilities_24.html" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache HTTP Server security team",
      "ssl_cmd_SSLRequire() calls ap_expr_parse() directly and never sets AP_EXPR_FLAG_RESTRICTED_FILE_FUNC — the flag the central path sets whenever an expression is parsed in .htaccess context — leaving SSLRequire as the one configuration directive that parsed an ap_expr expression outside the restriction",
      "Demonstrated full content recovery of a mode-0600 file owned by the httpd runtime user from a single .htaccess at AllowOverride AuthConfig: 25 of 25 characters in 828 requests, with no privilege beyond writing that one file",
      "Reported as an incomplete fix of CVE-2026-44119, whose own commit subject was \"restrict per-dir file funcs centrally\"; affects 2.4.0 through 2.4.68, fixed in 2.4.69 by r1938672",
    ],
  },
  {
    title:
      "Gitea Actions: fork pull-request approval decided by the triggering user, not the PR author",
    short: "Fork-PR workflow approval bypass via maintainer-triggered pull_request events",
    vendor: "Gitea",
    cwe: "CWE-441 / CWE-863",
    type: "Confused deputy / incorrect authorization (CI approval bypass)",
    status: "CVE published",
    severity: "High · CVSS 8.7",
    ref: "CVE-2026-94205",
    credited: true,
    cveScores: {
      "CVE-2026-94205": "CVSS 8.7",
    },
    tagline:
      "Gitea Actions decided whether a fork pull request needed approval from whoever triggered the event rather than from the PR author — so an ordinary maintainer triage action, such as adding a label, created the run unapproved while the workflow definition was still read from the fork head. Fork-controlled CI code then ran on the base repository's runners. Fixed in 28.0.0.",
    links: [
      { label: "CVE-2026-94205", url: "https://www.cve.org/CVERecord?id=CVE-2026-94205" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-94205" },
      { label: "GHSA-xh39-mxw9-34pp", url: "https://github.com/go-gitea/gitea/security/advisories/GHSA-xh39-mxw9-34pp" },
      { label: "PR #39399", url: "https://github.com/go-gitea/gitea/pull/39399" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Gitea security team",
      "The approval gate for fork pull requests keyed on the actor who raised the event instead of the pull request author, so any pull_request sub-event a maintainer raised during routine triage — labelling, assigning — satisfied it",
      "The workflow definition was still taken from the fork head, so the effect was fork-controlled workflow code executing on the base repository's runners with no explicit approval, wherever Actions is enabled and a runner is registered",
      "Affects Gitea through 1.27.3; fixed in 28.0.0 by PR #39399",
    ],
  },
  {
    title: "Apache CXF: quadratic ReDoS in the JAX-RS FIQL search-expression parser",
    short: "Quadratic ReDoS in the JAX-RS FIQL search parser (FiqlParser)",
    vendor: "Apache CXF",
    type: "Regular-expression denial of service (quadratic backtracking)",
    status: "CVE published",
    // Apache publishes a textual severity for CXF; this record reads "low" and
    // carries no CVSS vector and no CWE, so neither is shown.
    severity: "Low",
    ref: "CVE-2026-86463",
    credited: true,
    tagline:
      "FiqlParser located a comparison operator with a greedy [\\p{ASCII}]+(op) pattern and Matcher.find(). Given a search value with no operator in it, the greedy prefix swallowed the whole input, failed, and find() restarted from every index — O(n²) backtracking with no length bound. One 8 KB _s query cost about a second of CPU, roughly 1,000× a same-length valid query. Fixed by capping FIQL expressions at 4 KiB.",
    links: [
      { label: "CVE-2026-86463", url: "https://www.cve.org/CVERecord?id=CVE-2026-86463" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-86463" },
      { label: "Apache advisory", url: "https://lists.apache.org/thread.html/mv5qfmd27gkbvt3k6by9db5bolrsbgy1" },
      { label: "PR #3443", url: "https://github.com/apache/cxf/pull/3443" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache CXF security team",
      "FiqlParser's comparator pattern [\\p{ASCII}]+(=gt=|=ge=|=lt=|=le=|==|!=), driven by Matcher.find(), backtracks quadratically on any value containing no operator; the pattern had been unchanged since about 2015 and nothing bounded the expression length",
      "Reproduced end to end through SearchContextImpl on the released 4.2.3 jars: 8,000 characters cost ~966 ms and 16,000 cost ~4.5 s against ~4 ms for a same-length valid query",
      "Affects cxf-rt-rs-extension-search before 3.6.13, 4.0.0 before 4.1.9 and 4.2.0 before 4.2.4; fixed by PR #3443, which caps FIQL expressions at 4 KiB by default",
    ],
  },
  {
    title:
      "Apache CXF: attachment header size and count limits bypassable — unbounded-heap DoS",
    short: "Attachment header size and count limits bypassable via repeated headers",
    vendor: "Apache CXF",
    type: "Uncontrolled resource consumption (unauthenticated memory-exhaustion DoS) — incomplete-fix report",
    status: "CVE published",
    severity: "Low",
    ref: "CVE-2026-107937",
    credited: true,
    tagline:
      "CXF's multipart/MTOM part-header guards counted the wrong thing. The count limit (default 500) was checked against distinct header names rather than header lines, so a part repeating one header name never tripped it, and the size limit applied per physical line rather than to an assembled header value. An unauthenticated multipart request grew the heap without bound — one 16 MB body exhausted a 128 MB heap. Reported as an incomplete fix of CVE-2026-50645.",
    links: [
      { label: "CVE-2026-107937", url: "https://www.cve.org/CVERecord?id=CVE-2026-107937" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-107937" },
      { label: "Apache advisory", url: "https://lists.apache.org/thread.html/x9twtpv3d04qj83t6w9xkh9y2q28zztj" },
      { label: "PR #3430", url: "https://github.com/apache/cxf/pull/3430" },
      { label: "PR #3425", url: "https://github.com/apache/cxf/pull/3425" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache CXF security team",
      "AttachmentDeserializerUtil.loadPartHeaders() keyed headers into a name-keyed map and compared map size — distinct names — against attachment-headers-max-count, so a part whose every header line shared one name kept the count at 1 while its value list grew with every line",
      "Traced as an incomplete fix: CVE-2026-50645 added the guard in 4.2.2, and the CVE-2026-64958 follow-up in 4.2.3 bounded attachment count rather than header lines, leaving the guarding code byte-identical through 4.2.3 and main",
      "Demonstrated on the released 4.2.3 jar with default configuration: a single 16 MB request raised OutOfMemoryError in the CXF parse path on a 128 MB heap",
      "Affects cxf-core before 3.6.13, 4.0.0 before 4.1.9 and 4.2.0 before 4.2.4; fixed by PR #3430 (header count) and PR #3425 (header size)",
    ],
  },
  // Eclipse Vert.x — twelve findings published together in October 2026.
  // Scores are each CVE record's own CVSS 4.0 vector. The GHSAs carry separate
  // CVSS 3.1 scores that differ (e.g. 5.9 Moderate against the record's 8.2 High
  // for CVE-2026-102462); as with CVE-2026-93564, the identifier's record wins.
  // None of the records lists a CWE, and only GHSA-rm5c-2c7f-gc5g does (CWE-93).
  {
    title: "Vert.x DB2 client: unsafe Java deserialization of UDT column data from a malicious or man-in-the-middle DRDA server",
    short: "DRDA UDT column bytes deserialized via unfiltered ObjectInputStream → RCE/DoS",
    vendor: "Eclipse Vert.x",
    type: "Deserialization of untrusted data (client-side; RCE with a classpath gadget chain, otherwise DoS)",
    status: "CVE published",
    severity: "Critical · CVSS 9.2 (v4.0)",
    ref: "CVE-2026-102469",
    credited: true,
    cveScores: {
      "CVE-2026-102469": "CVSS 9.2 (v4.0)",
    },
    tagline:
      "The Vert.x DB2 client's DRDA protocol code deserializes User Defined Type (UDT) column data with a bare ObjectInputStream.readObject() call and no ObjectInputFilter or class allowlist. A legitimate DB2 server never sends the FDOCA 0x50 UDT type, but a malicious or man-in-the-middle DRDA server can return a 0x50-tagged column and have attacker-controlled bytes deserialized on the event loop before application code sees them — remote code execution if a gadget chain is on the classpath, denial of service otherwise. TLS is off by default, which makes the man-in-the-middle position practical. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102469", url: "https://www.cve.org/CVERecord?id=CVE-2026-102469" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102469" },
      { label: "GHSA-j4vf-w939-pgxf", url: "https://github.com/eclipse-vertx/vertx-sql-client/security/advisories/GHSA-j4vf-w939-pgxf" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "When a result set column is tagged with FDOCA LID 0x50 (UDT), the DRDA decoding code passes the column bytes to ObjectInputStream.readObject() with no ObjectInputFilter or class allowlist, on the Vert.x event loop and before application code can inspect or reject the row",
      "Needs a malicious DRDA server or a man-in-the-middle on the client connection (TLS is disabled by default); DB2 does not support this UDT type, so no legitimate server sends it. RCE needs a Java deserialization gadget chain on the application classpath; without one, crafted object graphs can cause denial of service",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x core: incomplete SSL context cache key lets the HTTP client receive a context with weaker SSL properties than requested",
    short: "Incomplete SSL context cache key → HTTP client reuses weaker SSL context",
    vendor: "Eclipse Vert.x",
    type: "Incomplete cache key leading to weakened SSL validation (hostname validation bypass)",
    status: "CVE published",
    severity: "Critical · CVSS 9.1 (v4.0)",
    ref: "CVE-2026-102476",
    credited: true,
    cveScores: {
      "CVE-2026-102476": "CVSS 9.1 (v4.0)",
    },
    tagline:
      "The Vert.x HTTP client caches SSL contexts for efficiency, but the cache key does not capture all of the requested SSL properties. A client that asks for a context can therefore be handed a cached one with weaker settings, for example one that ignores hostname validation when validation was requested. Where an application uses differing SSL options, connections can run without the hostname check they asked for, which exposes them to a man-in-the-middle. Fixed in 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102476", url: "https://www.cve.org/CVERecord?id=CVE-2026-102476" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102476" },
      { label: "GHSA-2vhw-4xwj-r38v", url: "https://github.com/eclipse-vertx/vert.x/security/advisories/GHSA-2vhw-4xwj-r38v" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The HTTP client caches SSL contexts, but the cache key does not fully reflect the requested SSL properties. A lookup can return a context with weaker properties than the caller asked for, such as one that ignores hostname validation when validation was requested",
      "Reachable when an application's HTTP client uses differing SSL settings, so that a weaker context is already cached when a stricter one is requested. Exploiting the skipped hostname check requires a man-in-the-middle position on the connection",
      "Fixed in 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x JSON Schema: quadratic-time uniqueItems validation allows CPU-exhaustion denial of service",
    short: "uniqueItems validation O(n²) pairwise comparison → CPU exhaustion",
    vendor: "Eclipse Vert.x",
    type: "Algorithmic complexity denial of service (quadratic CPU consumption)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-102461",
    credited: true,
    cveScores: {
      "CVE-2026-102461": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "vertx-json-schema validated the uniqueItems keyword with an O(n²) pairwise comparison loop that had no short-circuit or size limit, so CPU cost grows with the square of the array length. A remote, unauthenticated client whose JSON is validated against a schema using uniqueItems can submit a moderately sized array and tie up CPU, denying service; vertx-web-openapi-router, vertx-web-validation and vertx-openapi depend on vertx-json-schema and are also affected. Fixed in vertx-json-schema 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102461", url: "https://www.cve.org/CVERecord?id=CVE-2026-102461" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102461" },
      { label: "GHSA-4m87-8qfr-8p8m", url: "https://github.com/eclipse-vertx/vertx-json-schema/security/advisories/GHSA-4m87-8qfr-8p8m" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The uniqueItems keyword check in io.vertx:vertx-json-schema uses an O(n²) pairwise comparison loop with no short-circuit or size limit, so CPU time grows quadratically with array length",
      "A remote, unauthenticated attacker can trigger it by submitting a moderately sized JSON array that the application validates against a schema using uniqueItems. The dependent modules io.vertx:vertx-web-openapi-router, io.vertx:vertx-web-validation and io.vertx:vertx-openapi are also affected",
      "Fixed in vertx-json-schema 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x core: WebSocket frame and message decompression has no maximum allocation (zip-bomb DoS)",
    short: "WebSocket decompression has no maximum allocation → zip-bomb DoS",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (decompression bomb, memory exhaustion DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-102467",
    credited: true,
    cveScores: {
      "CVE-2026-102467": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "The vertx-core WebSocket implementation sets no limit on the number of bytes it allocates when decompressing frames or messages. A WebSocket peer can therefore send a small compressed payload that inflates without bound (a zip bomb) and exhausts the receiving Vert.x endpoint's memory. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102467", url: "https://www.cve.org/CVERecord?id=CVE-2026-102467" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102467" },
      { label: "GHSA-h722-h6c2-6j3c", url: "https://github.com/eclipse-vertx/vert.x/security/advisories/GHSA-h722-h6c2-6j3c" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The vertx-core WebSocket implementation sets no limit on the number of bytes it allocates when decompressing frames or messages",
      "A WebSocket peer that sends compressed frames or messages can deliver a zip bomb: a small payload that inflates into an unbounded allocation and denies service to the receiving endpoint",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x HTTP Proxy: body transformer interceptor does not correctly enforce its max buffered bytes limit",
    short: "Body transformer max-buffered-bytes limit not enforced → unbounded heap growth",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (server-side heap exhaustion DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-102475",
    credited: true,
    cveScores: {
      "CVE-2026-102475": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "The Vert.x HTTP proxy's body transformer interceptor relies on a max buffered bytes limit to keep the buffer for each request bounded, but that check was not correctly enforced. On a proxy configured with an intercepting body transformer, a client sending requests through it can force the server to allocate heap indefinitely. Fixed in 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102475", url: "https://www.cve.org/CVERecord?id=CVE-2026-102475" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102475" },
      { label: "GHSA-mjwh-5qfp-hjgc", url: "https://github.com/eclipse-vertx/vertx-http-proxy/security/advisories/GHSA-mjwh-5qfp-hjgc" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The proxy's body transformer interceptor relies on a max buffered bytes limit to bound the buffer held for each request. That check was not correctly enforced, so the buffered body could grow without limit and the server could be forced to allocate heap indefinitely",
      "Reachable only when the proxy uses an intercepting body transformer. Any client that can send requests through such a proxy can trigger it",
      "Fixed in 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x gRPC Server: per-message size limit applies only to compressed bytes, enabling compression bomb memory exhaustion",
    short: "gRPC max message size enforced on compressed bytes → decompression bomb",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (server-side decompression bomb / memory exhaustion DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-102477",
    credited: true,
    cveScores: {
      "CVE-2026-102477": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "A vertx-grpc-server endpoint checks its configurable per-message maximum size against the bytes received, so for a compressed message the limit bounds only the compressed size and not the decompressed content. A client that can send messages to the endpoint can submit a small compressed payload that expands well beyond the configured limit, forcing the server to allocate the excess memory. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102477", url: "https://www.cve.org/CVERecord?id=CVE-2026-102477" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102477" },
      { label: "GHSA-4wvq-75mw-q6cg", url: "https://github.com/eclipse-vertx/vertx-grpc/security/advisories/GHSA-4wvq-75mw-q6cg" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The gRPC endpoint's configurable per-message maximum size is applied to the received bytes; for a compressed message this bounds only the compressed size, so the decompressed content can be far larger than the configured limit",
      "Reachable by any client that can send a compressed gRPC message to an endpoint built on io.vertx:vertx-grpc-server; a small compression-bomb payload makes the server allocate memory well past the configured maximum",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x core: HTTP/1.x decoder canonicalizes crafted header names such as Content-Xength as Content-Length, enabling request smuggling",
    short: "HTTP/1.x decoder lenient header-name canonicalization → request smuggling",
    vendor: "Eclipse Vert.x",
    type: "HTTP request smuggling (lenient canonicalization of well-known header names in the HTTP/1.x decoder)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-102479",
    credited: true,
    cveScores: {
      "CVE-2026-102479": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "The Vert.x HTTP/1.x decoder canonicalizes well-known HTTP header names, but crafted names are also mapped onto entries in that list — a header named Content-Xength, for example, is interpreted as Content-Length. An attacker who can send HTTP/1.x requests can use the misread header for request smuggling. Fixed in 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102479", url: "https://www.cve.org/CVERecord?id=CVE-2026-102479" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102479" },
      { label: "GHSA-ch7p-g5pm-3gqx", url: "https://github.com/eclipse-vertx/vert.x/security/advisories/GHSA-ch7p-g5pm-3gqx" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The Vert.x HTTP/1.x decoder canonicalizes well-known HTTP header names. Crafted names that are not on that list are also mapped onto it, so a header named Content-Xength, for example, is interpreted as Content-Length",
      "The misread header can be used for HTTP request smuggling by an attacker who can send HTTP/1.x requests that reach the decoder",
      "Fixed in 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x MSSQL client: unbounded TDS message reassembly exhausts client direct memory",
    short: "MSSQL TDS message decoder unbounded packet reassembly → direct-memory OOM",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (client-side direct-memory OOM DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.2 (v4.0)",
    ref: "CVE-2026-102462",
    credited: true,
    cveScores: {
      "CVE-2026-102462": "CVSS 8.2 (v4.0)",
    },
    tagline:
      "The vertx-mssql-client TDS message decoder aggregates inbound TDS packets into a composite direct-memory buffer with no cumulative size limit. A malicious, compromised or man-in-the-middle SQL Server can keep sending packets without setting the END_OF_MESSAGE status flag and drive the client into an out-of-memory crash. This happens before authentication completes. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102462", url: "https://www.cve.org/CVERecord?id=CVE-2026-102462" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102462" },
      { label: "GHSA-fg6c-83v6-vhq4", url: "https://github.com/eclipse-vertx/vertx-sql-client/security/advisories/GHSA-fg6c-83v6-vhq4" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The TDS message decoder in io.vertx:vertx-mssql-client aggregates inbound TDS packets into a composite direct-memory buffer with no cumulative size limit",
      "A malicious, compromised or man-in-the-middle SQL Server can stream TDS packets without setting the END_OF_MESSAGE status flag. This causes unbounded direct-memory allocation and an out-of-memory crash on the client, before authentication completes",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x PostgreSQL client: unbounded array allocation in DataTypeCodec.binaryDecodeArray lets a malicious server crash the client",
    short: "DataTypeCodec.binaryDecodeArray unbounded array allocation → client OOM",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (client-side OOM DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.2 (v4.0)",
    ref: "CVE-2026-102463",
    credited: true,
    cveScores: {
      "CVE-2026-102463": "CVSS 8.2 (v4.0)",
    },
    tagline:
      "DataTypeCodec.binaryDecodeArray in vertx-pg-client sizes a Java array from a server-declared 32-bit dimension count with no upper bound. A malicious or compromised PostgreSQL server, or an on-path attacker on an unencrypted connection, can send a crafted DataRow message that makes the client attempt a multi-gigabyte heap allocation and crash with an OutOfMemoryError. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102463", url: "https://www.cve.org/CVERecord?id=CVE-2026-102463" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102463" },
      { label: "GHSA-xqmh-8fhj-48fp", url: "https://github.com/eclipse-vertx/vertx-sql-client/security/advisories/GHSA-xqmh-8fhj-48fp" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The binary array decoder (DataTypeCodec.binaryDecodeArray) reads a 32-bit array dimension count declared by the server and allocates a Java array of that size without checking it against any upper bound",
      "Reachable from a malicious or compromised PostgreSQL server, or an on-path attacker intercepting an unencrypted connection, by sending a crafted DataRow message with an excessively large dimension value; the client attempts a multi-gigabyte allocation and fails with an OutOfMemoryError",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x Redis client: heap exhaustion via unbounded RESP array, push and attribute allocation",
    short: "RESP parser unbounded array/push/attribute pre-allocation → heap exhaustion",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (client-side OOM DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.2 (v4.0)",
    ref: "CVE-2026-102465",
    credited: true,
    cveScores: {
      "CVE-2026-102465": "CVSS 8.2 (v4.0)",
    },
    tagline:
      "The Vert.x Redis client's RESP parser pre-allocates arrays to the array, push or attribute length a server declares, with no upper bound. A malicious or compromised Redis server, or a man-in-the-middle on the connection, can send a crafted RESP response that declares an extremely large length and forces a massive heap allocation. The resulting OutOfMemoryError crashes the Vert.x event loop thread and denies service to every connection and verticle sharing that loop. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102465", url: "https://www.cve.org/CVERecord?id=CVE-2026-102465" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102465" },
      { label: "GHSA-4wf9-p5hg-98w5", url: "https://github.com/vert-x3/vertx-redis-client/security/advisories/GHSA-4wf9-p5hg-98w5" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "The RESP parser pre-allocates arrays to the length a server declares for an array, push or attribute response and enforces no upper bound, so one crafted response that declares an extremely large length triggers a massive heap allocation",
      "Client-side: the attacker has to be the Redis server the application connects to (malicious or compromised) or sit in a man-in-the-middle position. The resulting OutOfMemoryError crashes the Vert.x event loop thread and denies service to every connection and verticle sharing that loop",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x MySQL client: uncapped server-declared column count allocation crashes the event loop with OutOfMemoryError",
    short: "Uncapped server-declared column count array allocation → event loop OOM",
    vendor: "Eclipse Vert.x",
    type: "Uncontrolled resource consumption (client-side OOM DoS)",
    status: "CVE published",
    severity: "High · CVSS 8.2 (v4.0)",
    ref: "CVE-2026-102466",
    credited: true,
    cveScores: {
      "CVE-2026-102466": "CVSS 8.2 (v4.0)",
    },
    tagline:
      "The Vert.x MySQL client pre-allocates the column-definition array for a result set from the column count the server declares, with no upper bound. A malicious or compromised MySQL server, or a man-in-the-middle, can send a result set packet declaring an extremely large column count and force a massive heap allocation; the resulting OutOfMemoryError crashes the Netty event loop thread and denies service to every connection and verticle in the application. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102466", url: "https://www.cve.org/CVERecord?id=CVE-2026-102466" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102466" },
      { label: "GHSA-9jxp-x3fr-ffqh", url: "https://github.com/eclipse-vertx/vertx-sql-client/security/advisories/GHSA-9jxp-x3fr-ffqh" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "io.vertx:vertx-mysql-client sizes the column-definition array for a result set directly from the server-declared column count with no upper-bound check, so a single crafted result set packet triggers a massive heap allocation and an OutOfMemoryError",
      "Requires a malicious or compromised MySQL server, or an attacker in a man-in-the-middle position on the client-server connection; the OutOfMemoryError crashes the Netty event loop thread, taking down all connections and verticles in the Vert.x application",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title: "Vert.x Mail Client: CRLF injection in MailMessage and MailAttachment headers allows manipulation of outgoing SMTP messages",
    short: "MailMessage/MailAttachment header CRLF injection → SMTP message tampering",
    vendor: "Eclipse Vert.x",
    cwe: "CWE-93",
    type: "CRLF injection (SMTP header injection)",
    status: "CVE published",
    severity: "Medium · CVSS 6.9 (v4.0)",
    ref: "CVE-2026-102471",
    credited: true,
    cveScores: {
      "CVE-2026-102471": "CVSS 6.9 (v4.0)",
    },
    tagline:
      "vertx-mail-client wrote header names and values from MailMessage.addHeader()/setHeaders() and MailAttachment.addHeader()/setHeaders(), plus attachment metadata such as setContentType() and setContentId(), into the SMTP DATA section without stripping CR or LF. Separately, Utils.mustEncode(char) let a bare LF in a From display name skip Q-encoding. Anyone who can influence those values through an application, such as a web form or API that feeds MailMessage, can inject headers like Bcc or Reply-To or prepend body content to outgoing mail. Fixed in 4.5.35, 5.1.10 and 5.2.1.",
    links: [
      { label: "CVE-2026-102471", url: "https://www.cve.org/CVERecord?id=CVE-2026-102471" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-102471" },
      { label: "GHSA-rm5c-2c7f-gc5g", url: "https://github.com/vert-x3/vertx-mail-client/security/advisories/GHSA-rm5c-2c7f-gc5g" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Eclipse Vert.x project",
      "Header names and values passed to MailMessage.addHeader()/setHeaders() and MailAttachment.addHeader()/setHeaders() are written verbatim into the SMTP DATA section. MailAttachment.setContentType(), setDisposition(), setDescription() and setContentId() go into MIME part headers without validation, and Utils.mustEncode(char) lets a bare LF in a From display name bypass Q-encoding",
      "Exploitable when an application passes attacker-influenced header names, header values or attachment metadata to the mail client, for example from a web form or API. An embedded CR/LF can add headers such as Bcc, Reply-To or Content-Type, or prepend body content, which redirects copies of mail, spoofs headers or alters message structure",
      "Fixed in 4.5.35, 5.1.10 and 5.2.1",
    ],
  },
  {
    title:
      "Apache Pulsar Manager: unauthenticated superuser creation, unauthenticated admin-API proxying and disclosure of the Pulsar admin credential",
    short: "Pulsar Manager: unauthenticated admin takeover and Pulsar admin-credential disclosure",
    vendor: "Apache Pulsar",
    cwe: "CWE-306",
    type: "Missing authentication for a critical function — end-of-life component, no fix",
    status: "CVE published",
    severity: "Critical · CVSS 10.0 (v4.0)",
    ref: "CVE-2026-105944",
    credited: true,
    cveScores: {
      "CVE-2026-105944": "CVSS 10.0 (v4.0)",
    },
    tagline:
      "Pulsar Manager left its initial-superuser operation open without authentication even after initialization, so anyone who could reach it could create an administrator account. Its proxy to the Pulsar admin API skipped its own authentication, attached the configured Pulsar admin credential to every forwarded request, and let the requester choose the destination — so the credential itself could be sent to an attacker's host. The Pulsar PMC has retired Pulsar Manager; there is no fix, and deployments should be removed.",
    links: [
      { label: "CVE-2026-105944", url: "https://www.cve.org/CVERecord?id=CVE-2026-105944" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-105944" },
      { label: "Apache advisory", url: "https://pulsar.apache.org/security/CVE-2026-105944/" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache Pulsar security team",
      "The operation that creates the initial superuser account requires no authentication and stays available after initialization, so anyone who can reach Pulsar Manager 0.3.0 or later can add an administrator at any time — and every account in those versions has full administrative privileges",
      "Requests Pulsar Manager proxies to the Pulsar admin API bypass its authentication and carry its configured admin credential, and the requester chooses the destination, so an unauthenticated user can run the admin operations that credential permits and have the credential sent to a host they control",
      "Affects every release, 0.1.0 through 0.4.0. The Pulsar PMC has retired Pulsar Manager and will not fix these issues; operators should remove deployments and replace any Pulsar credential or token signing key it held",
    ],
  },
  {
    title:
      "Apache Pulsar: missing authorization of the shadow-topic source allows cross-tenant message disclosure and deletion of source topic data",
    short: "Shadow-topic source never authorized → cross-tenant message read and ledger deletion",
    vendor: "Apache Pulsar",
    cwe: "CWE-862",
    type: "Missing authorization (cross-tenant data disclosure and destruction)",
    status: "CVE published",
    severity: "High · CVSS 8.7 (v4.0)",
    ref: "CVE-2026-105937",
    credited: true,
    cveScores: {
      "CVE-2026-105937": "CVSS 8.7 (v4.0)",
    },
    tagline:
      "A shadow topic reads another topic's managed ledger, chosen by the reserved PULSAR.SHADOW_SOURCE property. The admin REST API authorized the caller against the topic being created or updated but never against the source it named, so a tenant admin in one tenant could bind a topic to a persistent topic in any other tenant and consume its retained messages. The shadow topic's own retention and deletion then applied to the source's ledgers, permanently destroying the other tenant's data. Fixed in 4.0.14 and 4.2.5.",
    links: [
      { label: "CVE-2026-105937", url: "https://www.cve.org/CVERecord?id=CVE-2026-105937" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-105937" },
      { label: "Apache advisory", url: "https://pulsar.apache.org/security/CVE-2026-105937/" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Apache Pulsar security team",
      "Topic creation and topic-property updates accepted PULSAR.SHADOW_SOURCE while authorizing the caller only against their own topic; the SHADOW_TOPIC policy check existed only on the source-side shadow-topics API, so these paths never consulted the source tenant",
      "With the default authorization provider, an admin of their own tenant needed no permission on the source topic, namespace or tenant to read another tenant's retained messages, register new schema versions under its schema, and have the shadow topic's retention, trimming, offloading and deletion destroy the source's ledgers in BookKeeper and tiered storage — unacknowledged messages included",
      "Affects 3.0.0 before 4.0.14 and 4.1.0 before 4.2.5. The fixed versions disable shadow topics by default behind enableShadowTopics, require superuser for cross-tenant binding, and stop a shadow topic from deleting or trimming its source's data",
    ],
  },
  {
    title:
      "FreeRDP: drdynvc frees a pool-owned stream with the owned-stream deallocator — one-PDU client-side use-after-free",
    short: "drdynvc frees a pool-owned stream with the wrong deallocator → client use-after-free",
    vendor: "FreeRDP",
    cwe: "CWE-416 / CWE-762",
    type: "Use after free (mismatched memory-management routine, client-side)",
    status: "CVE published",
    // The record carries CVSS 4.0 7.1 High and CVSS 3.1 6.5 Medium; the GHSA
    // agrees on the 3.1 score. The 4.0 vector is shown, as for the other rows.
    severity: "High · CVSS 7.1 (v4.0)",
    ref: "CVE-2026-114042",
    credited: true,
    cveScores: {
      "CVE-2026-114042": "CVSS 7.1 (v4.0)",
    },
    tagline:
      "The drdynvc channel takes its reassembly buffer from a stream pool, but a hardening change in 3.32.0 made its length-mismatch error path free that buffer with Stream_Free — the owned-stream deallocator — instead of returning it with Stream_Release. A malicious RDP server sends one Virtual Channel PDU whose totalLength is smaller than the chunk it carries; the client rejects it and disconnects, and teardown then reads the already-freed stream. Fixed in 3.32.1.",
    links: [
      { label: "CVE-2026-114042", url: "https://www.cve.org/CVERecord?id=CVE-2026-114042" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-114042" },
      { label: "GHSA-5xjc-c64q-m8r6", url: "https://github.com/FreeRDP/FreeRDP/security/advisories/GHSA-5xjc-c64q-m8r6" },
      { label: "VulnCheck", url: "https://www.vulncheck.com/advisories/freerdp-3.32.0-use-after-free-via-drdynvc-virtual-channel-pdu" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the FreeRDP project",
      "In channels/drdynvc/client/drdynvc_main.c the reassembly buffer drdynvc->data_in comes from StreamPool_Take, but the length-mismatch error path released it with Stream_Free(…, TRUE) rather than Stream_Release — traced to commit 2362eb9885a2, which added a correct bare return in four other channels",
      "One well-formed PDU with totalLength smaller than its chunk (for example 1 against a 64-byte chunk) passes the TPKT framing check; on disconnect, StreamPool_Free → StreamPool_Clear → discard_entry reads isAllocatedStream from the freed stream, which AddressSanitizer reports as a use-after-free",
      "Fixed in 3.32.1",
    ],
  },
  {
    title:
      "OpenBao: policy-cache key built with path.Join lets a crafted policy name resolve to another namespace's ACL policy",
    short: "Traversal in a policy name collides with another namespace's cached ACL policy",
    vendor: "OpenBao",
    cwe: "CWE-24 / CWE-863",
    type: "Incorrect authorization via path traversal in a cache key (cross-namespace privilege escalation)",
    status: "CVE published",
    // The record carries CVSS 4.0 7.5 High (PR:H) and CVSS 3.1 6.6 Medium; the
    // GHSA scores CVSS 4.0 7.7 with PR:L. The record's 4.0 vector is shown.
    severity: "High · CVSS 7.5 (v4.0)",
    ref: "CVE-2026-115365",
    credited: true,
    cveScores: {
      "CVE-2026-115365": "CVSS 7.5 (v4.0)",
    },
    tagline:
      "OpenBao's policy store keyed its in-memory ACL cache on path.Join(namespace UUID, policy name) and never checked the name for traversal. The root namespace's UUID is a public constant, so a tenant admin who could set policy names on users in its own namespace could attach a policy named ../00000000-0000-0000-0000-000000000000/default — which resolved to the root namespace's cached policy before the storage layer's traversal guard was ever reached. Fixed in 2.6.3.",
    links: [
      { label: "CVE-2026-115365", url: "https://www.cve.org/CVERecord?id=CVE-2026-115365" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-115365" },
      { label: "GHSA-mjch-vcw3-hhmf", url: "https://github.com/openbao/openbao/security/advisories/GHSA-mjch-vcw3-hhmf" },
      { label: "VulnCheck", url: "https://www.vulncheck.com/advisories/openbao-2.3.0-before-2.6.3-incorrect-authorization-via-policy-cache-namespace-traversal" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the OpenBao project",
      "sanitizeName only lowercased and trimmed the name, and cacheKey built the LRU key with path.Join(ns.UUID, name), so a leading ../ consumed the namespace UUID and the attacker supplied the replacement; the cache hit returned before storage, so the IsRelativePath guard that rejects the same string on the request path never ran",
      "Demonstrated on the released 2.6.2 image from an ordinary tenant-admin grant inside a child namespace: a token wrote and read back the root namespace's cubbyhole, and with an operator policy resident in the cache it read a root-namespace secret and listed the root ACL policy names; the root-policy variant granted root inside the tenant's own namespace",
      "Fixed in 2.6.3; setting disable_cache = true is the documented workaround",
    ],
  },
  {
    title:
      "Jackson Smile async parser: unbounded eager byte[] allocation for raw binary allows OutOfMemoryError denial of service",
    short: "Async Smile parser allocates an attacker-declared raw-binary length up front → ~2 GB OOM",
    vendor: "Jackson",
    cwe: "CWE-789",
    type: "Memory allocation with excessive size value (unauthenticated DoS)",
    status: "CVE published",
    severity: "High · CVSS 7.5",
    ref: "CVE-2026-104895",
    credited: true,
    cveScores: {
      "CVE-2026-104895": "CVSS 7.5",
    },
    tagline:
      "Jackson's non-blocking Smile parser read a raw-binary value's length prefix from the input and allocated a byte[] of that size before reading the body — no upper bound, and no overflow guard. About ten bytes of Smile could force a ~2 GB allocation and an OutOfMemoryError, and an overflowing length threw NegativeArraySizeException outside the parser's exception contract. It is the same class as CVE-2020-28491 in the CBOR parser, whose guard never reached async Smile. Fixed in 2.18.12, 2.21.8, 2.22.4, 3.1.8 and 3.2.4.",
    links: [
      { label: "CVE-2026-104895", url: "https://www.cve.org/CVERecord?id=CVE-2026-104895" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-104895" },
      { label: "GHSA-h3c2-2m49-r49w", url: "https://github.com/FasterXML/jackson-dataformats-binary/security/advisories/GHSA-h3c2-2m49-r49w" },
    ],
    summary: [
      "Discovered and responsibly disclosed privately to the Jackson project",
      "On the raw-binary marker 0xFD, NonBlockingByteArrayParser._decodeVInt() computed (value << 6) + (i & 0x3F) without the (value >>> 25) != 0 overflow guard the blocking SmileParser._readUnsignedVInt has, and _startRawBinary allocated the declared length immediately",
      "A Smile feed of about ten bytes forced an eager ~2 GB allocation on reactive or asynchronous Smile endpoints; a length crafted to overflow int threw NegativeArraySizeException, a RuntimeException that is not a JacksonException. Either crashed the request or processing thread, with no privileges required",
      "Same class as CVE-2020-28491, fixed in the CBOR parser with a LONGEST_NON_CHUNKED_BINARY guard that the async Smile parser never received",
      "Fixed in jackson-dataformat-smile 2.18.12, 2.21.8 and 2.22.4, and in 3.1.8 and 3.2.4 for Jackson 3",
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
    title: "Quarkus OIDC: JWT token-type not checked on the server-less verification path (refresh token usable as a bearer token)",
    short: "OIDC server-less path skips the JWT token-type check (refresh token → bearer)",
    vendor: "Quarkus / Red Hat",
    cwe: "CWE-287",
    type: "Token-type confusion (refresh token accepted as a bearer token)",
    status: "Fix in progress",
    ref: "PR #56359",
    url: "https://github.com/quarkusio/quarkus/pull/56359",
    credited: true,
    summary: [
      "Discovered and responsibly disclosed to the Quarkus / Red Hat security team",
      "On the server-less OIDC verification path (e.g. inlined public keys), Quarkus did not check the JWT token-type claim, so a refresh token in JWT format — verifiable by the same key — could be presented and accepted as a bearer/access token",
      'Maintainer opened fix PR #56359 (backported to 3.27 / 3.33 / 3.39), crediting me — "The issue was identified by Michael-JRead"',
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

/**
 * Every CVE identifier carried by a row, in order: the `ref` first, then any
 * further CVE ids that appear among its public records. A finding occasionally
 * receives two identifiers when a vendor CNA and a coordinating CNA each assign
 * one to the same report; while both records stand, both are shown. Once one is
 * rejected as a duplicate it comes out of `links` and stops being counted, so
 * every row currently carries exactly one id.
 */
export function cveIdsOf(d: Disclosure): string[] {
  const ids: string[] = [];
  if (d.ref?.startsWith("CVE-")) ids.push(d.ref);
  for (const l of d.links ?? []) {
    if (l.label.startsWith("CVE-") && !ids.includes(l.label)) ids.push(l.label);
  }
  return ids;
}

/** The published CVSS for one identifier, if a citable source gives one. */
export function cveScoreOf(d: Disclosure, id: string): string | undefined {
  return d.cveScores?.[id];
}

/** The canonical record URL for one CVE id on a row. */
export function cveUrlOf(d: Disclosure, id: string): string {
  return (
    d.links?.find((l) => l.label === id)?.url ?? `https://www.cve.org/CVERecord?id=${id}`
  );
}

/**
 * Published CVE records, derived from DISCLOSURES so the homepage "CVEs
 * Discovered" strip and this ledger can never drift: add a `CVE published` row
 * above and it surfaces in both places automatically, in the same order. One
 * entry per identifier, so a finding that is genuinely tracked under two live
 * ids would contribute both.
 */
export const PUBLISHED_CVES: PublishedCve[] = DISCLOSURES.filter(
  (d) => d.status === "CVE published",
).flatMap((d) =>
  cveIdsOf(d).map((id) => ({
    id,
    url: cveUrlOf(d, id),
    label: cveScoreOf(d, id),
  })),
);
