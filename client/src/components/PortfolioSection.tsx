import { Link } from "wouter";
import { PROJECTS, ENGAGED_PROJECTS, SITE_META, type EngagedProject } from "@/data/siteContent";
import { VENDOR_LOGOS } from "@/components/VendorLogos";
import { Github, ExternalLink, Zap, Boxes, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

// A project's mark: its real logo where one exists, otherwise a brand-tinted
// monogram — so the grid stays uniform across projects without a stock icon.
function ProjectMark({ project }: { project: EngagedProject }) {
  const Logo = VENDOR_LOGOS[project.key];
  return (
    <div
      className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center border border-slate-700/60 bg-slate-950/80"
      aria-hidden="true"
    >
      {Logo ? (
        <Logo className="w-7 h-7" style={{ color: project.brand }} />
      ) : (
        <span className="font-mono font-bold text-base" style={{ color: project.brand }}>
          {project.mono ?? project.name.charAt(0)}
        </span>
      )}
    </div>
  );
}

// "Merged fixes · CVE" is a public win (emerald); everything else is the neutral
// research label (red) that discloses nothing about the underlying finding.
function roleChipClass(role: string): string {
  return role.includes("CVE") || role.includes("Merged")
    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
    : "border-red-500/25 bg-red-500/10 text-red-300";
}

function EngagedProjectCard({ project }: { project: EngagedProject }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-red-500/20 bg-slate-900/40 p-5 backdrop-blur-sm transition-all hover:border-red-500/50 hover:bg-slate-900/60"
    >
      <div className="flex items-start gap-3">
        <ProjectMark project={project} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate font-semibold text-white leading-tight transition-colors group-hover:text-red-300">
              {project.name}
            </h4>
            <ExternalLink size={12} className="shrink-0 text-slate-500 group-hover:text-red-300" aria-hidden="true" />
          </div>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
            {project.org}
          </p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{project.blurb}</p>
      <span
        className={`mt-auto self-start inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${roleChipClass(project.role)}`}
      >
        {project.role}
      </span>
    </a>
  );
}

export default function PortfolioSection() {
  const reduced = useReducedMotion();
  const authored = PROJECTS;

  return (
    <section id="portfolio" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader index="04" eyebrow="build" title="Featured Projects">
            A security tool I built, and the upstream open-source projects I contribute security research to.
          </SectionHeader>

          {/* Authored tools */}
          {authored.map((project, index) => (
            <motion.article
              key={project.title}
              className="group relative overflow-hidden rounded-xl border border-red-500/30 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-500/60 hover:bg-slate-900/60 hover:shadow-[0_0_28px_rgba(239,68,68,0.12)]"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: reduced ? 0 : index * 0.08 }}
            >
              <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 -mr-20 -mt-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20" />
              <div className="relative">
                <div className="flex flex-wrap items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-900/40">
                    <Boxes size={26} className="text-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-red-400">
                        {project.title}
                      </h3>
                      <span className="inline-flex items-center rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-300">
                        Authored
                      </span>
                    </div>
                    <p className="mt-2 text-gray-400 leading-relaxed">{project.summary}</p>
                  </div>
                </div>

                <p className="mt-5 text-gray-300 leading-relaxed">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-red-500/20 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.impact && (
                  <div className="glass-readable-panel mt-5 flex gap-3 rounded-lg p-4">
                    <Zap size={18} className="mt-0.5 flex-shrink-0 text-red-400" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-red-100">{project.impact}</p>
                  </div>
                )}

                {project.githubUrl && (
                  <div className="mt-6">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-slate-800 px-4 py-2 text-sm font-medium text-red-300 transition-all hover:border-red-500/60 hover:bg-slate-700"
                    >
                      <Github size={16} />
                      Repository
                    </a>
                  </div>
                )}
              </div>
            </motion.article>
          ))}

          {/* Open-source security research */}
          <div className="mt-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Open-Source Security Research</h3>
                <p className="mt-1 text-gray-400 max-w-2xl">
                  Coordinated disclosure across the Java, messaging, and identity ecosystem.
                </p>
              </div>
              <Link
                href="/offensive-security"
                className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-wider text-red-300 transition-colors hover:text-red-200"
              >
                See the disclosure record
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ENGAGED_PROJECTS.map((project, index) => (
                <motion.div
                  key={project.key}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: reduced ? 0 : Math.min(index, 8) * 0.05 }}
                >
                  <EngagedProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-red-400 border-opacity-50 hover:border-opacity-70 transition-all duration-300 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Want to see more?</h3>
            <p className="text-gray-400 mb-6">
              Explore my GitHub for additional security tools, automation scripts, and reference implementations.
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
