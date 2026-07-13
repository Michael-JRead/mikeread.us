import { PROJECTS, SITE_META } from "@/data/siteContent";
import { Github, ExternalLink, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function PortfolioSection() {
  const reduced = useReducedMotion();

  return (
    <section id="portfolio" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader index="04" eyebrow="build" title="Featured Projects">
            Security-focused projects and tools designed to solve real-world challenges.
          </SectionHeader>

          {/* Projects — full-width feature rows */}
          <div className="space-y-8">
            {PROJECTS.map((project, index) => (
              <motion.article
                key={project.title}
                className="group relative overflow-hidden rounded-xl border border-red-500/30 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:border-red-500/60 hover:bg-slate-900/60 hover:shadow-[0_0_28px_rgba(239,68,68,0.12)]"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: reduced ? 0 : index * 0.08 }}
              >
                {/* Hover accent glow */}
                <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 -mr-20 -mt-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />

                <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 p-6 md:p-8">
                  {/* Left: identity, tags, links */}
                  <div className="lg:col-span-2 flex flex-col">
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-gray-400 leading-relaxed">{project.summary}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300 border border-red-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2.5 pt-6">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-slate-800 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/60 hover:bg-slate-700"
                        >
                          <Github size={16} />
                          {project.links ? "Repository" : "View Code"}
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:bg-red-500/40"
                        >
                          <ExternalLink size={16} />
                          Live Demo
                        </a>
                      )}
                      {project.links?.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-slate-800 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/60 hover:bg-slate-700"
                        >
                          <ExternalLink size={16} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Right: description + impact */}
                  <div className="lg:col-span-3 flex flex-col">
                    <p className="text-gray-300 leading-relaxed">{project.description}</p>
                    {project.impact && (
                      <div className="glass-readable-panel mt-5 flex gap-3 rounded-lg p-4">
                        <Zap size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-100 leading-relaxed">{project.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-red-400 border-opacity-50 hover:border-opacity-70 transition-all duration-300 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Want to see more?</h3>
            <p className="text-gray-400 mb-6">
              Explore my GitHub repository for additional security tools, automation scripts, and reference implementations.
            </p>
            <a
              href={SITE_META.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-readable-button inline-flex items-center gap-2 px-8 py-3 rounded-lg transition-all font-semibold hover:bg-red-500"
            >
              <Github size={20} />
              Visit GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
