import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import Footer from "@/components/Footer";
import MarkdownArticle from "@/components/MarkdownArticle";
import { getPost } from "@/content/blog";
import { formatPostDate } from "@/lib/blog";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    const prev = document.title;
    document.title = `${post.title} — Michael Read`;
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <SkipLink />
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <article className="pt-16 pb-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-red-300 transition-colors"
              >
                <ArrowLeft size={14} />
                cd ~/blog
              </Link>

              <header className="mt-8">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate-500">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                  {post.title}
                </h1>
                <div className="section-rule mt-5" />
                <p className="mt-5 text-lg leading-relaxed text-gray-200">{post.summary}</p>
                {post.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 font-mono text-[11px] text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="mt-12">
                <MarkdownArticle markdown={post.body} />
              </div>

              <footer className="mt-16 border-t border-slate-800 pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 font-mono text-sm text-red-300 hover:text-red-200 transition-colors"
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  All posts
                </Link>
              </footer>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
