import { PROJECTS } from "@/data/siteContent";
import { Github, ExternalLink, Zap } from "lucide-react";


export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
            <p className="text-lg text-gray-400 mt-4">Security-focused projects and tools designed to solve real-world challenges</p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, index) => (
              <div
                key={index}
                className="group relative bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg overflow-hidden hover:border-opacity-60 hover:bg-opacity-60 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500 to-red-700 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"></div>

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{project.summary}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Impact */}
                  {project.impact && (
                    <div className="glass-readable-panel mb-4 p-3 rounded-lg flex gap-2">
                      <Zap size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-100">{project.impact}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-1 bg-slate-800 text-red-400 rounded text-xs font-medium border border-red-500 border-opacity-30 hover:border-opacity-60 transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-red-500 border-opacity-20">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-red-400 rounded hover:bg-slate-700 hover:text-red-300 transition-all font-medium text-sm border border-red-500 border-opacity-30 hover:border-opacity-60"
                      >
                        <Github size={16} />
                        View Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-400 rounded hover:bg-opacity-40 transition-all font-medium text-sm border border-red-500 border-opacity-40 hover:border-opacity-60"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-red-400 border-opacity-50 hover:border-opacity-70 transition-all duration-300 text-center backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Want to see more?</h3>
            <p className="text-gray-400 mb-6">
              Explore my GitHub repository for additional security tools, automation scripts, and reference implementations.
            </p>
            <a
              href="https://github.com/Michael-JRead/MichaelJRead"
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
