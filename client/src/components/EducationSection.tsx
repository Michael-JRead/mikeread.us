import { EDUCATION } from "@/data/siteContent";
import { BookOpen, Award } from "lucide-react";

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Education & Certifications</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-6">
            {EDUCATION.map((edu, index) => (
              <div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-blue-200 last:pb-0"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-4 top-0 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>

                {/* Content */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3 mb-3">
                    <BookOpen className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600 font-semibold">{edu.institution}</p>
                      <p className="text-gray-600 text-sm mt-1">{edu.period}</p>
                    </div>
                  </div>

                  {/* Details */}
                  {edu.details.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {edu.details.map((detail, dIndex) => (
                        <li key={dIndex} className="flex gap-2 text-gray-700 text-sm">
                          <span className="text-blue-600 font-bold">•</span>
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
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award size={28} />
              <h3 className="text-2xl font-bold">Professional Certifications</h3>
            </div>
            <p className="text-blue-100 mb-4">
              I hold 15+ active industry certifications across cloud security, penetration testing, compliance, and security management.
            </p>
            <a
              href="#certifications"
              className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              View All Certifications →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
