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
import { SITE_META } from "@/data/siteContent";
import { WALKTHROUGHS } from "@/data/walkthroughs";
import {
  CategoryBars,
  FreshnessStamp,
  RankRing,
  StatTile,
  Terminal,
  useHtbStats,
} from "@/lib/htb";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";

const HtbSkillRadar = lazy(() => import("@/components/HtbSkillRadar"));

type DifficultyFilter = "all" | "Easy" | "Medium" | "Hard" | "Insane";
type OsFilter = "all" | "Linux" | "Windows";

const DIFFICULTY_OPTIONS: DifficultyFilter[] = ["all", "Easy", "Medium", "Hard", "Insane"];
const OS_OPTIONS: OsFilter[] = ["all", "Linux", "Windows"];

export default function HackTheBox() {
  const data = useHtbStats();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("all");
  const [osFilter, setOsFilter] = useState<OsFilter>("all");

  useEffect(() => {
    setActive(true);
    const prev = document.title;
    document.title = "Hack The Box — Michael Read";
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
                  <span className="text-slate-500">//</span> live profile
                </p>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  Hack The Box
                </h1>
                <div className="section-rule mt-5" />
              </div>

              {data ? (
                <div className="space-y-16">
                  {/* Live ops panel */}
                  <div>
                    <p className="section-eyebrow mb-3">
                      <span className="text-slate-500">01 /</span> live ops
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                      Profile · Rank · Stats
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                      <div className="lg:col-span-3">
                        <Terminal
                          data={data}
                          active={active}
                          extraLines={[
                            `[+] points ....... ${data.profile.points}`,
                            ...(rankOwnership != null
                              ? [`[+] ownership .... ${rankOwnership}% rank owns`]
                              : []),
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

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <StatTile
                        icon={<Server size={22} />}
                        label="User Owns"
                        value={data.profile.user_owns}
                        active={active}
                      />
                      <StatTile
                        icon={<Crown size={22} />}
                        label="System Owns"
                        value={data.profile.system_owns}
                        active={active}
                      />
                      <StatTile
                        icon={<Trophy size={22} />}
                        label="Global Rank"
                        value={data.profile.ranking ?? 0}
                        prefix="#"
                        active={active}
                      />
                      <StatTile
                        icon={<Zap size={22} />}
                        label="Points"
                        value={data.profile.points}
                        active={active}
                      />
                      <StatTile
                        icon={<Flag size={22} />}
                        label="Challenges"
                        value={data.challenges?.solved ?? 0}
                        active={active}
                      />
                      <StatTile
                        icon={<Star size={22} />}
                        label="Rank Ownership"
                        value={Math.round(rankOwnership ?? 0)}
                        suffix="%"
                        active={active}
                      />
                    </div>

                    {data.profile.next_rank && (
                      <div className="mt-8 p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="font-mono uppercase tracking-widest text-red-300">
                            {data.profile.rank}
                          </span>
                          <span className="font-mono uppercase tracking-widest text-slate-500">
                            {data.profile.next_rank}
                          </span>
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
                  </div>

                  {/* Skill matrix */}
                  {data.challengeCategories && data.challengeCategories.length > 0 && (
                    <div>
                      <p className="section-eyebrow mb-3">
                        <span className="text-slate-500">02 /</span> skill matrix
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Challenge Category Coverage
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm">
                          <div className="flex items-center gap-2 mb-4 text-red-300">
                            <Crosshair size={18} />
                            <span className="font-mono text-xs uppercase tracking-widest">
                              all categories
                            </span>
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
                            <span className="font-mono text-xs uppercase tracking-widest">
                              completion by category
                            </span>
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
                    Live Hack The Box stats are syncing — check back shortly or view the
                    profile directly.
                  </p>
                </div>
              )}

              {/* Walkthroughs */}
              <div id="walkthroughs" className="mt-16 scroll-mt-24">
                <p className="section-eyebrow mb-3">
                  <span className="text-slate-500">03 /</span> walkthroughs
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  HTB Machine Write-ups
                </h2>
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
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-slate-500 mr-1">
                        OS
                      </span>
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
                              <h3 className="font-bold text-white group-hover:text-red-400 transition-colors">
                                {w.name}
                              </h3>
                              {w.difficulty && (
                                <span className="glass-readable-chip px-2.5 py-0.5 rounded-full text-xs font-bold">
                                  {w.difficulty}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                              {w.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-mono text-slate-500">{w.platform}</span>
                              {w.os && (
                                <span className="rounded bg-slate-800 px-2 py-0.5 text-red-300 border border-red-500/20">
                                  {w.os}
                                </span>
                              )}
                              {w.tags.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full bg-red-400/10 px-2.5 py-0.5 text-red-300"
                                >
                                  {t}
                                </span>
                              ))}
                              {w.date && (
                                <span className="ml-auto font-mono text-slate-500">
                                  {w.date}
                                </span>
                              )}
                            </div>
                          </>
                        );
                        const cardClass =
                          "group p-5 bg-slate-900/40 border border-red-500/30 rounded-lg backdrop-blur-sm hover:border-red-500/60 hover:bg-slate-900/60 transition-all";
                        return w.url ? (
                          <Link key={w.name} href={w.url} className={cardClass}>
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
                      <p className="text-gray-300 font-medium">
                        No walkthroughs match these filters.
                      </p>
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
