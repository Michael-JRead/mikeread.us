import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink, Loader2, Lock, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import NotFound from "@/pages/NotFound";
import { SITE_META } from "@/data/siteContent";
import { WALKTHROUGH_LOADERS, WALKTHROUGH_SUMMARIES, type WalkthroughDoc } from "@/data/walkthroughs";
import { Blocks } from "@/components/walkthrough/blocks";
import RichText from "@/components/walkthrough/RichText";

// Compute SHA-256 of the input string as a lowercase hex digest using the
// browser-native Web Crypto API — no external deps. Used to validate the
// user-provided flag against the gateHash baked into WalkthroughSummary.
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const OS_ICON: Record<string, string> = { Linux: "🐧", Windows: "🪟", Other: "🎯" };

// Section titles may carry inline-markdown tokens from transcription; headings and
// the TOC render as plain text, so strip them there.
function plainText(t: string): string {
  return t
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export default function WalkthroughPage() {
  const params = useParams();
  const slug = params.slug ?? "";
  const [doc, setDoc] = useState<WalkthroughDoc | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [active, setActive] = useState<string>("");
  const [progress, setProgress] = useState(0);

  // Locked-box gate state. When a box hasn't retired yet, its summary carries a
  // gateHash and the full doc is withheld until the visitor enters the matching
  // flag. Once unlocked in a tab, sessionStorage remembers so re-navigation
  // inside the same tab doesn't re-prompt.
  const summary = useMemo(
    () => WALKTHROUGH_SUMMARIES.find((s) => s.slug === slug),
    [slug]
  );
  const locked = Boolean(summary?.gateHash);
  const sessionKey = `walkthrough_unlock_${slug}`;
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (!locked) return true;
    try {
      return sessionStorage.getItem(sessionKey) === "1";
    } catch {
      return false;
    }
  });
  const [flagInput, setFlagInput] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const submitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary?.gateHash) return;
    setChecking(true);
    setGateError(null);
    try {
      const provided = flagInput.trim();
      if (!provided) {
        setGateError("Enter the box's user.txt flag to continue.");
        return;
      }
      const digest = await sha256Hex(provided);
      if (digest === summary.gateHash.toLowerCase()) {
        try {
          sessionStorage.setItem(sessionKey, "1");
        } catch {
          /* private-mode fallback: session-only unlock */
        }
        setUnlocked(true);
        setFlagInput("");
      } else {
        setGateError("Flag mismatch — that isn't user.txt for this box.");
      }
    } finally {
      setChecking(false);
    }
  };

  // Lazy-load the box's full write-up chunk only once the visitor has cleared
  // the gate (or the box was never gated).
  useEffect(() => {
    const loader = WALKTHROUGH_LOADERS[slug];
    if (!loader) {
      setStatus("missing");
      return;
    }
    if (!unlocked) {
      setStatus("loading");
      setDoc(null);
      return;
    }
    let cancelled = false;
    setStatus("loading");
    setDoc(null);
    window.scrollTo(0, 0);
    loader()
      .then((d) => {
        if (cancelled) return;
        setDoc(d);
        setActive(d.sections[0]?.id ?? "");
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [slug, unlocked]);

  useEffect(() => {
    if (!doc) return;
    const prev = document.title;
    document.title = `${doc.name} — HTB Walkthrough — Michael Read`;
    return () => {
      document.title = prev;
    };
  }, [doc]);

  useEffect(() => {
    if (!doc) return;
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    doc.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, [doc]);

  if (status === "missing") return <NotFound />;

  // Locked-box flag gate — rendered in place of the doc when the visitor has
  // not yet cleared the box's user.txt check.
  if (locked && !unlocked && summary) {
    return (
      <div className="page-gradient min-h-screen flex flex-col">
        <div className="site-grid" aria-hidden="true" />
        <div className="site-grain" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg">
            <Link
              href="/offensive-security#walkthroughs"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-red-300 transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              cd ~/offensive-security/walkthroughs
            </Link>
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900/70 backdrop-blur-sm p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                  <Lock size={20} className="text-amber-300" />
                </div>
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-amber-300">
                    Active box · locked
                  </p>
                  <h1 className="text-2xl font-bold text-white">{summary.name}</h1>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-slate-900/60 px-3 py-1 text-sky-300">
                  {OS_ICON[summary.os]} {summary.os}
                </span>
                <span className="rounded-full border border-red-500/50 bg-slate-900/60 px-3 py-1 text-red-300">
                  🔥 {summary.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Following Hack The Box's disclosure policy, walkthroughs for machines
                that haven't retired yet are gated behind proof of ownership. Enter the
                box's <code className="font-mono text-red-300 bg-slate-800/70 border border-slate-700/70 rounded px-1.5 py-0.5">user.txt</code> flag
                below to unlock the full write-up.
              </p>
              <form onSubmit={submitFlag} className="space-y-3">
                <label htmlFor="flag" className="sr-only">
                  user.txt flag
                </label>
                <input
                  id="flag"
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                  value={flagInput}
                  onChange={(e) => {
                    setFlagInput(e.target.value);
                    if (gateError) setGateError(null);
                  }}
                  placeholder="user.txt (32 hex chars)"
                  className="w-full min-h-[44px] font-mono text-sm bg-slate-950/70 text-slate-100 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20"
                />
                {gateError && (
                  <div className="flex items-start gap-2 text-sm text-red-300">
                    <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                    <span>{gateError}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={checking || flagInput.trim().length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-amber-500/90 text-slate-950 font-semibold transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checking ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  {checking ? "Verifying…" : "Unlock walkthrough"}
                </button>
              </form>
              <p className="mt-4 text-[0.72rem] leading-snug text-slate-500">
                Verification runs entirely in your browser via SHA-256 — the flag never
                leaves this device. Access persists for this browser tab only.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (status === "loading" || !doc) {
    return (
      <div className="page-gradient min-h-screen flex flex-col">
        <div className="site-grid" aria-hidden="true" />
        <div className="site-grain" aria-hidden="true" />
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 font-mono text-sm text-slate-400">
            <Loader2 size={18} className="animate-spin text-red-400" />
            loading walkthrough…
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />

      {/* scroll progress */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[60] bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.6)]"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-16 pb-10 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Link
                href="/offensive-security#walkthroughs"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-red-300 transition-colors"
              >
                <ArrowLeft size={14} />
                cd ~/offensive-security/walkthroughs
              </Link>

              <p className="section-eyebrow mt-8 mb-3">
                <span className="text-slate-500">//</span> {doc.platform} · Machine Walkthrough
              </p>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{doc.name}</h1>
              <div className="section-rule mt-5" />
              <p className="mt-5 text-lg text-gray-200 max-w-3xl leading-relaxed">
                <RichText text={doc.lede} />
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-slate-900/60 px-3 py-1 text-sky-300">
                  {OS_ICON[doc.os]} {doc.os}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/50 bg-slate-900/60 px-3 py-1 text-red-300">
                  🔥 {doc.difficulty}
                </span>
                {doc.ip && (
                  <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-slate-300">
                    🎯 {doc.ip}
                  </span>
                )}
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-slate-400">
                  retired {doc.retired}
                </span>
                {doc.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-purple-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Body: TOC + article */}
        <section className="pb-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10">
              {/* TOC */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
                  <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-slate-500 mb-3 pl-3">
                    Contents
                  </p>
                  <nav className="space-y-0.5">
                    {doc.sections.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className={`block pl-3 pr-2 py-1.5 text-sm leading-tight border-l-2 transition-colors ${
                          active === s.id
                            ? "border-red-500 text-red-300 bg-gradient-to-r from-red-500/10 to-transparent"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="font-mono text-[0.78rem] text-slate-600 mr-2">{s.num}</span>
                        {plainText(s.title)}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Article */}
              <article className="min-w-0">
                {doc.sections.map((s) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-24 mb-4 pt-8 border-t border-slate-800 first:border-t-0 first:pt-0"
                  >
                    <h2 className="flex items-baseline gap-3.5 text-2xl md:text-3xl font-bold text-white mb-1">
                      <span className="font-mono text-base text-red-400 border border-slate-700 rounded-lg px-2.5 py-0.5 bg-slate-900">
                        {s.num}
                      </span>
                      {plainText(s.title)}
                    </h2>
                    <Blocks blocks={s.blocks} />
                  </section>
                ))}

                {/* CTA */}
                <div className="mt-14 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-800 pt-10">
                  <a
                    href={SITE_META.social.hackthebox}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold transition-all hover:bg-red-500 shadow-lg shadow-red-600/40"
                  >
                    <HackTheBoxIcon size={18} />
                    View HTB Profile
                    <ExternalLink size={15} />
                  </a>
                  <Link
                    href="/offensive-security#walkthroughs"
                    className="glass-readable-button inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-semibold hover:bg-red-500"
                  >
                    <ArrowLeft size={16} />
                    All walkthroughs
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
