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

const token = process.env.HTB_APP_TOKEN?.trim();
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

// The documented activity path started returning 404 in 2026; probe known
// variants and use whichever answers with an activity array.
let activity = [];
const activityPaths = [
  `user/profile/activity/${USER_ID}`,
  `user/profile/activity/${USER_ID}?n=20`,
  `profile/activity/${USER_ID}`,
];
for (const path of activityPaths) {
  try {
    const act = await apiGetAnyHost(path);
    const rows = act?.profile?.activity ?? act?.activity;
    if (Array.isArray(rows)) {
      activity = rows.slice(0, 8).map((a) => ({
        name: a.name,
        object_type: a.object_type,
        type: a.type,
        date: a.date,
        date_diff: a.date_diff,
        points: a.points,
        first_blood: Boolean(a.first_blood),
      }));
      console.log(`Activity feed served by ${path} (${rows.length} entries)`);
      break;
    }
  } catch (err) {
    console.warn(`Activity path ${path} unavailable: ${err.message}`);
  }
}

// Best-effort extras; shapes are inspected from CI logs before the UI consumes them.
const challengeProgress = await tryOptional(
  "challenge progress",
  `user/profile/progress/challenges/${USER_ID}`
);
await tryOptional("attack chart", `user/profile/chart/machines/attack/${USER_ID}`);
await tryOptional("graph 1y", `user/profile/graph/1y/${USER_ID}`);

// Observed shape: profile.challenge_owns {solved,total,percentage} plus
// profile.challenge_categories [{name, owned_flags, total_flags, completion_percentage}].
let challenges = null;
let challengeCategories = null;
const owns = challengeProgress?.profile?.challenge_owns;
if (owns && typeof owns.solved === "number") {
  challenges = { solved: owns.solved, total: owns.total ?? 0 };
}
const catRows = challengeProgress?.profile?.challenge_categories;
if (Array.isArray(catRows) && catRows.length >= 3) {
  challengeCategories = catRows.map((c) => ({
    name: c.name,
    solved: Number(c.owned_flags ?? 0),
    total: Number(c.total_flags ?? 0),
    percentage: Number(c.completion_percentage ?? 0),
  }));
}

// Mirror the avatar into the site's own assets so the page never hotlinks
// HTB's storage; fall back to the remote URL if the download fails.
let avatarSrc = profile.avatar ?? null;
if (avatarSrc) {
  try {
    const remote = avatarSrc.startsWith("/")
      ? `https://labs.hackthebox.com${avatarSrc}`
      : avatarSrc;
    const res = await fetch(remote, {
      headers: { "User-Agent": "mikeread.us portfolio stats (owner avatar mirror, daily)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) throw new Error(`unexpected content-type ${type}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 100) throw new Error("suspiciously small image");
    writeFileSync(resolve("client/public/assets/htb-avatar.png"), buf);
    avatarSrc = "/assets/htb-avatar.png";
    console.log(`Mirrored avatar locally (${buf.length} bytes)`);
  } catch (err) {
    console.warn(`Avatar mirror failed, keeping remote URL: ${err.message}`);
  }
}

const snapshot = {
  fetchedAt: new Date().toISOString(),
  userId: USER_ID,
  profile: {
    name: profile.name,
    avatar: avatarSrc,
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
  ...(challenges ? { challenges } : {}),
  ...(challengeCategories ? { challengeCategories } : {}),
};

writeFileSync(OUT_FILE, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Wrote ${OUT_FILE}: rank=${profile.rank}, ranking=#${profile.ranking}, owns=${profile.user_owns}/${profile.system_owns}`);
