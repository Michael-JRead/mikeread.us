import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** Two-digit section number, e.g. "01". */
  index: string;
  /** Short mono eyebrow label, e.g. "OFFENSIVE SECURITY". */
  eyebrow: string;
  /** Section heading. */
  title: string;
  /** Optional lead paragraph / subtitle below the heading. */
  children?: ReactNode;
}

export default function SectionHeader({ index, eyebrow, title, children }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="section-eyebrow mb-3">
        <span className="text-slate-500">{index} /</span> {eyebrow}
      </p>
      <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{title}</h2>
      <div className="section-rule mt-5" />
      {children && <div className="mt-5 text-lg text-gray-400 max-w-2xl">{children}</div>}
    </div>
  );
}
