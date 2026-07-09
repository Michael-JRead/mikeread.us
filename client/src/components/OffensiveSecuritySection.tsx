import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Crosshair, Crown, Droplet, ExternalLink, Flag, Server, Swords, Trophy } from "lucide-react";
import { SITE_META } from "@/data/siteContent";
import HackTheBoxIcon from "./HackTheBoxIcon";
import SectionHeader from "./SectionHeader";
import type { ChallengeCategory } from "./HtbSkillRadar";

const HtbSkillRadar = lazy(() => import("./HtbSkillRadar"));

interface HtbActivityItem {
  name: string;
  object_type: string;
  type: string;
  date: string;
  date_diff: string;
  points: number;
  first_blood: boolean;
}

interface HtbStats {
  fetchedAt: string;
  userId: number;
  profile: {
    name: string;
    avatar?: string | null;
    rank: string;
    ranking: number | null;
    points: number;
    user_owns: number;
    system_owns: number;
    user_bloods: number;
    system_bloods: number;
    respects: number;
    team: string | null;
    current_rank_progress: number | null;
    next_rank: string | null;
  };
  activity: HtbActivityItem[];
  challenges?: { solved: number; total: number };
  challengeCategories?: ChallengeCategory[];
}

function useCountUp(target: number, active: boolean, durationMs = 1600) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, reduced, durationMs]);

  return value;
}

function useTypedText(text: string, active: boolean, charMs = 45) {
  const [count, setCount] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, charMs);
    return () => clearInterval(interval);
  }, [text, active, reduced, charMs]);

  return { typed: text.slice(0, count), done: count >= text.length };
}

function StatTile({
  icon,
  label,
  value,
  prefix = "",
  active,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  active: boolean;
}) {
  const shown = useCountUp(value, active);
  return (
    <div className="p-5 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg hover:border-opacity-60 transition-all backdrop-blur-sm text-center">
      <div className="flex justify-center text-red-400 mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white tabular-nums">
        {prefix}
        {shown.toLocaleString()}
      </div>
      <div className="text-slate-400 mt-1 text-sm">{label}</div>
    </div>
  );
}

function RankRing({
  progress,
  rank,
  nextRank,
  avatar,
  operator,
  active,
}: {
  progress: number;
  rank: string;
  nextRank: string | null;
  avatar?: string | null;
  operator: string;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const shown = useCountUp(clamped, active);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgb(30 41 59)" strokeWidth="9" />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgb(239 68 68)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              active
                ? { strokeDashoffset: circumference * (1 - clamped / 100) }
                : { strokeDashoffset: circumference }
            }
            transition={reduced ? { duration: 0 } : { duration: 1.6, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 6px rgba(239,68,68,0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt={`${operator} on Hack The Box`}
              className="w-[6.5rem] h-[6.5rem] rounded-full object-cover border-2 border-slate-700"
            />
          ) : (
            <>
              <span className="text-3xl font-bold text-white tabular-nums">{shown}%</span>
              <span className="text-xs text-slate-400">to next rank</span>
            </>
          )}
        </div>
      </div>
      <div className="text-center">
        <div className="text-red-300 font-bold text-lg">{rank}</div>
        <div className="text-slate-400 text-sm">
          <span className="text-white font-semibold tabular-nums">{shown}%</span>
          {nextRank ? ` to ${nextRank}` : " to next rank"}
        </div>
      </div>
    </div>
  );
}

