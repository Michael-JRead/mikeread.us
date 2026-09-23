import { EXPERIENCES } from "@/data/siteContent";
import SectionHeader from "./SectionHeader";

// Deliberately minimal: role, employer, years and location only. The fuller
// record (summaries, achievements, tooling) still lives in EXPERIENCES for
// other uses, but this section is a scannable career spine, not a résumé dump.
export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 relative scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader index="02" eyebrow="career" title="Professional Experience">
            Nine years across the Marine Corps, AWS, SAIC, and JPMorganChase — securing
            cloud, DoD, and enterprise systems.
          </SectionHeader>

          <ol className="relative ml-1 border-l border-red-500/25">
            {EXPERIENCES.map((experience) => (
              <li key={`${experience.company}-${experience.role}`} className="relative pl-6 pb-7 last:pb-0">
                <span
                  className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-4 ring-slate-950"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-bold leading-snug text-white">{experience.role}</h3>
                  <span className="font-medium text-red-300">{experience.company}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                  {experience.period} · {experience.location}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
