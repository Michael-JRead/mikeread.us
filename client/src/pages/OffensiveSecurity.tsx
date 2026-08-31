import { Fragment, useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Bug,
  ChevronDown,
  Code2,
  ExternalLink,
  GitPullRequest,
  Hammer,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { SITE_META } from "@/data/siteContent";
import {
  DISCLOSURES,
  VENDORS,
  type Disclosure,
  type DisclosureStatus,
  type VendorInfo,
} from "@/data/offsec";
import { VENDOR_LOGOS } from "@/components/VendorLogos";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";

// Disclosure-row status → leading icon. "Merged" (fix landed) + "Accepted (hardening)"
// (vendor accepted; typically credited) are green wins; "CVE published" is high-severity
// rose; the rest are amber (work-in-flight or embargo). Kept close to the renderers so
// future status values fail typecheck if unhandled.
function statusIcon(status: DisclosureStatus): ReactNode {
  switch (status) {
    case "Merged":
      return <GitPullRequest size={15} className="text-emerald-400 shrink-0" />;
    case "Accepted (hardening)":
      return <ShieldCheck size={15} className="text-emerald-400 shrink-0" />;
    case "CVE published":
      return <ShieldAlert size={15} className="text-rose-400 shrink-0" />;
    case "Fix in progress":
    case "Advisory pending":
    case "Confirmed — CVE pending":
      return <ShieldAlert size={15} className="text-amber-400 shrink-0" />;
  }
}

function statusBadgeClass(status: DisclosureStatus): string {
  switch (status) {
    case "Merged":
    case "Accepted (hardening)":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40";
    case "CVE published":
      return "bg-rose-500/15 text-rose-200 border border-rose-400/40";
    case "Fix in progress":
    case "Advisory pending":
    case "Confirmed — CVE pending":
      return "bg-amber-500/15 text-amber-300 border border-amber-400/40";
  }
}

// Narrative order inside a vendor panel: headline CVEs first, then in-flight
// confirmations, then the merged pile, then remaining work-in-progress.
const STATUS_RANK: Record<DisclosureStatus, number> = {
  "CVE published": 0,
  "Confirmed — CVE pending": 1,
  "Advisory pending": 2,
  Merged: 3,
  "Fix in progress": 4,
  "Accepted (hardening)": 5,
};

function sortByStatus(rows: Disclosure[]): Disclosure[] {
  return rows
    .map((d, i) => ({ d, i }))
    .sort((a, b) => STATUS_RANK[a.d.status] - STATUS_RANK[b.d.status] || a.i - b.i)
    .map(({ d }) => d);
}

/** Every public record for a row, normalized to one list. */
function recordLinks(d: Disclosure): { label: string; url: string }[] {
  if (d.links) return d.links;
  if (d.url) return [{ label: d.ref ?? "public record", url: d.url }];
  return [];
}

// Small pill for the vendor cell — makes the vendor scannable without adding weight.
function VendorChip({ vendor }: { vendor: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900/60 px-2 py-0.5 font-mono text-[11px] text-slate-300 whitespace-nowrap">
      {vendor}
    </span>
  );
}

function CreditedChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300 whitespace-nowrap">
      ✓ credited
    </span>
  );
}

