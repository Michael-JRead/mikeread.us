import { PROJECTS } from "@/data/siteContent";
import { Github, ExternalLink, Zap } from "lucide-react";
import ScrambleText from "./ScrambleText";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <ScrambleText trigger="mount" speed={0.05}>
                Featured Projects
              </ScrambleText>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <p className="text-lg text-gray-600 mt-4">Security-focused projects and tools designed to solve real-world challenges</p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, index) => (
              <div
                key={index}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{project.summary}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow">
                    {project.description}
                  </p>

                  {/* Impact */}
                  {project.impact && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
                      <Zap size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-900">{project.impact}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag, tIndex) => (
                      <span
                        key={tIndex}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-blue-100 hover:text-blue-600 transition-colors font-medium text-sm"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
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
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Want to see more?</h3>
            <p className="text-blue-100 mb-6">
              Explore my GitHub repository for additional security tools, automation scripts, and reference implementations.
            </p>
            <a
              href="https://github.com/Michael-JRead/MichaelJRead"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
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
