import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CERTIFICATIONS, type CertificationItem } from "@/data/siteContent";
import { Award, Filter } from "lucide-react";
import SectionHeader from "./SectionHeader";

const ORGS = CERTIFICATIONS.reduce<string[]>((acc, cert) => {
  if (!acc.includes(cert.issuer)) acc.push(cert.issuer);
  return acc;
}, []);

function CertBadge({ cert }: { cert: CertificationItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = cert.badgeSrc && !imageFailed;

  return (
    <div className="flex items-center justify-center h-32 mb-4">
      {showImage ? (
        <img
          src={cert.badgeSrc}
          alt={`${cert.name} badge`}
          width={120}
          height={120}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="max-h-32 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/30 to-rose-500/15 border border-red-400/50 flex items-center justify-center">
          <Award size={40} className="text-red-300" />
        </div>
      )}
    </div>
  );
}

export default function CertificationsSection() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const filteredCerts = selectedOrg
    ? CERTIFICATIONS.filter((cert) => cert.issuer === selectedOrg)
    : CERTIFICATIONS;

  const activeCount = CERTIFICATIONS.filter((c) => c.status === "Active").length;
  const activePct = Math.round((activeCount / CERTIFICATIONS.length) * 100);

  return (
    <section id="certifications" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader index="07" eyebrow="credentials" title="Certifications">
            {activeCount} active industry certifications spanning cloud security, penetration testing, incident response, and security management.
          </SectionHeader>

          {/* Organization Filter */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-red-500" />
              <span className="text-gray-300 font-semibold">Filter by Organization:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedOrg(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedOrg === null
                    ? "bg-red-700 bg-opacity-60 text-red-100 border border-red-300 border-opacity-60"
                    : "bg-slate-800 bg-opacity-70 text-gray-200 hover:bg-slate-700 border border-red-500 border-opacity-30 hover:border-opacity-50"
                }`}
              >
                All ({CERTIFICATIONS.length})
              </button>
              {ORGS.map((org) => (
                <button
                  key={org}
                  onClick={() => setSelectedOrg(org)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedOrg === org
                      ? "bg-red-700 bg-opacity-60 text-red-100 border border-red-300 border-opacity-60"
                      : "bg-slate-800 bg-opacity-70 text-gray-200 hover:bg-slate-700 border border-red-500 border-opacity-30 hover:border-opacity-50"
                  }`}
                >
                  {org} ({CERTIFICATIONS.filter((c) => c.issuer === org).length})
                </button>
              ))}
            </div>
          </div>

          {/* Badge Grid */}
          <div key={selectedOrg ?? "all"} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredCerts.map((cert, index) => (
              <motion.div
                key={cert.shortName}
                className="group p-5 bg-slate-900 bg-opacity-40 border border-red-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 hover:shadow-[0_0_24px_rgba(239,68,68,0.15)] transition-all duration-300 backdrop-blur-sm text-center flex flex-col"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: reduced ? 0 : (index % 4) * 0.08, duration: 0.4 }}
              >
                <CertBadge cert={cert} />
                <h3 className="font-bold text-white leading-tight group-hover:text-red-400 transition-colors">
                  {cert.shortName}
                </h3>
                <p className="text-gray-400 text-xs leading-snug mt-1 flex-grow">{cert.name}</p>
                <div className="flex items-center justify-center gap-2 mt-3 text-xs">
                  <span className="text-slate-400 font-medium">{cert.issuer}</span>
                  <span className="text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    {cert.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">{activeCount}</div>
              <div className="text-gray-400">Active Certifications</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">{ORGS.length}</div>
              <div className="text-gray-400">Issuing Organizations</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg border border-red-500 border-opacity-40 hover:border-opacity-60 transition-all duration-300 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2 text-red-400">{activePct}%</div>
              <div className="text-gray-400">Current & Maintained</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
