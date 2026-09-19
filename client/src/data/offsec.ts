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
  {
    key: "netty",
    match: "Netty",
    name: "Netty",
    org: "Netty project",
    blurb: "The asynchronous event-driven network framework underneath much of the JVM ecosystem.",
    brand: "#A3B8CC",
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
    title: "Apache ActiveMQ Artemis: JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    short: "JMS/Core message-selector LIKE ReDoS (super-linear CPU DoS)",
    vendor: "Apache ActiveMQ Artemis",
    cwe: "CWE-1333",
    type: "Regular-expression denial of service (algorithmic complexity)",
    status: "CVE published",
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
    severity: "High",
    ref: "CVE-2026-93491",
    credited: true,
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
    credited: true,
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
    severity: "Moderate · CVSS 5.3",
    ref: "CVE-2026-93564",
    credited: true,
    tagline:
      "When PROXY-protocol v2 parsing hits a malformed sibling TLV after a nested SSL TLV, the error path releases only the top level of a tree-shaped TLV list. Grandchild TLVs stay pinned, so repeated crafted connections exhaust pooled memory. Reported as an incomplete fix of the earlier patch; fixed in 4.1.138.Final and 4.2.18.Final.",
    links: [
      { label: "CVE-2026-93564", url: "https://www.cve.org/CVERecord?id=CVE-2026-93564" },
      { label: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-93564" },
      { label: "GHSA-j58c-g352-8h4p", url: "https://github.com/netty/netty/security/advisories/GHSA-j58c-g352-8h4p" },
    ],
    summary: [
      "Reported to the Netty project under coordinated disclosure",
      "The flatten-aware release helper on the malformed-TLV error path does not reach TLVs nested inside child SSL TLVs, so each crafted connection pins pooled ByteBufs that are never returned to the allocator (CVSS 5.3)",
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
