import { EDUCATION } from "@/data/siteContent";
import { BookOpen, Award } from "lucide-react";
import ScrambleText from "./ScrambleText";

export default function EducationSection() {
  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <ScrambleText trigger="mount" speed={0.03}>
                Education & Certifications
              </ScrambleText>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-6">
            {EDUCATION.map((edu, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-cyan-500 border-opacity-40 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-4 top-0 w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full border-4 border-slate-900 shadow-lg shadow-cyan-400/50"></div>

                {/* Content */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-lg border border-cyan-500 border-opacity-30 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                      <p className="text-cyan-300 font-semibold">{edu.institution}</p>
                      <p className="text-gray-400 text-sm mt-1">{edu.period}</p>
                    </div>
                  </div>

                  {/* Details */}
                  {edu.details.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {edu.details.map((detail, dIndex) => (
                        <li key={dIndex} className="flex gap-2 text-gray-300 text-sm">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications Summary */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-cyan-500 border-opacity-40 backdrop-blur-sm hover:border-opacity-60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Award size={28} className="text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Professional Certifications</h3>
            </div>
            <p className="text-gray-300 mb-4">
              I hold 15+ active industry certifications across cloud security, penetration testing, compliance, and security management.
            </p>
            <a
              href="#certifications"
              className="inline-block px-6 py-2 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-lg font-semibold hover:bg-opacity-40 transition-all duration-300 border border-cyan-500 border-opacity-40 hover:border-opacity-60"
            >
              View All Certifications →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