function Terminal({ data, active }: { data: HtbStats; active: boolean }) {
  const reduced = useReducedMotion();
  const command = `htb profile --user ${data.userId} --live`;
  const { typed, done } = useTypedText(command, active);
  const synced = new Date(data.fetchedAt);

  const lines = [
    `[+] auth ......... ok (app token, read-only)`,
    `[+] operator ..... ${data.profile.name}`,
    `[+] rank ......... ${data.profile.rank}`,
    `[+] global ....... #${(data.profile.ranking ?? 0).toLocaleString()}`,
    `[+] owns ......... ${data.profile.user_owns} user / ${data.profile.system_owns} root`,
    ...(data.challenges
      ? [`[+] challenges ... ${data.challenges.solved}/${data.challenges.total} solved`]
      : [`[+] respect ...... ${data.profile.respects}`]),
    `[+] last sync .... ${synced.toISOString().slice(0, 16).replace("T", " ")} UTC`,
  ];

  return (
    <div className="relative scanlines rounded-lg overflow-hidden border border-red-500 border-opacity-40 bg-slate-950 bg-opacity-80 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.15)]">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 bg-opacity-70 border-b border-red-500 border-opacity-20">
        <span className="w-3 h-3 rounded-full bg-slate-600" />
        <span className="w-3 h-3 rounded-full bg-slate-600" />
        <span className="w-3 h-3 rounded-full bg-slate-600" />
        <span className="ml-3 text-xs text-slate-400 font-mono">mr@mikeread:~/offsec — zsh</span>
        <span className="ml-auto text-[10px] font-mono tracking-widest text-red-400">▣ LIVE</span>
      </div>
      <div className="p-5 font-mono text-sm leading-7">
        <div className="text-emerald-300">
          <span className="text-red-400">$ </span>
          {typed}
          {!done && <span className="animate-pulse">▌</span>}
        </div>
        {done &&
          lines.map((line, i) => (
            <motion.div
              key={i}
              className="text-slate-300"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduced ? 0 : 0.25 + i * 0.18, duration: 0.3 }}
            >
              {line}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function activityIcon(item: HtbActivityItem) {
  if (item.first_blood) return <Droplet size={16} className="text-red-500" />;
  if (item.object_type === "machine") {
    return item.type === "root" ? (
      <Crown size={16} className="text-amber-400" />
    ) : (
      <Server size={16} className="text-red-300" />
    );
  }
  return <Flag size={16} className="text-red-300" />;
}

export default function OffensiveSecuritySection() {
  const [data, setData] = useState<HtbStats | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();

  useEffect(() => {
    fetch("/assets/htb-stats.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.profile && json.profile.rank) setData(json as HtbStats);
      })
      .catch(() => {});
  }, []);

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
                  <Terminal data={data} active={inView} />
                </div>
                <div className="lg:col-span-2 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm flex justify-center">
                  <RankRing
                    progress={data.profile.current_rank_progress ?? 0}
                    rank={data.profile.rank}
                    nextRank={data.profile.next_rank}
                    avatar={data.profile.avatar}
                    operator={data.profile.name}
                    active={inView}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatTile
                  icon={<Server size={22} />}
                  label="User Owns"
                  value={data.profile.user_owns}
                  active={inView}
                />
                <StatTile
                  icon={<Crown size={22} />}
                  label="System Owns"
                  value={data.profile.system_owns}
                  active={inView}
                />
                <StatTile
                  icon={<Trophy size={22} />}
                  label="Global Ranking"
                  value={data.profile.ranking ?? 0}
                  prefix="#"
                  active={inView}
                />
                <StatTile
                  icon={<Flag size={22} />}
                  label="Challenges Solved"
                  value={data.challenges?.solved ?? data.profile.respects}
                  active={inView}
                />
              </div>

              {data.challengeCategories && data.challengeCategories.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-2">
                      <Crosshair size={20} className="text-red-400" />
                      Skill Radar
                    </h3>
                    <p className="text-slate-400 text-sm mb-2">
                      Challenge category completion
                    </p>
                    <Suspense fallback={<div className="h-[300px]" />}>
                      <HtbSkillRadar categories={data.challengeCategories} />
                    </Suspense>
                  </div>
                  <div className="lg:col-span-3 p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Top Categories</h3>
                    <div className="space-y-4">
                      {[...data.challengeCategories]
                        .sort((a, b) => b.solved - a.solved)
                        .slice(0, 6)
                        .map((cat) => (
                          <div key={cat.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white font-medium">{cat.name}</span>
                              <span className="text-slate-400 font-mono">
                                {cat.solved}/{cat.total}
                                <span className="text-red-400 ml-2">
                                  {Math.round(cat.percentage)}%
                                </span>
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                                initial={reduced ? false : { width: 0 }}
                                whileInView={{ width: `${Math.max(2, cat.percentage)}%` }}
                                viewport={{ once: true }}
                                transition={
                                  reduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut" }
                                }
                              />
                            </div>
                          </div>
                        ))}
                    </div>
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
                    {data.activity.map((item, i) => (
                      <motion.li
                        key={`${item.name}-${item.date}-${i}`}
                        className="flex items-center gap-3 py-3"
                        initial={reduced ? false : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: reduced ? 0 : i * 0.08, duration: 0.35 }}
                      >
                        {activityIcon(item)}
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-slate-800 text-red-300 border border-red-500/30 capitalize">
                          {item.object_type === "machine" ? `${item.type} own` : item.type}
                        </span>
                        {item.first_blood && (
                          <span className="px-2 py-0.5 text-xs rounded bg-red-950 text-red-300 border border-red-500/50">
                            First Blood
                          </span>
                        )}
                        <span className="ml-auto text-red-400 font-mono text-sm">
                          +{item.points}
                        </span>
                        <span className="text-slate-500 text-sm w-28 text-right hidden sm:block">
                          {item.date_diff}
                        </span>
                      </motion.li>
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
                Live Hack The Box stats are syncing — check back shortly or view the profile
                directly.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href={SITE_META.social.hackthebox}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-readable-button inline-flex items-center gap-2 px-8 py-3 rounded-lg transition-all font-semibold hover:bg-red-500"
            >
              <HackTheBoxIcon size={20} />
              View Full HTB Profile
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
