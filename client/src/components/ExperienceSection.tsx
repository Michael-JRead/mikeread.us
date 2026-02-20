import { useState } from "react";
import { EXPERIENCES } from "@/data/siteContent";
import { ChevronDown } from "lucide-react";
import ScrambleText from "./ScrambleText";

export default function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <ScrambleText trigger="mount" speed={0.03}>
                Professional Experience
              </ScrambleText>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
            <p className="text-lg text-gray-400 mt-4">9 years of expertise in cybersecurity, cloud architecture, and security operations</p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-4">
            {EXPERIENCES.map((experience, index) => (
              <div
                key={index}
                className="border border-cyan-500 border-opacity-30 rounded-lg overflow-hidden hover:border-opacity-60 hover:bg-slate-800 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 bg-slate-900 bg-opacity-40 hover:bg-opacity-60 transition-all duration-300 flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{experience.role}</h3>
                      <span className="px-3 py-1 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-full text-sm font-semibold border border-cyan-500 border-opacity-40">
                        {experience.company}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-400 text-sm">
                      <span className="font-medium">{experience.period}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{experience.location}</span>
                    </div>
                    <p className="text-gray-300 mt-3">{experience.summary}</p>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-cyan-400 transition-transform ${
                      expandedIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {expandedIndex === index && (
                  <div className="px-6 pb-6 bg-gradient-to-b from-slate-800 to-slate-900 bg-opacity-50 border-t border-cyan-500 border-opacity-20">
                    {/* Detailed Description */}
                    {experience.details && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-cyan-300 mb-2">Overview</h4>
                        <p className="text-gray-300 leading-relaxed">{experience.details}</p>
                      </div>
                    )}

                    {/* Key Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-cyan-300 mb-3">Key Achievements</h4>
                      <ul className="space-y-2">
                        {experience.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex gap-3 text-gray-300">
                            <span className="text-cyan-400 font-bold flex-shrink-0">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold text-cyan-300 mb-3">Technologies & Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.tags.map((tag, tIndex) => (
                          <span
                            key={tIndex}
                            className="px-3 py-1 bg-slate-800 text-cyan-300 rounded-full text-sm font-medium hover:bg-slate-700 hover:text-cyan-200 transition-all duration-300 border border-cyan-500 border-opacity-30 hover:border-opacity-60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
