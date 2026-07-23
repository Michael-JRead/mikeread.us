import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Boxes,
  Crosshair,
  Crown,
  ExternalLink,
  Flag,
  GitPullRequest,
  Hammer,
  Server,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";
import { SITE_META } from "@/data/siteContent";
import { WALKTHROUGHS } from "@/data/walkthroughs";
import { DISCLOSURES } from "@/data/offsec";
import { CategoryBars, FreshnessStamp, RankRing, StatTile, Terminal, useHtbStats } from "@/lib/htb";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";

const HtbSkillRadar = lazy(() => import("@/components/HtbSkillRadar"));

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

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard" | "Insane";
type OsFilter = "all" | "Linux" | "Windows";

const DIFFICULTY_OPTIONS: DifficultyFilter[] = ["all", "Easy", "Medium", "Hard", "Insane"];
const OS_OPTIONS: OsFilter[] = ["all", "Linux", "Windows"];

export default function OffensiveSecurity() {
  const data = useHtbStats();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("all");
  const [osFilter, setOsFilter] = useState<OsFilter>("all");

  useEffect(() => {
    setActive(true);
    const prev = document.title;
    document.title = "Offensive Security — Michael Read";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  const filteredWalkthroughs = WALKTHROUGHS.filter((w) => {
    if (diffFilter !== "all" && w.difficulty !== diffFilter) return false;
    if (osFilter !== "all" && w.os !== osFilter) return false;
    return true;
  });

  const rankOwnership = data?.profile.rank_ownership;
  const nextPoints = data?.profile.next_rank_points;
  const progress = data?.profile.current_rank_progress ?? 0;

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
                  <span className="text-slate-500">//</span> operations dossier
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  Offensive Security
                </h1>
                <div className="section-rule mt-5" />
                <p className="mt-5 text-xl text-gray-200 max-w-3xl leading-relaxed">
                  Offensive security engineer working{" "}
                  <span className="text-red-300 font-semibold">web-app and Active Directory attack paths</span> — backed by
                  six offensive GIAC certifications, a live Hack The Box{" "}
                  <span className="text-red-300 font-semibold">Hacker</span> rank, and{" "}
                  <span className="text-red-300 font-semibold">real upstream security research</span> including a
                  vendor-confirmed CVE and merged hardening fixes to Quarkus.
                </p>
                <p className="mt-3 text-base text-gray-400 max-w-2xl">
                  Everything below is verifiable — stats sync daily from my live profile and
                  every finding links to its source.
                </p>
              </div>

              {data ? (
                <div className="space-y-16">
                  {/* Live ops panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                    <div className="lg:col-span-3">
                      <Terminal
                        data={data}
                        active={active}
                        extraLines={[
                          `[+] points ....... ${data.profile.points}`,
                          ...(rankOwnership != null ? [`[+] ownership .... ${rankOwnership}% rank owns`] : []),
                        ]}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <FreshnessStamp data={data} />
                        <a
                          href={SITE_META.social.hackthebox}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-red-400 hover:text-red-300 transition-colors"
                        >
                          verify on HTB
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    <div className="lg:col-span-2 p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm flex justify-center">
                      <RankRing
                        progress={progress}
                        rank={data.profile.rank}
                        nextRank={data.profile.next_rank}
                        avatar={data.profile.avatar}
                        operator={data.profile.name}
                        active={active}
                      />
                    </div>
                  </div>

                  {/* Stat grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatTile icon={<Server size={22} />} label="User Owns" value={data.profile.user_owns} active={active} />
                    <StatTile icon={<Crown size={22} />} label="System Owns" value={data.profile.system_owns} active={active} />
                    <StatTile icon={<Trophy size={22} />} label="Global Rank" value={data.profile.ranking ?? 0} prefix="#" active={active} />
                    <StatTile icon={<Zap size={22} />} label="Points" value={data.profile.points} active={active} />
                    <StatTile icon={<Flag size={22} />} label="Challenges" value={data.challenges?.solved ?? 0} active={active} />
                    <StatTile icon={<Star size={22} />} label="Rank Ownership" value={Math.round(rankOwnership ?? 0)} suffix="%" active={active} />
                  </div>

                  {/* Rank progression */}
                  {data.profile.next_rank && (
                    <div className="p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="font-mono uppercase tracking-widest text-red-300">{data.profile.rank}</span>
                        <span className="font-mono uppercase tracking-widest text-slate-500">{data.profile.next_rank}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                          initial={reduced ? false : { width: 0 }}
                          animate={{ width: `${Math.max(2, Math.min(100, progress))}%` }}
                          transition={reduced ? { duration: 0 } : { duration: 1.6, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-slate-400 tabular-nums">
                        {progress}% toward {data.profile.next_rank}
                        {nextPoints != null && ` — ${nextPoints.toFixed(1)} points to go`}
                      </p>
                    </div>
                  )}

                  {/* Skill matrix — full */}
                  {data.challengeCategories && data.challengeCategories.length > 0 && (
                    <div>
                      <p className="section-eyebrow mb-3">
                        <span className="text-slate-500">01 /</span> skill matrix
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Challenge Category Coverage
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-4 text-red-300">
                            <Crosshair size={18} />
                            <span className="font-mono text-xs uppercase tracking-widest">all categories</span>
                          </div>
                          <Suspense fallback={<div className="h-[380px]" />}>
                            <HtbSkillRadar
                              categories={data.challengeCategories}
                              limit={data.challengeCategories.length}
                              height={380}
                            />
                          </Suspense>
                        </div>
                        <div className="p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-4 text-red-300">
                            <Target size={18} />
                            <span className="font-mono text-xs uppercase tracking-widest">completion by category</span>
                          </div>
                          <div className="max-h-[380px] overflow-y-auto pr-1">
                            <CategoryBars categories={data.challengeCategories} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm text-center">
                  <div className="flex justify-center text-red-400 mb-4">
                    <HackTheBoxIcon size={40} />
                  </div>
                  <p className="text-gray-300">
                    Live Hack The Box stats are syncing — check back shortly or view the profile directly.
                  </p>
                </div>
              )}

              {/* Disclosure ledger */}
              <div className="mt-16">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">02 /</span> disclosure
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <ShieldAlert size={26} className="text-red-500" />
                  Responsible Disclosure &amp; Research
                </h2>
                <p className="text-gray-400 mb-6 max-w-3xl">
                  Original vulnerability research and merged upstream security fixes — every row
                  links to its public record. One CVE advisory is pending coordinated disclosure.
                </p>
                <div className="overflow-x-auto rounded-lg border border-red-500/30 bg-slate-900/40 backdrop-blur-sm">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead>
                      <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-slate-400 border-b border-red-500/20">
                        <th className="px-4 py-3">Finding</th>
                        <th className="px-4 py-3">Vendor</th>
                        <th className="px-4 py-3">Class</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Ref</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DISCLOSURES.map((d) => (
                        <tr key={d.title} className="border-b border-red-500/10 last:border-0 hover:bg-slate-800/30 transition-colors align-top">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {d.status === "Merged" ? (
                                <GitPullRequest size={15} className="text-emerald-400 shrink-0" />
                              ) : (
                                <ShieldAlert size={15} className="text-amber-400 shrink-0" />
                              )}
                              <span className="text-white font-medium">{d.title}</span>
                            </div>
                            {d.note && <div className="text-slate-400 text-xs mt-1 max-w-md leading-relaxed">{d.note}</div>}
                            {d.credited && <span className="inline-block mt-1 text-[11px] font-mono text-emerald-300">✓ credited in the fix</span>}
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{d.vendor}</td>
                          <td className="px-4 py-3">
                            <span className="text-slate-300">{d.type}</span>
                            {d.cwe && <span className="block font-mono text-[11px] text-red-400 mt-0.5">{d.cwe}</span>}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${d.status === "Merged" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40" : "bg-amber-500/15 text-amber-300 border border-amber-400/40"}`}>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {d.url ? (
                              <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-red-300">
                                {d.ref ?? "link"} <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="font-mono text-xs text-slate-500">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology */}
              <div className="mt-16">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">03 /</span> methodology
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
              <div className="mt-16">
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

              {/* Walkthroughs */}
              <div id="walkthroughs" className="mt-16 scroll-mt-24">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">05 /</span> walkthroughs
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">HTB Machine Write-ups</h2>
                <p className="text-gray-400 mb-6 max-w-2xl">
                  Detailed, reproducible attack chains from retired boxes and challenges.
                </p>

                {WALKTHROUGHS.length > 0 && (
                  <div className="mb-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-slate-500 mr-1">
                        Difficulty
                      </span>
                      {DIFFICULTY_OPTIONS.map((d) => {
                        const isActive = diffFilter === d;
                        const label = d === "all" ? "All" : d;
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDiffFilter(d)}
                            aria-pressed={isActive}
                            className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                              isActive
                                ? "bg-red-500/20 border-red-500/60 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.25)]"
                                : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-red-500/40 hover:text-red-300"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-slate-500 mr-1">OS</span>
                      {OS_OPTIONS.map((o) => {
                        const isActive = osFilter === o;
                        const label = o === "all" ? "All" : o;
                        return (
                          <button
                            key={o}
                            type="button"
                            onClick={() => setOsFilter(o)}
                            aria-pressed={isActive}
                            className={`min-h-[36px] px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border inline-flex items-center gap-1.5 ${
                              isActive
                                ? "bg-sky-500/20 border-sky-400/60 text-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.2)]"
                                : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-sky-400/40 hover:text-sky-300"
                            }`}
                          >
                            {o === "Linux" && <span aria-hidden="true">🐧</span>}
                            {o === "Windows" && <span aria-hidden="true">🪟</span>}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-slate-500">
                        {filteredWalkthroughs.length} of {WALKTHROUGHS.length}
                      </span>
                    </div>
                  </div>
                )}

                {WALKTHROUGHS.length > 0 ? (
                  filteredWalkthroughs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredWalkthroughs.map((w) => {
                      const card = (
                        <>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">{w.name}</h3>
                            {w.difficulty && (
                              <span className="glass-readable-chip px-2.5 py-0.5 rounded-full text-xs font-bold">{w.difficulty}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed mb-4">{w.summary}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-mono text-slate-500">{w.platform}</span>
                            {w.os && <span className="rounded bg-slate-800 px-2 py-0.5 text-red-300 border border-red-500/20">{w.os}</span>}
                            {w.tags.map((t) => (
                              <span key={t} className="rounded-full bg-red-400/10 px-2.5 py-0.5 text-red-300">{t}</span>
                            ))}
                            {w.date && <span className="ml-auto font-mono text-slate-500">{w.date}</span>}
                          </div>
                        </>
                      );
                      const cardClass = "group p-5 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm hover:border-red-500/60 hover:bg-slate-900/60 transition-all";
                      return w.url ? (
                        <Link
                          key={w.name}
                          href={w.url}
                          className={cardClass}
                        >
                          {card}
                        </Link>
                      ) : (
                        <div key={w.name} className={cardClass}>
                          {card}
                        </div>
                      );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-900/40 border border-dashed border-slate-700 rounded-lg backdrop-blur-sm text-center">
                      <p className="text-gray-300 font-medium">No walkthroughs match these filters.</p>
                      <p className="text-sm text-slate-400 mt-2">
                        Try widening the difficulty or OS selection.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setDiffFilter("all");
                          setOsFilter("all");
                        }}
                        className="mt-4 inline-flex items-center gap-2 min-h-[36px] px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        Reset filters
                      </button>
                    </div>
                  )
                ) : (
                  <div className="p-8 bg-slate-900/40 border border-dashed border-red-500/30 rounded-lg backdrop-blur-sm text-center">
                    <div className="flex justify-center text-red-400 mb-3">
                      <HackTheBoxIcon size={32} />
                    </div>
                    <p className="text-gray-300 font-medium">Write-ups publishing soon.</p>
                    <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
                      Following Hack The Box's disclosure policy, only retired machines and
                      challenges are documented publicly. In the meantime, live progress is
                      verifiable on the profile below.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={SITE_META.social.hackthebox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-red-600 text-white font-semibold transition-all hover:bg-red-500 shadow-lg shadow-red-600/40"
                >
                  <HackTheBoxIcon size={20} />
                  View HTB Profile
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
