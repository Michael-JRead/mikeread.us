import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Rss } from "lucide-react";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";
import { POSTS } from "@/content/blog";
import { formatPostDate } from "@/lib/blog";

export default function Blog() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Blog — Michael Read";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <SkipLink />
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="pt-16 pb-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-red-300 transition-colors"
              >
                <ArrowLeft size={14} />
                cd ~/portfolio
              </Link>

              <p className="section-eyebrow mt-8 mb-3">
                <span className="text-slate-500">//</span> writing
              </p>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Blog</h1>
                <a
                  href="/rss.xml"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-red-300 transition-colors"
                >
                  <Rss size={13} aria-hidden="true" />
                  RSS
                </a>
              </div>
              <div className="section-rule mt-5" />
              <p className="mt-5 text-lg text-gray-300 leading-relaxed">
                Notes on vulnerability research, disclosure, and the security work behind the CVEs.
              </p>

              {POSTS.length === 0 ? (
                <p className="mt-14 font-mono text-sm text-slate-500">No posts yet.</p>
              ) : (
                <ul className="mt-12 divide-y divide-slate-800/80 border-y border-slate-800/80">
                  {POSTS.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block py-8 transition-colors"
                      >
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate-500">
                          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                          <span aria-hidden="true">·</span>
                          <span>{post.readingMinutes} min read</span>
                        </div>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-red-300">
                          {post.title}
                        </h2>
                        <p className="mt-3 leading-relaxed text-gray-400">{post.summary}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 font-mono text-[11px] text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                          <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-red-400 opacity-80 transition-all group-hover:translate-x-0.5 group-hover:opacity-100">
                            Read <ArrowRight size={13} aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
