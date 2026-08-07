import { Fragment, useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  ExternalLink,
  GitPullRequest,
  Hammer,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { SITE_META } from "@/data/siteContent";
import { DISCLOSURES, type Disclosure, type DisclosureStatus } from "@/data/offsec";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";

// Disclosure-row status → leading icon. "Merged" (fix landed) + "Accepted (hardening)"
// (vendor accepted; typically credited) are green wins; "CVE published" is high-severity
// rose; "Fix in progress" is amber (work-in-flight); "Advisory pending" is amber
// (embargo). Kept close to the ledger so future status values fail typecheck if unhandled.
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
      return "bg-amber-500/15 text-amber-300 border border-amber-400/40";
  }
}

// Row-groups shown as intra-table subheaders, in narrative order:
// the biggest pile first (merged fixes), then the credited hardening, then work-in-flight.
const LEDGER_GROUPS: { key: DisclosureStatus; label: string }[] = [
  { key: "Merged", label: "Fixed upstream" },
  { key: "Accepted (hardening)", label: "Accepted — hardening" },
  { key: "Fix in progress", label: "Fix in progress" },
  { key: "Advisory pending", label: "Advisory pending" },
];

function SummaryBullets({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-1 max-w-md">
      {items.map((b, i) => (
        <li key={i} className="flex items-start gap-2 text-slate-300 text-[13px] leading-relaxed">
          <span className="text-red-400 mt-1 shrink-0" aria-hidden="true">•</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function DisclosureRefLinks({ d }: { d: Disclosure }) {
  if (d.links) {
    return (
      <div className="flex flex-col items-end gap-0.5">
        {d.links.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-red-300">
            {l.label} <ExternalLink size={12} />
          </a>
        ))}
      </div>
    );
  }
  if (d.url) {
    return (
      <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-red-300">
        {d.ref ?? "link"} <ExternalLink size={12} />
      </a>
    );
  }
  return <span className="font-mono text-xs text-slate-500">—</span>;
}

// Small pill for the vendor cell — makes the vendor scannable without adding a whole column.
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

function FeaturedCveCard({ cve }: { cve: Disclosure }) {
  return (
    <div className="mb-8 rounded-lg border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/50 to-slate-900/60 backdrop-blur-sm shadow-[0_0_40px_rgba(244,63,94,0.12)] p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <ShieldAlert size={16} className="text-rose-400" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-rose-300">CVE Published</span>
            {cve.severity && (
              <>
                <span className="text-rose-500/60" aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-rose-300">{cve.severity}</span>
              </>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">{cve.title}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <VendorChip vendor={cve.vendor} />
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-slate-400">{cve.type}</span>
            {cve.cwe && (
              <>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-red-400">{cve.cwe}</span>
              </>
            )}
          </div>
        </div>
        {cve.ref && (
          <span className="font-mono text-base md:text-lg text-rose-300 font-bold whitespace-nowrap">
            {cve.ref}
          </span>
        )}
      </div>

      <div className="mb-5">
        <SummaryBullets items={cve.summary} />
      </div>

      {cve.links && (
        <div className="flex flex-wrap gap-2">
          {cve.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/40 bg-slate-900/50 px-3 py-1.5 font-mono text-xs text-rose-200 hover:border-rose-400/70 hover:text-rose-100 hover:bg-slate-900/70 transition-colors"
            >
              {l.label} <ExternalLink size={12} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricTile({ label, value, accent }: { label: string; value: string | number; accent?: "rose" | "emerald" }) {
  const valueClass =
    accent === "rose"
      ? "text-rose-300"
      : accent === "emerald"
        ? "text-emerald-300"
        : "text-white";
  return (
    <div className="rounded-lg border border-red-500/25 bg-slate-900/40 backdrop-blur-sm px-4 py-3">
      <div className={`text-2xl md:text-3xl font-bold ${valueClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function DisclosureLedger() {
  const featuredCve = DISCLOSURES.find((d) => d.status === "CVE published");
  const others = DISCLOSURES.filter((d) => d.status !== "CVE published");

  const cvePublished = DISCLOSURES.filter((d) => d.status === "CVE published").length;
  const upstreamFixes =
    DISCLOSURES.filter((d) => d.status === "Merged").length + cvePublished;
  const vendors = new Set(DISCLOSURES.map((d) => d.vendor)).size;
  const credited = DISCLOSURES.filter((d) => d.credited).length;

  const grouped = LEDGER_GROUPS.map((g) => ({
    ...g,
    rows: others.filter((d) => d.status === g.key),
  })).filter((g) => g.rows.length > 0);

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
        Original vulnerability research and merged upstream security fixes — every row
        links to its public record.
      </p>

      {/* Summary metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <MetricTile label="Disclosures" value={DISCLOSURES.length} />
        <MetricTile label="CVE Published" value={cvePublished} accent="rose" />
        <MetricTile label="Upstream Fixes" value={upstreamFixes} />
        <MetricTile label="Vendors" value={vendors} />
        <div className="hidden md:block col-span-4">
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            <span className="text-emerald-300">{credited}</span> disclosures credited to me by the upstream vendor.
          </p>
        </div>
      </div>

      {/* Featured CVE hero */}
      {featuredCve && <FeaturedCveCard cve={featuredCve} />}

      {/* Grouped table with intra-body subheaders */}
      <div className="overflow-x-auto rounded-lg border border-red-500/30 bg-slate-900/40 backdrop-blur-sm">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-slate-400 border-b border-red-500/20">
              <th className="px-4 py-3">Finding</th>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ref</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((group, gi) => (
              <Fragment key={group.key}>
                <tr>
                  <td
                    colSpan={6}
                    className={`px-4 ${gi === 0 ? "pt-4" : "pt-8"} pb-2`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 border-b border-red-500/10 pb-2">
                      <span className="text-red-400 font-bold">{group.rows.length}</span>
                      <span>{group.label}</span>
                    </div>
                  </td>
                </tr>
                {group.rows.map((d) => (
                  <tr
                    key={d.title}
                    className="border-b border-red-500/10 last:border-0 hover:bg-slate-800/30 transition-colors align-top"
                  >
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5">{statusIcon(d.status)}</span>
                        <div className="min-w-0">
                          <span className="text-white font-medium">{d.title}</span>
                          {d.credited && (
                            <span className="ml-2 align-middle inline-block">
                              <CreditedChip />
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <SummaryBullets items={d.summary} />
                    </td>
                    <td className="px-4 py-3 min-w-[10rem]">
                      <span className="text-slate-300">{d.type}</span>
                      {d.cwe && (
                        <span className="text-slate-500 font-mono text-[11px]"> · {d.cwe}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <VendorChip vendor={d.vendor} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(d.status)}`}
                      >
                        {d.status}
                      </span>
                      {d.severity && (
                        <span className="block font-mono text-[11px] text-rose-300 mt-1">
                          {d.severity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <DisclosureRefLinks d={d} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PHASES: { n: string; name: string; desc: string; tactics: string[] }[] = [
  { n: "01", name: "Reconnaissance", desc: "Map the external footprint — passive OSINT, DNS and subdomain discovery, and attack-surface enumeration before a single packet is sent in anger.", tactics: ["Reconnaissance", "Discovery"] },
  { n: "02", name: "Enumeration", desc: "Fingerprint every exposed service, pull versions and misconfigurations, and build the target model that drives the rest of the engagement.", tactics: ["Discovery"] },
  { n: "03", name: "Exploitation", desc: "Turn findings into access — web, network, and service exploitation, chained deliberately and validated with working proof, not theory.", tactics: ["Initial Access", "Execution"] },
  { n: "04", name: "Privilege Escalation", desc: "Move from foothold to full control through kernel, service, credential, and misconfiguration paths on Linux and Windows.", tactics: ["Privilege Escalation", "Credential Access"] },
  { n: "05", name: "Lateral Movement", desc: "Pivot through the environment — credential reuse, Active Directory abuse, and trust relationships to reach the objective.", tactics: ["Lateral Movement"] },
  { n: "06", name: "Post-Exploitation & Reporting", desc: "Triage loot with SecretHound, document the full attack chain, and translate it into prioritized, business-aware remediation.", tactics: ["Collection", "Impact"] },
];

// Tools split into what was BUILT vs OPERATED — an honest use/build distinction.
const AUTHORED: { name: string; desc: string; url: string }[] = [
  { name: "SecretHound", desc: "Offline credential & secret analyzer for engagement loot", url: "https://github.com/Michael-JRead/Secrethound" },
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
            <div className="max-w-5xl mx-auto">
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
                {/* Disclosure ledger */}
                <DisclosureLedger />

                {/* Methodology */}
                <div>
                  <p className="section-eyebrow mb-3">
                    <span className="text-slate-500">02 /</span> methodology
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How I Work an Engagement</h2>
                  <p className="text-gray-400 mb-6 max-w-2xl">
                    Aligned to <span className="text-red-300">PTES</span>, the{" "}
                    <span className="text-red-300">Unified Kill Chain</span>, and{" "}
                    <span className="text-red-300">MITRE ATT&amp;CK</span> tactics.
                  </p>
                  <div className="space-y-px">
                    {PHASES.map((p) => (
                      <div
                        key={p.n}
                        className="group flex gap-5 p-5 bg-slate-900/30 border-l-2 border-red-500/40 hover:border-red-500 hover:bg-slate-900/50 transition-all"
                      >
                        <span className="font-mono text-lg text-red-500 font-bold shrink-0 tabular-nums">{p.n}</span>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-red-300 transition-colors">{p.name}</h3>
                          <p className="text-sm text-gray-400 mt-1 leading-relaxed">{p.desc}</p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {p.tactics.map((t) => (
                              <span key={t} className="font-mono text-[10px] uppercase tracking-wider rounded bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Toolchain */}
                <div>
                  <p className="section-eyebrow mb-3">
                    <span className="text-slate-500">03 /</span> toolchain
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
