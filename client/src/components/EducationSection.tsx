import { useState } from "react";
import { CERTIFICATIONS, EDUCATION, type EducationItem } from "@/data/siteContent";
import { Award, GraduationCap } from "lucide-react";
import SectionHeader from "./SectionHeader";

// Per-institution emblem + metadata. `logo` points at an official mark in
// client/public/assets/edu/; if the file is absent the tile falls back to a
// brand-tinted monogram, so the section always renders cleanly.
const INSTITUTIONS: Record<
  string,
  { short: string; brand: string; kind: string; logo?: string; fit?: "cover" | "contain" }
> = {
  "SANS Technology Institute": {
    short: "SANS",
    brand: "#4FA3D1",
    kind: "Graduate · Information Security",
    logo: "/assets/edu/sans.jpg",
    fit: "cover", // full-bleed navy square — fill the tile edge to edge
  },
  "University of Maryland": {
    short: "UMD",
    brand: "#E03A3E",
    kind: "College Park, Maryland",
    logo: "/assets/edu/UM.png",
    fit: "contain", // detailed seal on white — sit it on a white chip
  },
};

function metaFor(institution: string) {
  return (
    INSTITUTIONS[institution] ?? {
      short: institution.slice(0, 2).toUpperCase(),
      brand: "#ef4444",
      kind: "",
    }
  );
}

// Pull an honors phrase ("Summa Cum Laude" …) out of the detail bullets so it can
// render as a badge instead of a plain line.
function honorsOf(details: string[]): string | null {
  const line = details.find((d) => /cum laude/i.test(d));
  if (!line) return null;
  const m = line.match(/(summa|magna)?\s*cum laude/i);
  return m
    ? m[0]
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
}

function EmblemTile({
  short,
  brand,
  logo,
  fit = "contain",
  name,
}: {
  short: string;
  brand: string;
  logo?: string;
  fit?: "cover" | "contain";
  name: string;
}) {
  // Show the official logo when its file is present; fall back to the monogram
  // (e.g. before the asset is added, or if it 404s).
  const [logoOk, setLogoOk] = useState(Boolean(logo));

  if (logo && logoOk) {
    const cover = fit === "cover";
    return (
      <div
        className={`w-20 h-20 shrink-0 overflow-hidden rounded-2xl shadow-lg ${
          cover ? "border border-white/10" : "border border-white/20 bg-white"
        }`}
      >
        <img
          src={logo}
          alt={`${name} logo`}
          loading="lazy"
          className={`h-full w-full ${cover ? "object-cover" : "object-contain p-1.5"}`}
          onError={() => setLogoOk(false)}
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center border-2 shadow-lg"
      style={{ borderColor: `${brand}66`, backgroundColor: `${brand}1a`, boxShadow: `0 0 24px ${brand}22` }}
      aria-hidden="true"
    >
      <span
        className={`font-extrabold tracking-tight ${short.length > 3 ? "text-lg" : "text-2xl"}`}
        style={{ color: brand }}
      >
        {short}
      </span>
      <GraduationCap
        size={16}
        className="absolute -bottom-1.5 -right-1.5 rounded-full bg-slate-950 p-0.5"
        style={{ color: brand }}
      />
    </div>
  );
}

function InstitutionCard({ institution, items }: { institution: string; items: EducationItem[] }) {
  const { short, brand, kind, logo, fit } = metaFor(institution);
  return (
    <div className="h-full rounded-xl border border-red-500/25 bg-slate-900/40 p-6 backdrop-blur-sm transition-all hover:border-red-500/50 hover:bg-slate-900/60">
      {/* Institution header */}
      <div className="flex items-center gap-4 pb-5 mb-5 border-b border-red-500/15">
        <EmblemTile short={short} brand={brand} logo={logo} fit={fit} name={institution} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight">{institution}</h3>
          {kind && (
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">{kind}</p>
          )}
          <p className="mt-1 font-mono text-[11px] text-red-300/80">
            {items.length} credential{items.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Degrees at this institution */}
      <ol className="space-y-5">
        {items.map((edu) => {
          const honors = honorsOf(edu.details);
          const inProgress = /expected/i.test(edu.period);
          const bullets = edu.details.filter((d) => !/cum laude/i.test(d));
          return (
            <li key={edu.degree} className="relative pl-4 border-l-2 border-red-500/30">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="font-semibold text-white leading-snug">{edu.degree}</h4>
                {honors && (
                  <span className="inline-flex items-center rounded-md border border-amber-400/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
                    {honors}
                  </span>
                )}
                {inProgress && (
                  <span className="inline-flex items-center rounded-md border border-sky-400/40 bg-sky-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sky-300">
                    In progress
                  </span>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-slate-500">{edu.period}</p>
              {bullets.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {bullets.map((d, i) => (
                    <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-slate-400">
                      <span className="mt-1 shrink-0 text-red-400" aria-hidden="true">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function EducationSection() {
  // Group degrees under their institution, preserving first-seen order.
  const order: string[] = [];
  const groups: Record<string, EducationItem[]> = {};
  for (const edu of EDUCATION) {
    if (!groups[edu.institution]) {
      groups[edu.institution] = [];
      order.push(edu.institution);
    }
    groups[edu.institution].push(edu);
  }

  return (
    <section id="education" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <SectionHeader index="03" eyebrow="academics" title="Education" />

          <div className="grid gap-5 md:grid-cols-2 items-stretch">
            {order.map((institution) => (
              <InstitutionCard key={institution} institution={institution} items={groups[institution]} />
            ))}
          </div>

          {/* Certifications summary */}
          <div className="mt-12 rounded-xl border border-red-500/40 bg-gradient-to-br from-slate-800 to-slate-900 p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-500/60">
            <div className="flex items-center gap-3 mb-4">
              <Award size={28} className="text-red-500" />
              <h3 className="text-2xl font-bold text-white">Professional Certifications</h3>
            </div>
            <p className="text-gray-300 mb-4">
              I hold {CERTIFICATIONS.length} active industry certifications across cloud security,
              penetration testing, compliance, and security management.
            </p>
            <a
              href="#certifications"
              className="glass-readable-button inline-block px-6 py-2 rounded-lg font-semibold hover:bg-red-500 transition-all duration-300"
            >
              View All Certifications {"->"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
