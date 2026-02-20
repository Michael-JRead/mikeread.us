import { useState } from "react";
import { EXPERIENCES } from "@/data/siteContent";
import { ChevronDown } from "lucide-react";

export default function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Professional Experience</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <p className="text-lg text-gray-600 mt-4">9 years of expertise in cybersecurity, cloud architecture, and security operations</p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-4">
            {EXPERIENCES.map((experience, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 bg-white hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{experience.role}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {experience.company}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 text-sm">
                      <span className="font-medium">{experience.period}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{experience.location}</span>
                    </div>
                    <p className="text-gray-700 mt-3">{experience.summary}</p>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-gray-400 transition-transform ${
                      expandedIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {expandedIndex === index && (
                  <div className="px-6 pb-6 bg-gradient-to-b from-slate-50 to-white border-t border-gray-200">
                    {/* Detailed Description */}
                    {experience.details && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Overview</h4>
                        <p className="text-gray-700 leading-relaxed">{experience.details}</p>
                      </div>
                    )}

                    {/* Key Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                      <ul className="space-y-2">
                        {experience.highlights.map((highlight, hIndex) => (
                          <li key={hIndex} className="flex gap-3 text-gray-700">
                            <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Technologies & Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.tags.map((tag, tIndex) => (
                          <span
                            key={tIndex}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
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
