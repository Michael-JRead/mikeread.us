import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Droplet, Flag, Server } from "lucide-react";

export interface ChallengeCategory {
  name: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface HtbActivityItem {
  name: string;
  object_type: string;
  type: string;
  date: string;
  date_diff: string;
  points: number;
  first_blood: boolean;
}

export interface HtbStats {
  fetchedAt: string;
  generatedAt?: string;
  commit?: string;
  runUrl?: string;
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
    next_rank_points?: number | null;
    rank_ownership?: number | null;
  };
  activity: HtbActivityItem[];
  challenges?: { solved: number; total: number };
  challengeCategories?: ChallengeCategory[];
}

/** Loads the daily-synced HTB snapshot; null until (and unless) it loads. */
export function useHtbStats() {
  const [data, setData] = useState<HtbStats | null>(null);
  useEffect(() => {
    fetch("/assets/htb-stats.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.profile && json.profile.rank) setData(json as HtbStats);
      })
      .catch(() => {});
  }, []);
  return data;
}

export function useCountUp(target: number, active: boolean, durationMs = 1600) {
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

export function useTypedText(text: string, active: boolean, charMs = 45) {
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

export function StatTile({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  active,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
}) {
  const shown = useCountUp(value, active);
  return (
    <div className="p-5 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg hover:border-opacity-60 transition-all backdrop-blur-sm text-center">
      <div className="flex justify-center text-red-400 mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white tabular-nums">
        {prefix}
        {shown.toLocaleString()}
        {suffix}
      </div>
      <div className="text-slate-400 mt-1 text-sm">{label}</div>
    </div>
  );
}

export function RankRing({
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

export function Terminal({
  data,
  active,
  extraLines,
}: {
  data: HtbStats;
  active: boolean;
  extraLines?: string[];
}) {
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
    ...(extraLines ?? []),
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
              className="text-slate-300 whitespace-pre-wrap break-words"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduced ? 0 : 0.25 + i * 0.14, duration: 0.3 }}
            >
              {line}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

/** Provenance strip: how fresh the data is and where it came from. */
export function FreshnessStamp({ data }: { data: HtbStats }) {
  const iso = data.generatedAt ?? data.fetchedAt;
  const ts = new Date(iso).getTime();
  const ageH = (Date.now() - ts) / 3_600_000;
  const rel =
    ageH < 1 ? "under an hour ago" : ageH < 48 ? `${Math.round(ageH)}h ago` : `${Math.round(ageH / 24)}d ago`;
  const fresh = ageH < 48;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-slate-500">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        {fresh && <span className="motion-reduce:hidden absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${fresh ? "bg-emerald-400" : "bg-amber-400"}`} />
      </span>
      <span>synced {rel}</span>
      <span className="text-slate-700">·</span>
      <span>source: HTB v4 API</span>
      {data.commit && (
        <>
          <span className="text-slate-700">·</span>
          {data.runUrl ? (
            <a href={data.runUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
              build {data.commit}
            </a>
          ) : (
            <span>build {data.commit}</span>
          )}
        </>
      )}
    </div>
  );
}

export function activityIcon(item: HtbActivityItem) {
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

/** Ranked challenge-category progress bars. `limit` caps how many show. */
export function CategoryBars({
  categories,
  limit,
}: {
  categories: ChallengeCategory[];
  limit?: number;
}) {
  const reduced = useReducedMotion();
  const rows = [...categories].sort((a, b) => b.solved - a.solved).slice(0, limit ?? categories.length);
  return (
    <div className="space-y-4">
      {rows.map((cat) => (
        <div key={cat.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white font-medium">{cat.name}</span>
            <span className="text-slate-400 font-mono tabular-nums">
              {cat.solved}/{cat.total}
              <span className="text-red-400 ml-2">{Math.round(cat.percentage)}%</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
              initial={reduced ? false : { width: 0 }}
              whileInView={{ width: `${Math.max(2, cat.percentage)}%` }}
              viewport={{ once: true }}
              transition={reduced ? { duration: 0 } : { duration: 1.2, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