/** Row of link chips to a finding's public records; falls back to a plain ref label. */
function RecordLinkChips({
  d,
  tone = "slate",
  max,
}: {
  d: Disclosure;
  tone?: "slate" | "rose";
  /** Cap the number of chips (compact rows) — the hero shows the full set. */
  max?: number;
}) {
  const links = max ? recordLinks(d).slice(0, max) : recordLinks(d);
  const chipClass =
    tone === "rose"
      ? "border-rose-500/40 text-rose-200 hover:border-rose-400/70 hover:text-rose-100"
      : "border-slate-600/60 text-slate-300 hover:border-red-400/60 hover:text-red-200";
  if (recordLinks(d).length === 0) {
    if (!d.ref) return null;
    return (
      <span className="inline-flex items-center rounded-md border border-slate-700/60 bg-slate-950/40 px-2.5 py-1 font-mono text-[11px] text-slate-400">
        {d.ref}
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-md border bg-slate-950/40 px-2.5 py-1 font-mono text-[11px] transition-colors ${chipClass}`}
        >
          {l.label} <ExternalLink size={11} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function VendorLogoTile({
  vendor,
  size = "md",
}: {
  vendor: VendorInfo;
  size?: "sm" | "md";
}) {
  const Logo = VENDOR_LOGOS[vendor.key];
  const tile = size === "md" ? "w-14 h-14 rounded-xl" : "w-9 h-9 rounded-lg";
  const mark = size === "md" ? "w-8 h-8" : "w-5 h-5";
  return (
    <div
      className={`${tile} shrink-0 flex items-center justify-center border border-slate-700/60 bg-slate-950/80`}
      aria-hidden="true"
    >
      {Logo && <Logo className={mark} style={{ color: vendor.brand }} />}
    </div>
  );
}

// Titles on pending cards repeat the vendor ("Apache Kafka: unbounded …") — the card
// already names the vendor, so drop the prefix and re-capitalize what's left.
function stripVendorPrefix(title: string, vendor: VendorInfo): string {
  const idx = title.indexOf(": ");
  if (idx === -1) return title;
  const prefix = title.slice(0, idx).toLowerCase();
  const names = [vendor.name, vendor.match, `${vendor.name} Streams`, "Apache Kafka Streams"];
  if (!names.some((n) => prefix.startsWith(n.toLowerCase()))) return title;
  const rest = title.slice(idx + 2);
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

// One published-CVE hero. Built to tile: a fixed header band (status + CVE id),
// a logo+title row, a single meta line, the tagline, and link chips pinned to the
// bottom — so any number of CVEs line up as an even, scannable set in the grid.
function FeaturedCveCard({ cve }: { cve: Disclosure }) {
  const vendor = VENDORS.find((v) => v.match === cve.vendor);
  return (
    <div className="h-full flex flex-col rounded-xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/50 to-slate-900/60 backdrop-blur-sm shadow-[0_0_30px_rgba(244,63,94,0.10)] p-5 md:p-6">
      {/* Header band: status label · CVE id */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-rose-500/20">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-rose-400 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-rose-300">CVE Published</span>
          {cve.credited && <CreditedChip />}
        </div>
        {cve.ref && (
          <span className="font-mono text-sm md:text-base text-rose-200 font-bold whitespace-nowrap">
            {cve.ref}
          </span>
        )}
      </div>

      {/* Title with product mark */}
      <div className="flex items-start gap-3">
        {vendor && (
          <div className="hidden sm:block">
            <VendorLogoTile vendor={vendor} size="sm" />
          </div>
        )}
        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{cve.title}</h3>
      </div>

      {/* One meta line: vendor · class · CWE · severity */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        <VendorChip vendor={cve.vendor} />
        <span className="text-slate-400">{cve.type}</span>
        {cve.cwe && <span className="font-mono text-[11px] text-red-400 whitespace-nowrap">{cve.cwe}</span>}
        {cve.severity && (
          <span className="font-mono text-[11px] text-rose-300 whitespace-nowrap">{cve.severity}</span>
        )}
      </div>

      {/* Tagline grows to fill, so link chips align across cards */}
      {(cve.tagline ?? cve.summary?.[0]) && (
        <p className="mt-3 text-[13px] text-slate-300 leading-relaxed flex-1">
          {cve.tagline ?? cve.summary?.[0]}
        </p>
      )}

      <div className="mt-4">
        <RecordLinkChips d={cve} tone="rose" />
      </div>
    </div>
  );
}

/** Compact highlight card for a vendor-confirmed finding awaiting its CVE ID. */
function PendingCveCard({ d, vendor }: { d: Disclosure; vendor: VendorInfo }) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="flex items-center gap-3">
        <VendorLogoTile vendor={vendor} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-300">
            CVE pending · {vendor.name}
          </p>
          <p className="text-sm text-white font-medium leading-snug mt-0.5">
            {d.short ?? stripVendorPrefix(d.title, vendor)}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "rose" | "emerald" | "amber";
}) {
  const valueClass =
    accent === "rose"
      ? "text-rose-300"
      : accent === "emerald"
        ? "text-emerald-300"
        : accent === "amber"
          ? "text-amber-300"
          : "text-white";
  return (
    <div className="rounded-lg border border-red-500/25 bg-slate-900/40 backdrop-blur-sm px-4 py-3">
      <div className={`text-2xl md:text-3xl font-bold ${valueClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

/** Section 01 — metrics, the published-CVE hero, and the pending-CVE pipeline. */
function DisclosureHighlights() {
  const published = DISCLOSURES.filter((d) => d.status === "CVE published");
  const pending = DISCLOSURES.filter((d) => d.status === "Confirmed — CVE pending");
  const merged = DISCLOSURES.filter((d) => d.status === "Merged").length;
  const vendorsCount = new Set(DISCLOSURES.map((d) => d.vendor)).size;
  return (
    <div>
      <p className="section-eyebrow mb-3">
        <span className="text-slate-500">01 /</span> disclosure
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <ShieldAlert size={26} className="text-red-500" />
        Responsible Disclosure &amp; Research
      </h2>
      <p className="text-gray-400 mb-6 max-w-3xl">
        Original vulnerability research across the Java ecosystem — responsibly disclosed,
        vendor-confirmed, and backed by public records.
      </p>

      {/* Summary metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <MetricTile label="Disclosures" value={DISCLOSURES.length} />
        <MetricTile label="CVE Published" value={published.length} accent="rose" />
        <MetricTile label="Fixes Merged" value={merged} accent="emerald" />
        <MetricTile label="Vendors" value={vendorsCount} />
      </div>

      {/* Published CVE heroes — one full-width, two-plus tiled so they stay even */}
      {published.length > 0 && (
        <div
          className={`mb-8 grid gap-4 items-stretch ${published.length > 1 ? "lg:grid-cols-2" : ""}`}
        >
          {published.map((cve) => (
            <FeaturedCveCard key={cve.title} cve={cve} />
          ))}
        </div>
      )}

      {/* CVE pipeline — vendor-confirmed, IDs pending */}
      {pending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 font-mono text-[11px] uppercase tracking-wider text-slate-500">
            <span className="text-amber-400 font-bold">{pending.length}</span>
            <span>in the CVE pipeline — vendor-confirmed, IDs pending</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 items-start">
            {pending.map((d) => {
              const vendor = VENDORS.find((v) => v.match === d.vendor);
              if (!vendor) return null;
              return <PendingCveCard key={d.title} d={d} vendor={vendor} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/** One finding inside an expanded vendor panel — a single scannable row; the link is the detail. */
function FindingRow({ d, vendor }: { d: Disclosure; vendor: VendorInfo }) {
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 border-b border-slate-800/70 last:border-0 hover:bg-slate-900/40 transition-colors">
      <div className="flex items-start gap-2.5 flex-1 min-w-[240px]">
        <span className="mt-0.5">{statusIcon(d.status)}</span>
        <span className="text-sm text-white font-medium leading-snug">
          {d.short ?? stripVendorPrefix(d.title, vendor)}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 ml-auto">
        {d.cwe && <span className="font-mono text-[11px] text-red-400/90 whitespace-nowrap">{d.cwe}</span>}
        {d.severity && <span className="font-mono text-[11px] text-rose-300 whitespace-nowrap">{d.severity}</span>}
        {d.credited && <CreditedChip />}
        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${statusBadgeClass(d.status)}`}>
          {d.status}
        </span>
        <RecordLinkChips d={d} max={2} />
      </div>
    </li>
  );
}

function VendorStatChips({ rows }: { rows: Disclosure[] }) {
  const merged = rows.filter((d) => d.status === "Merged").length;
  const published = rows.filter((d) => d.status === "CVE published").length;
  const pendingCves = rows.filter((d) => d.status === "Confirmed — CVE pending").length;
  const credited = rows.filter((d) => d.credited).length;
  const chip = "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap";
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={`${chip} border-slate-600/60 bg-slate-950/40 text-slate-300`}>
        {rows.length} finding{rows.length === 1 ? "" : "s"}
      </span>
      {published > 0 && (
        <span className={`${chip} border-rose-400/40 bg-rose-500/10 text-rose-300`}>
          {published} CVE{published === 1 ? "" : "s"}
        </span>
      )}
      {pendingCves > 0 && (
        <span className={`${chip} border-amber-400/40 bg-amber-500/10 text-amber-300`}>
          {pendingCves} CVE{pendingCves === 1 ? "" : "s"} pending
        </span>
      )}
      {merged > 0 && (
        <span className={`${chip} border-emerald-400/40 bg-emerald-500/10 text-emerald-300`}>
          {merged} merged
        </span>
      )}
      {credited > 0 && (
        <span className={`${chip} border-emerald-400/40 bg-emerald-500/10 text-emerald-300`}>
          credited ×{credited}
        </span>
      )}
    </div>
  );
}

function VendorCard({
  vendor,
  rows,
  open,
  onToggle,
}: {
  vendor: VendorInfo;
  rows: Disclosure[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={`group w-full h-full text-left rounded-lg border p-5 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
        open
          ? "border-red-400/70 bg-slate-900/70 shadow-[0_0_30px_rgba(239,68,68,0.14)]"
          : "border-red-500/25 bg-slate-900/40 hover:border-red-500/55 hover:bg-slate-900/60"
      }`}
    >
      <div className="flex items-start gap-4">
        <VendorLogoTile vendor={vendor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-white font-bold leading-tight group-hover:text-red-200 transition-colors">
                {vendor.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                {vendor.org}
              </p>
            </div>
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`shrink-0 mt-0.5 text-slate-500 group-hover:text-red-300 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mt-2">{vendor.blurb}</p>
          <div className="mt-3">
            <VendorStatChips rows={rows} />
          </div>
        </div>
      </div>
    </button>
  );
}

function VendorDetailPanel({ vendor, rows }: { vendor: VendorInfo; rows: Disclosure[] }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        role="region"
        aria-label={`${vendor.name} findings`}
        className="mt-4 rounded-lg border border-red-500/30 bg-slate-950/50 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-red-500/20 bg-slate-900/40">
          <VendorLogoTile vendor={vendor} size="sm" />
          <div>
            <p className="text-white font-semibold leading-tight">{vendor.name}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {rows.length} finding{rows.length === 1 ? "" : "s"} · click a reference for the full record
            </p>
          </div>
        </div>
        <ul>
          {rows.map((d) => (
            <FindingRow key={d.title} d={d} vendor={vendor} />
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/** Section 02 — one interactive card per product; click to open the full body of work. */
function VendorShowcase() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const grouped = VENDORS.map((vendor) => ({
    vendor,
    rows: sortByStatus(DISCLOSURES.filter((d) => d.vendor === vendor.match)),
  })).filter((g) => g.rows.length > 0);

  const active = grouped.find((g) => g.vendor.key === openKey) ?? null;
  const toggle = (key: string) => setOpenKey((cur) => (cur === key ? null : key));

  return (
    <div>
      <p className="section-eyebrow mb-3">
        <span className="text-slate-500">02 /</span> upstream contributions
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Products I've Helped Harden</h2>
      <p className="text-gray-400 mb-6 max-w-3xl">
        Select a product to see every finding I've reported there — status, severity, and its
        public record.
      </p>

      <div className="grid md:grid-cols-2 gap-4 items-stretch">
        {grouped.map(({ vendor, rows }) => (
          <Fragment key={vendor.key}>
            <VendorCard
              vendor={vendor}
              rows={rows}
              open={openKey === vendor.key}
              onToggle={() => toggle(vendor.key)}
            />
            {/* Mobile: the panel opens right under the tapped card. */}
            <div className="md:hidden">
              <AnimatePresence initial={false}>
                {openKey === vendor.key && <VendorDetailPanel vendor={vendor} rows={rows} />}
              </AnimatePresence>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Desktop: one shared panel below the card grid. */}
      <div className="hidden md:block">
        <AnimatePresence initial={false} mode="wait">
          {active && (
            <VendorDetailPanel key={active.vendor.key} vendor={active.vendor} rows={active.rows} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Two very different disciplines, each with its own playbook: scoped bug-bounty
// testing, and the source-driven research that turns into upstream CVEs.
const METHOD_TRACKS: {
  key: "bounty" | "oss";
  label: string;
  sub: string;
  frameworks: string;
  steps: { name: string; desc: string }[];
}[] = [
  {
    key: "bounty",
    label: "Bug Bounties",
    sub: "scoped programs · web, API & cloud targets",
    frameworks: "PTES · OWASP WSTG · MITRE ATT&CK",
    steps: [
      {
        name: "Scope & rules of engagement",
        desc: "Read the program policy end to end — in-scope assets, exclusions, safe harbor, and reward tiers — so every test stays inside the lines.",
      },
      {
        name: "Recon & attack surface",
        desc: "Enumerate subdomains, discover content and endpoints, fingerprint the stack, and mine JavaScript and historical URLs for the surface others walk past.",
      },
      {
        name: "Vulnerability discovery",
        desc: "Hunt high-impact classes first — broken access control (IDOR/BOLA), auth and session flaws, injection, SSRF, and business-logic abuse — not low-signal noise.",
      },
      {
        name: "Validate & prove impact",
        desc: "Turn a finding into a minimal, safe proof of concept, score it honestly with CVSS, and never touch another user's data.",
      },
      {
        name: "Report & follow through",
        desc: "One clear bug per report — repro steps, impact, remediation — then work the triage thread until it's confirmed and resolved.",
      },
    ],
  },
  {
    key: "oss",
    label: "Open-Source Research",
    sub: "source-driven CVE hunting · coordinated disclosure",
    frameworks: "ISO/IEC 29147 · 30111",
    steps: [
      {
        name: "Read the source",
        desc: "Pick widely-deployed OSS and review its security-sensitive paths — TLS integration, authentication and authorization, deserialization, and resource limits.",
      },
      {
        name: "Find the defect in code",
        desc: "Trace the flaw to a specific method and commit, and confirm it's a framework defect present on the latest release and main — not application misuse.",
      },
      {
        name: "Build a reproducer",
        desc: "Stand up a self-contained PoC — often a Dockerized victim and attacker — with minimal dependencies and deterministic, verbatim output.",
      },
      {
        name: "Disclose responsibly",
        desc: "Email the vendor's security team privately with the write-up, PoC, severity assessment, and a suggested fix; hold the details under embargo.",
      },
      {
        name: "Drive the fix & CVE",
        desc: "Clarify the mechanism with maintainers, verify the patch actually closes it, and see it through to a merged fix, an assigned CVE, and credit.",
      },
    ],
  },
];

// Tools split into what was BUILT vs OPERATED — an honest use/build distinction.
const AUTHORED: { name: string; desc: string; url: string }[] = [
  { name: "SecretHound", desc: "Offline, zero-dependency loot analyzer — 300+ AD/Kerberos/ADCS detectors correlate dumps, potfiles & configs into a ranked, OSCP+-legal attack path", url: "https://github.com/Michael-JRead/Secrethound" },
];
const OPERATED: { group: string; tools: string[] }[] = [
  { group: "recon", tools: ["nmap", "ffuf", "gobuster", "amass", "nuclei"] },
  { group: "web", tools: ["burp suite", "sqlmap", "wfuzz"] },
  { group: "ad-network", tools: ["bloodhound", "impacket", "netexec", "responder"] },
  { group: "loot", tools: ["hashcat", "john"] },
  { group: "exploit", tools: ["metasploit", "pwntools", "sliver"] },
];

export default function OffensiveSecurity() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Offensive Security — Michael Read";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <SkipLink />
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="pt-16 pb-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Breadcrumb / back */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-red-300 transition-colors"
              >
                <ArrowLeft size={14} />
                cd ~/portfolio
              </Link>

              {/* Header */}
              <div className="mt-8 mb-12">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">//</span> research dossier
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  Offensive Security
                </h1>
                <div className="section-rule mt-5" />
              </div>

              <div className="space-y-16">
                {/* Headline research: metrics, CVE hero, pipeline */}
                <DisclosureHighlights />

                {/* Interactive vendor cards */}
                <VendorShowcase />

                {/* Methodology */}
                <div>
                  <p className="section-eyebrow mb-3">
                    <span className="text-slate-500">03 /</span> methodology
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How I Work</h2>
                  <p className="text-gray-400 mb-6 max-w-2xl">
                    Two disciplines, two playbooks — scoped bug-bounty testing, and the
                    source-driven research that turns into upstream CVEs.
                  </p>
                  <div className="grid lg:grid-cols-2 gap-5 items-start">
                    {METHOD_TRACKS.map((track) => {
                      const Icon = track.key === "bounty" ? Bug : Code2;
                      return (
                        <div
                          key={track.key}
                          className="rounded-lg border border-red-500/25 bg-slate-900/40 backdrop-blur-sm p-5 md:p-6"
                        >
                          <div className="flex items-start gap-3 mb-5 pb-4 border-b border-red-500/15">
                            <div className="w-10 h-10 shrink-0 rounded-lg border border-red-500/30 bg-slate-950/70 flex items-center justify-center text-red-400">
                              <Icon size={18} aria-hidden="true" />
                            </div>
                            <div>
                              <h3 className="text-white font-bold leading-tight">{track.label}</h3>
                              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                                {track.sub}
                              </p>
                              <p className="font-mono text-[10px] text-red-300/80 mt-1.5">{track.frameworks}</p>
                            </div>
                          </div>
                          <ol className="space-y-4">
                            {track.steps.map((step, i) => (
                              <li key={step.name} className="flex gap-3.5">
                                <span className="font-mono text-sm text-red-500 font-bold shrink-0 tabular-nums mt-0.5">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                  <h4 className="text-sm font-semibold text-white leading-snug">{step.name}</h4>
                                  <p className="text-[13px] text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Toolchain */}
                <div>
                  <p className="section-eyebrow mb-3">
                    <span className="text-slate-500">04 /</span> toolchain
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Arsenal</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Authored */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-3 text-red-300">
                        <Hammer size={16} />
                        <span className="font-mono text-xs uppercase tracking-widest">authored</span>
                      </div>
                      <div className="space-y-3">
                        {AUTHORED.map((tool) => (
                          <a
                            key={tool.name}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-4 rounded-lg border border-red-500/30 bg-slate-900/40 backdrop-blur-sm hover:border-red-500/60 hover:bg-slate-900/60 transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <Boxes size={16} className="text-red-400" />
                              <span className="font-mono font-semibold text-white group-hover:text-red-300 transition-colors">{tool.name}</span>
                              <ExternalLink size={12} className="text-slate-500 ml-auto" />
                            </div>
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{tool.desc}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                    {/* Operated */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-2 mb-3 text-slate-300">
                        <Wrench size={16} />
                        <span className="font-mono text-xs uppercase tracking-widest">operated</span>
                      </div>
                      <div className="relative scanlines rounded-lg overflow-hidden border border-red-500/40 bg-slate-950/80 backdrop-blur-sm p-6 font-mono text-sm">
                        {OPERATED.map((row, i) => (
                          <div key={row.group} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-1">
                            <span className="text-slate-600">{i === OPERATED.length - 1 ? "└──" : "├──"}</span>
                            <span className="text-red-400 w-28">{row.group}/</span>
                            <span className="text-slate-300">{row.tools.join("  ·  ")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* See also: Hack The Box */}
                <div className="rounded-lg border border-red-500/25 bg-slate-900/30 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <HackTheBoxIcon size={24} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 mb-1">
                        See also
                      </p>
                      <p className="text-white font-medium">Hack The Box — live rank, stats, and machine walkthroughs</p>
                    </div>
                  </div>
                  <Link
                    href="/hackthebox"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 hover:border-red-400/70 hover:text-red-200 transition-colors font-mono text-xs uppercase tracking-wider whitespace-nowrap"
                  >
                    Open HTB dossier
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={SITE_META.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-red-600 text-white font-semibold transition-all hover:bg-red-500 shadow-lg shadow-red-600/40"
                >
                  View GitHub
                  <ExternalLink size={16} />
                </a>
                <Link
                  href="/"
                  className="glass-readable-button inline-flex items-center gap-2 px-8 py-3 rounded-lg transition-all font-semibold hover:bg-red-500"
                >
                  <ArrowLeft size={18} />
                  Back to Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
