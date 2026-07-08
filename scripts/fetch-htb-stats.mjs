// Fetches the owner's Hack The Box profile via the v4 API and writes a single
// static snapshot consumed by OffensiveSecuritySection. Intentionally overwrites
// one file (no history) and only touches the owner's own profile, keeping the
// integration inside HTB's acceptable-use guidance.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const USER_ID = 1704613;
const OUT_FILE = resolve("client/public/assets/htb-stats.json");
// All three hosts serve the v4 API; try them in order in case one is fronted differently.
const API_HOSTS = [
  "https://labs.hackthebox.com/api/v4",
  "https://www.hackthebox.com/api/v4",
  "https://app.hackthebox.com/api/v4",
];

const token = process.env.HTB_APP_TOKEN;
if (!token) {
  console.error("HTB_APP_TOKEN is not set. Add it as a GitHub Actions secret.");
  process.exit(1);
}

async function apiGet(base, path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${base}/${path}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "User-Agent": "mikeread.us portfolio stats (owner profile snapshot, daily)",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function apiGetAnyHost(path) {
  let lastErr;
  for (const base of API_HOSTS) {
    try {
      return await apiGet(base, path);
    } catch (err) {
      lastErr = err;
      console.warn(`Fetch failed on ${base}: ${err.message}`);
    }
  }
  throw lastErr;
}

async function tryOptional(label, path) {
  try {
    const json = await apiGetAnyHost(path);
    // Log a trimmed raw response so the endpoint shape can be inspected in CI logs.
    console.log(`[optional] ${label}: ${JSON.stringify(json).slice(0, 1500)}`);
    return json;
  } catch (err) {
    console.warn(`[optional] ${label} unavailable: ${err.message}`);
    return null;
  }
}

const basic = await apiGetAnyHost(`user/profile/basic/${USER_ID}`);
const profile = basic?.profile;
if (!profile || !profile.rank) {
  console.error("Unexpected basic-profile payload; refusing to write snapshot.");
  console.error(JSON.stringify(basic).slice(0, 1500));
  process.exit(1);
}

let activity = [];
try {
  const act = await apiGetAnyHost(`user/profile/activity/${USER_ID}`);
  activity = (act?.profile?.activity ?? []).slice(0, 8).map((a) => ({
    name: a.name,
    object_type: a.object_type,
    type: a.type,
    date: a.date,
    date_diff: a.date_diff,
    points: a.points,
    first_blood: Boolean(a.first_blood),
  }));
} catch (err) {
  console.warn(`Activity feed unavailable: ${err.message}`);
}

// Best-effort extras; shapes are inspected from CI logs before the UI consumes them.
const challengeProgress = await tryOptional(
  "challenge progress",
  `user/profile/progress/challenges/${USER_ID}`
);
const machineProgress = await tryOptional(
  "machine os progress",
  `user/profile/progress/machines/os/${USER_ID}`
);

let challengeCategories = null;
const challengeRows = challengeProgress?.profile?.challenge_owns ?? challengeProgress?.profile;
if (Array.isArray(challengeRows)) {
  const rows = challengeRows
    .filter((c) => c && c.name && (c.owned ?? c.solved ?? c.owns) !== undefined)
    .map((c) => ({
      name: c.name,
      solved: Number(c.owned ?? c.solved ?? c.owns ?? 0),
      total: Number(c.total ?? 0),
    }));
  if (rows.length >= 3) challengeCategories = rows;
}

const snapshot = {
  fetchedAt: new Date().toISOString(),
  userId: USER_ID,
  profile: {
    name: profile.name,
    avatar: profile.avatar ?? null,
    rank: profile.rank,
    ranking: profile.ranking ?? null,
    points: profile.points ?? 0,
    user_owns: profile.user_owns ?? 0,
    system_owns: profile.system_owns ?? 0,
    user_bloods: profile.user_bloods ?? 0,
    system_bloods: profile.system_bloods ?? 0,
    respects: profile.respects ?? 0,
    team: profile.team?.name ?? null,
    current_rank_progress: profile.current_rank_progress ?? null,
    next_rank: profile.next_rank ?? null,
    next_rank_points: profile.next_rank_points ?? null,
    rank_ownership: profile.rank_ownership ?? null,
    rank_requirement: profile.rank_requirement ?? null,
  },
  activity,
  ...(challengeCategories ? { challengeCategories } : {}),
  ...(machineProgress?.profile ? { machineOs: machineProgress.profile } : {}),
};

writeFileSync(OUT_FILE, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Wrote ${OUT_FILE}: rank=${profile.rank}, ranking=#${profile.ranking}, owns=${profile.user_owns}/${profile.system_owns}`);
