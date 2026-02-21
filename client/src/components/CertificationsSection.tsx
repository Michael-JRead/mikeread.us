import { useState } from "react";
import { CERTIFICATIONS, CERTIFICATION_CATEGORIES } from "@/data/siteContent";
import { Award, Filter } from "lucide-react";


export default function CertificationsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCerts = selectedCategory
    ? CERTIFICATIONS.filter((cert) => cert.category === selectedCategory)
    : CERTIFICATIONS;

  // Group certifications by category
  const certsByCategory = CERTIFICATIONS.reduce(
    (acc, cert) => {
      const category = cert.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(cert);
      return acc;
    },
    {} as Record<string, typeof CERTIFICATIONS>
  );

  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-red-500" size={32} />
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Certifications
              </h2>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
            <p className="text-lg text-gray-400 mt-4">
              15+ active industry certifications demonstrating expertise across cloud security, penetration testing, compliance, and security management.
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
                All ({CERTIFICATIONS.length})
              </button>
              {Object.keys(certsByCategory).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-red-700 bg-opacity-60 text-red-100 border border-red-300 border-opacity-60"
                      : "bg-slate-800 bg-opacity-70 text-gray-200 hover:bg-slate-700 border border-red-500 border-opacity-30 hover:border-opacity-50"
                  }`}
                >
                  {category} ({certsByCategory[category].length})
                </button>
              ))}
            </div>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert, index) => {
              const categoryInfo = CERTIFICATION_CATEGORIES.find((c) => c.name === cert.category);
              return (
                <div
                  key={index}
                  className="group p-6 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 transition-all duration-300 backdrop-blur-sm"
                >
                  {/* Badge */}
                  {categoryInfo && (
                    <div className="glass-readable-chip inline-block px-3 py-1 rounded-full text-xs font-bold mb-3">
                      {cert.category}
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="font-bold text-white text-sm leading-tight mb-2 group-hover:text-red-400 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{cert.issuer}</p>

                  {/* Status Badge */}
                  <div className="flex items-center justify-end">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        cert.status === "Active"
                          ? "bg-emerald-400 bg-opacity-20 text-emerald-100 border border-emerald-300 border-opacity-60 shadow-[0_0_14px_rgba(16,185,129,0.18)]"
                          : cert.status === "In Progress"
                            ? "bg-amber-400 bg-opacity-20 text-amber-100 border border-amber-300 border-opacity-55"
                            : "bg-slate-700 text-gray-400 border border-slate-600"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">{CERTIFICATIONS.length}</div>
              <div className="text-gray-400">Active Certifications</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">{Object.keys(certsByCategory).length}</div>
              <div className="text-gray-400">Certification Categories</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">100%</div>
              <div className="text-gray-400">Current & Maintained</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
