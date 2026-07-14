import { motion, useReducedMotion } from "framer-motion";
import { TACTICS, TECHNIQUES, type Technique } from "@/data/offsec";

// Evidence-depth → intensity ramp (never presented as "coverage %").
function intensityClass(n: number) {
  if (n >= 3) return "bg-red-500/80 border-red-400/70 text-white";
  if (n === 2) return "bg-red-600/45 border-red-500/50 text-red-50";
  return "bg-red-900/40 border-red-500/30 text-red-200";
}

function evidenceTitle(t: Technique) {
  return `${t.id} · ${t.name}\nEvidence: ${t.evidence.map((e) => e.label).join(", ")}`;
}

export default function AttackMatrix() {
  const reduced = useReducedMotion();
  const byTactic = (tactic: string) => TECHNIQUES.filter((t) => t.tactic === tactic);

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="min-w-[720px] grid grid-cols-8 gap-2">
        {TACTICS.map((tactic) => (
          <div key={tactic} className="flex flex-col gap-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 h-10 leading-tight border-b border-red-500/20 pb-1">
              {tactic}
            </div>
            {byTactic(tactic).map((t, i) => {
              const primary = t.evidence.find((e) => e.url)?.url;
              const inner = (
                <>
                  <span className="font-mono text-[11px] font-semibold">{t.id}</span>
                  <span className="block text-[10px] leading-tight opacity-90 mt-0.5">{t.name}</span>
                </>
              );
              const cls = `block rounded-md border px-2 py-1.5 transition-transform hover:scale-[1.03] ${intensityClass(t.evidence.length)}`;
              return (
                <motion.div
                  key={t.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: reduced ? 0 : i * 0.04 }}
                >
                  {primary ? (
                    <a href={primary} target={primary.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls} title={evidenceTitle(t)}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cls} title={evidenceTitle(t)}>
                      {inner}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
