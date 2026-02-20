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
    <section id="certifications" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Award className="text-blue-600" size={32} />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Certifications</h2>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <p className="text-lg text-gray-600 mt-4">
              15+ active industry certifications demonstrating expertise across cloud security, penetration testing, compliance, and security management.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-gray-600" />
              <span className="text-gray-700 font-semibold">Filter by Category:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  className="group p-6 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Badge */}
                  {categoryInfo && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${categoryInfo.color}`}>
                      {cert.category}
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{cert.issuer}</p>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">{cert.year}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        cert.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : cert.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
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
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{CERTIFICATIONS.length}</div>
              <div className="text-blue-100">Active Certifications</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">{Object.keys(certsByCategory).length}</div>
              <div className="text-purple-100">Certification Categories</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-lg">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-cyan-100">Current & Maintained</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
