import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Crosshair,
  Crown,
  ExternalLink,
  Flag,
  Server,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { CERTIFICATIONS, SITE_META, WALKTHROUGHS } from "@/data/siteContent";
import { CategoryBars, RankRing, StatTile, Terminal, useHtbStats } from "@/lib/htb";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HtbSkillRadar = lazy(() => import("@/components/HtbSkillRadar"));

// Capability areas, each anchored to a certification actually held (badge + name
// resolved from the certifications data — nothing here is claimed without a credential).
const CAPABILITIES: { area: string; cert: string; desc: string }[] = [
  {
    area: "Network Penetration Testing",
    cert: "GPEN",
    desc: "End-to-end network penetration testing — scoping, host and service enumeration, exploitation, and password attacks against Windows and Active Directory estates.",
  },
  {
    area: "Web Application Security",
    cert: "GWAPT",
    desc: "Web assessment across the OWASP Top 10 — injection, authentication and session flaws, access-control bypasses, and business-logic abuse, exploited hands-on.",
  },
  {
    area: "Cloud Penetration Testing",
    cert: "GCPN",
    desc: "Cloud-native attack paths — identity and metadata abuse, misconfigured storage and functions, and CI/CD and container-escape techniques across AWS and Azure.",
  },
  {
    area: "Incident Handling & Response",
    cert: "GCIH",
    desc: "The attacker's playbook from the defender's chair — detecting, containing, and eradicating intrusions across the full incident-handling lifecycle.",
  },
  {
    area: "Defensible Security Architecture",
    cert: "GDSA",
    desc: "Designing networks that resist the very techniques above — segmentation, zero-trust controls, and detection engineering built in from the start.",
  },
];

const PHASES: { n: string; name: string; desc: string }[] = [
  { n: "01", name: "Reconnaissance", desc: "Map the external footprint — passive OSINT, DNS and subdomain discovery, and attack-surface enumeration before a single packet is sent in anger." },
  { n: "02", name: "Enumeration", desc: "Fingerprint every exposed service, pull versions and misconfigurations, and build the target model that drives the rest of the engagement." },
  { n: "03", name: "Exploitation", desc: "Turn findings into access — web, network, and service exploitation, chained deliberately and validated with working proof, not theory." },
  { n: "04", name: "Privilege Escalation", desc: "Move from foothold to full control through kernel, service, credential, and misconfiguration paths on Linux and Windows." },
  { n: "05", name: "Lateral Movement", desc: "Pivot through the environment — credential reuse, Active Directory abuse, and trust relationships to reach the objective." },
  { n: "06", name: "Post-Exploitation & Reporting", desc: "Triage loot with SecretHound, document the full attack chain, and translate it into prioritized, business-aware remediation." },
];

const ARSENAL: { group: string; tools: string[] }[] = [
  { group: "recon", tools: ["nmap", "ffuf", "gobuster", "amass", "nuclei"] },
  { group: "web", tools: ["burp suite", "sqlmap", "wfuzz"] },
  { group: "ad-network", tools: ["bloodhound", "impacket", "netexec", "responder"] },
  { group: "loot", tools: ["hashcat", "john", "secrethound"] },
  { group: "exploit", tools: ["metasploit", "pwntools", "sliver"] },
];

function certBy(shortName: string) {
  return CERTIFICATIONS.find((c) => c.shortName === shortName);
}

export default function OffensiveSecurity() {
  const data = useHtbStats();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const prev = document.title;
    document.title = "Offensive Security — Michael Read";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  const rankOwnership = data?.profile.rank_ownership;
  const nextPoints = data?.profile.next_rank_points;
  const progress = data?.profile.current_rank_progress ?? 0;

  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />

      <main className="flex-1">
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
                <p className="mt-5 text-lg text-gray-400 max-w-2xl">
                  A live look at how I break things to make them stronger — hands-on
                  offensive work sharpened on Hack The Box, mapped to the certifications and
                  methodology behind it. Stats sync daily from my live profile.
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

              {/* Capabilities */}
              <div className="mt-16">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">02 /</span> capabilities
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Credentialed Capabilities</h2>
                <p className="text-gray-400 mb-6 max-w-2xl">Each focus area is backed by a certification held, not just claimed.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CAPABILITIES.map((cap) => {
                    const cert = certBy(cap.cert);
                    return (
                      <div
                        key={cap.cert}
                        className="flex gap-4 p-5 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm hover:border-red-500/60 transition-all"
                      >
                        {cert?.badgeSrc && (
                          <img
                            src={cert.badgeSrc}
                            alt={`${cert.name} badge`}
                            width={56}
                            height={56}
                            loading="lazy"
                            className="w-14 h-14 object-contain flex-shrink-0"
                          />
                        )}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-bold text-white">{cap.area}</h3>
                            <span className="font-mono text-[11px] text-red-400">{cap.cert}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 leading-relaxed">{cap.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Methodology */}
              <div className="mt-16">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">03 /</span> methodology
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">How I Work an Engagement</h2>
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
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Primary Arsenal</h2>
                <div className="relative scanlines rounded-lg overflow-hidden border border-red-500/40 bg-slate-950/80 backdrop-blur-sm p-6 font-mono text-sm">
                  {ARSENAL.map((row, i) => (
                    <div key={row.group} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-1">
                      <span className="text-slate-600">{i === ARSENAL.length - 1 ? "└──" : "├──"}</span>
                      <span className="text-red-400 w-28">{row.group}/</span>
                      <span className="text-slate-300">{row.tools.join("  ·  ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Walkthroughs */}
              <div className="mt-16">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">05 /</span> walkthroughs
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Machine & Challenge Write-ups</h2>
                <p className="text-gray-400 mb-6 max-w-2xl">
                  Detailed, reproducible attack chains from retired boxes and challenges.
                </p>
                {WALKTHROUGHS.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {WALKTHROUGHS.map((w) => {
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
                      return w.url ? (
                        <a
                          key={w.name}
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-5 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm hover:border-red-500/60 hover:bg-slate-900/60 transition-all"
                        >
                          {card}
                        </a>
                      ) : (
                        <div key={w.name} className="group p-5 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          {card}
                        </div>
                      );
                    })}
                  </div>
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
