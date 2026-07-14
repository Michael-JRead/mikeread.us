import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Crosshair, Crown, ExternalLink, Flag, Server, Swords, Trophy } from "lucide-react";
import { SITE_META } from "@/data/siteContent";
import {
  activityIcon,
  CategoryBars,
  RankRing,
  StatTile,
  Terminal,
  useHtbStats,
} from "@/lib/htb";
import HackTheBoxIcon from "./HackTheBoxIcon";
import SectionHeader from "./SectionHeader";

const HtbSkillRadar = lazy(() => import("./HtbSkillRadar"));

export default function OffensiveSecuritySection() {
  const data = useHtbStats();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  // Ensures count-ups fire even when the section is already in view on load.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = inView || mounted;

  return (
    <section id="offensive-security" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto" ref={sectionRef}>
          <SectionHeader index="05" eyebrow="offensive security" title="Adversary Tradecraft">
            Hands-on offensive skills, sharpened on Hack The Box. Stats sync daily from my
            live profile.
          </SectionHeader>

          {data ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-3">
                  <Terminal data={data} active={active} />
                </div>
                <div className="lg:col-span-2 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm flex justify-center">
                  <RankRing
                    progress={data.profile.current_rank_progress ?? 0}
                    rank={data.profile.rank}
                    nextRank={data.profile.next_rank}
                    avatar={data.profile.avatar}
                    operator={data.profile.name}
                    active={active}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatTile icon={<Server size={22} />} label="User Owns" value={data.profile.user_owns} active={active} />
                <StatTile icon={<Crown size={22} />} label="System Owns" value={data.profile.system_owns} active={active} />
                <StatTile icon={<Trophy size={22} />} label="Global Ranking" value={data.profile.ranking ?? 0} prefix="#" active={active} />
                <StatTile icon={<Flag size={22} />} label="Challenges Solved" value={data.challenges?.solved ?? data.profile.respects} active={active} />
              </div>

              {data.challengeCategories && data.challengeCategories.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-2">
                      <Crosshair size={20} className="text-red-400" />
                      Skill Radar
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">Challenge category completion</p>
                    <Suspense fallback={<div className="h-[300px]" />}>
                      <HtbSkillRadar categories={data.challengeCategories} />
                    </Suspense>
                  </div>
                  <div className="lg:col-span-3 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Top Categories</h3>
                    <CategoryBars categories={data.challengeCategories} limit={6} />
                  </div>
                </div>
              )}

              {data.activity.length > 0 && (
                <div className="p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm">
                  <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                    <Swords size={20} className="text-red-400" />
                    Recent Pwns
                  </h3>
                  <ul className="divide-y divide-red-500/10">
                    {data.activity.slice(0, 5).map((item, i) => (
                      <li key={`${item.name}-${item.date}-${i}`} className="flex items-center gap-3 py-3">
                        {activityIcon(item)}
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-red-300 border border-red-500/30 capitalize">
                          {item.object_type === "machine" ? `${item.type} own` : item.type}
                        </span>
                        <span className="ml-auto text-red-400 font-mono text-sm">+{item.points}</span>
                        <span className="text-slate-500 text-sm w-28 text-right hidden sm:block">{item.date_diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm text-center">
              <div className="flex justify-center text-red-400 mb-4">
                <HackTheBoxIcon size={40} />
              </div>
              <p className="text-gray-300">
                Live Hack The Box stats are syncing — check back shortly or view the profile directly.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/offensive-security"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-red-600 text-white font-semibold transition-all hover:bg-red-500 shadow-lg shadow-red-600/40"
            >
              Explore the Operations Dossier
              <ArrowRight size={18} />
            </Link>
            <a
              href={SITE_META.social.hackthebox}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-readable-button inline-flex items-center gap-2 px-8 py-3 rounded-lg transition-all font-semibold hover:bg-red-500"
            >
              <HackTheBoxIcon size={20} />
              View HTB Profile
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
