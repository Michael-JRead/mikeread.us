import { useState } from "react";
import { CASE_STUDIES, type CaseStudyFormat } from "@/data/siteContent";
import { BookOpen, Filter, FileText, Presentation, ShieldCheck, ExternalLink } from "lucide-react";

const FORMAT_ICON: Record<CaseStudyFormat, typeof FileText> = {
  Report: FileText,
  Document: FileText,
  Presentation: Presentation,
  Policy: ShieldCheck,
};

export default function CaseStudiesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStudies = selectedCategory
    ? CASE_STUDIES.filter((study) => study.category === selectedCategory)
    : CASE_STUDIES;

  const studiesByCategory = CASE_STUDIES.reduce(
    (acc, study) => {
      if (!acc[study.category]) acc[study.category] = [];
      acc[study.category].push(study);
      return acc;
    },
    {} as Record<string, typeof CASE_STUDIES>,
  );

  const categoryOrder = Object.keys(studiesByCategory);

  return (
    <section id="case-studies" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-red-500" size={32} />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Case Studies
              </h2>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
            <p className="text-lg text-gray-400 mt-4 max-w-3xl">
              {CASE_STUDIES.length} published artifacts spanning threat modeling,
              security assessments, risk analysis, AWS architecture, digital
              forensics, and cryptography — drawn from academic research and
              professional engagements.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-red-500" />
              <span className="text-gray-300 font-semibold">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-red-700 bg-opacity-60 text-red-100 border border-red-300 border-opacity-60"
                    : "bg-slate-800 bg-opacity-70 text-gray-200 hover:bg-slate-700 border border-red-500 border-opacity-30 hover:border-opacity-50"
                }`}
              >
                All ({CASE_STUDIES.length})
              </button>
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-red-700 bg-opacity-60 text-red-100 border border-red-300 border-opacity-60"
                      : "bg-slate-800 bg-opacity-70 text-gray-200 hover:bg-slate-700 border border-red-500 border-opacity-30 hover:border-opacity-50"
                  }`}
                >
                  {category} ({studiesByCategory[category].length})
                </button>
              ))}
            </div>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudies.map((study, index) => {
              const Icon = FORMAT_ICON[study.format];
              return (
                <a
                  key={`${study.category}-${index}`}
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 transition-all duration-300 backdrop-blur-sm flex flex-col"
                >
                  {/* Header row: format icon + category chip */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-500 bg-opacity-15 border border-red-500 border-opacity-40 text-red-300 group-hover:text-red-200 group-hover:border-opacity-70 transition-all">
                      <Icon size={18} />
                    </div>
                    <span className="glass-readable-chip inline-block px-3 py-1 rounded-full text-xs font-bold">
                      {study.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-base leading-snug mb-3 group-hover:text-red-400 transition-colors">
                    {study.title}
                  </h3>

                  {/* Format + open affordance */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-red-500 border-opacity-20">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      {study.format}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-red-400 group-hover:text-red-300 font-medium">
                      Open
                      <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-red-400">
                {CASE_STUDIES.length}
              </div>
              <div className="text-gray-400 text-sm">Total Artifacts</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-red-400">
                {categoryOrder.length}
              </div>
              <div className="text-gray-400 text-sm">Domains Covered</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-red-400">
                {CASE_STUDIES.filter((s) => s.format === "Report").length}
              </div>
              <div className="text-gray-400 text-sm">Written Reports</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-red-400">
                {CASE_STUDIES.filter((s) => s.format === "Presentation").length}
              </div>
              <div className="text-gray-400 text-sm">Architecture Decks</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
