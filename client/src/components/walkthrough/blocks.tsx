import { useState } from "react";
import { Check, Copy, Info, KeyRound, Lightbulb, TriangleAlert } from "lucide-react";
import type { Block } from "@/data/walkthroughs/types";
import RichText from "./RichText";

/* ----------------------------- code block ------------------------------ */
// Lines are raw strings. Light terminal styling: `$ `/`# ` prompts and leading
// `#`/`//` comments are dimmed/tinted; loot lines (highlight) get an amber glow.
function CodeLine({ line, hot }: { line: string; hot: boolean }) {
  const prompt = /^([$#] )(.*)$/.exec(line);
  const comment = /^\s*(#|\/\/)/.test(line) && !prompt;
  return (
    <div
      className={
        hot
          ? "text-amber-300 font-semibold bg-amber-400/10 -mx-[18px] px-[18px]"
          : comment
            ? "text-slate-500 italic"
            : undefined
      }
    >
      {prompt ? (
        <>
          <span className="text-red-400 select-none">{prompt[1]}</span>
          {prompt[2]}
        </>
      ) : (
        line || " "
      )}
    </div>
  );
}

function CodeBlock({ block }: { block: Extract<Block, { kind: "code" }> }) {
  const [copied, setCopied] = useState(false);
  const hot = new Set(block.highlight ?? []);
  const copy = () => {
    const text = block.lines.join("\n").replace(/^[$#] /gm, "");
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <div className="my-5 rounded-xl border border-slate-700/70 bg-[#07080c] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.32)]">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-b from-slate-900 to-[#0e1017] border-b border-slate-800">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-slate-500">
          {block.label ?? block.lang ?? "shell"}
        </span>
        <button
          onClick={copy}
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-slate-400 bg-slate-800/70 border border-slate-700 rounded px-2.5 py-1 hover:text-red-300 hover:border-red-500/60 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="m-0 p-[16px_18px] overflow-x-auto font-mono text-[0.86rem] leading-relaxed text-slate-300">
        <code>
          {block.lines.map((line, i) => (
            <CodeLine key={i} line={line} hot={hot.has(i)} />
          ))}
        </code>
      </pre>
    </div>
  );
}

/* ------------------------------ callout -------------------------------- */
const CALLOUT = {
  note: { icon: Info, ring: "border-sky-500/30 bg-sky-500/[0.05]", head: "text-sky-300" },
  tip: { icon: Lightbulb, ring: "border-emerald-500/30 bg-emerald-500/[0.05]", head: "text-emerald-300" },
  warn: { icon: TriangleAlert, ring: "border-amber-500/35 bg-amber-500/[0.06]", head: "text-amber-300" },
  key: { icon: KeyRound, ring: "border-red-500/40 bg-red-500/[0.07]", head: "text-red-300" },
} as const;

function Callout({ block }: { block: Extract<Block, { kind: "callout" }> }) {
  const c = CALLOUT[block.variant];
  const Icon = c.icon;
  return (
    <div className={`my-5 rounded-lg border ${c.ring} p-4 pl-11 relative`}>
      <Icon size={17} className={`absolute left-3.5 top-4 ${c.head}`} />
      <p className={`font-bold text-sm mb-1 ${c.head}`}>{block.title}</p>
      <p className="text-slate-300 text-[0.96rem] leading-relaxed">
        <RichText text={block.text} />
      </p>
    </div>
  );
}

/* ------------------------------- table --------------------------------- */
function LootTable({ block }: { block: Extract<Block, { kind: "table" }> }) {
  return (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {block.columns.map((c) => (
              <th
                key={c}
                className="text-left px-3 py-2.5 border-b border-slate-800 font-mono text-[0.7rem] tracking-[0.12em] uppercase text-slate-500 font-semibold"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-3 py-2.5 border-b border-slate-800/70 align-top ${
                    ci === 0 ? "font-mono text-red-300 whitespace-nowrap" : "text-slate-300"
                  }`}
                >
                  <RichText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------- block dispatcher -------------------------- */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "p":
            return (
              <p key={i} className="my-3 text-slate-300 leading-relaxed">
                <RichText text={block.text} />
              </p>
            );
          case "epigraph":
            return (
              <p
                key={i}
                className="my-5 pl-4 border-l-2 border-slate-700 italic text-slate-500 text-[0.98rem]"
              >
                <RichText text={block.text} />
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 mb-2 text-xl font-semibold text-slate-100">
                <RichText text={block.text} />
              </h3>
            );
          case "h4":
            return (
              <h4 key={i} className="mt-6 mb-1.5 font-mono text-base font-semibold text-red-300">
                <RichText text={block.text} />
              </h4>
            );
          case "ul":
            return (
              <ul key={i} className="my-3 pl-5 list-disc marker:text-red-500/60 space-y-1.5">
                {block.items.map((it, j) => (
                  <li key={j} className="text-slate-300 leading-relaxed">
                    <RichText text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-3 pl-5 list-decimal marker:text-red-400 marker:font-mono space-y-1.5">
                {block.items.map((it, j) => (
                  <li key={j} className="text-slate-300 leading-relaxed">
                    <RichText text={it} />
                  </li>
                ))}
              </ol>
            );
          case "code":
            return <CodeBlock key={i} block={block} />;
          case "callout":
            return <Callout key={i} block={block} />;
          case "table":
            return <LootTable key={i} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
