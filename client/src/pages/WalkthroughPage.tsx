import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HackTheBoxIcon from "@/components/HackTheBoxIcon";
import NotFound from "@/pages/NotFound";
import { SITE_META } from "@/data/siteContent";
import { WALKTHROUGH_DOCS } from "@/data/walkthroughs";
import { Blocks } from "@/components/walkthrough/blocks";
import RichText from "@/components/walkthrough/RichText";

const OS_ICON: Record<string, string> = { Linux: "🐧", Windows: "🪟", Other: "🎯" };

export default function WalkthroughPage() {
  const params = useParams();
  const slug = params.slug ?? "";
  const doc = WALKTHROUGH_DOCS[slug];
  const [active, setActive] = useState<string>(doc?.sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

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

  if (!doc) return <NotFound />;

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
                        {s.title}
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
                      {s.title}
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
