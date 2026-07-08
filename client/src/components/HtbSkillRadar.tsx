import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface ChallengeCategory {
  name: string;
  solved: number;
  total: number;
  percentage: number;
}

// Lazy-loaded so recharts ships in its own chunk instead of the main bundle.
export default function HtbSkillRadar({ categories }: { categories: ChallengeCategory[] }) {
  const top = [...categories].sort((a, b) => b.solved - a.solved).slice(0, 8);
  const data = top.map((c) => ({
    subject: c.name,
    value: c.percentage,
    solved: c.solved,
    total: c.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="rgba(148, 163, 184, 0.25)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "rgb(148 163 184)", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Completion"
          dataKey="value"
          stroke="rgb(239 68 68)"
          strokeWidth={2}
          fill="rgb(239 68 68)"
          fillOpacity={0.35}
          animationDuration={1400}
        />
        <Tooltip
          formatter={(value: number, _name, entry) =>
            [`${entry?.payload?.solved}/${entry?.payload?.total} (${Math.round(value)}%)`, "Solved"]
          }
          contentStyle={{
            background: "rgb(2 6 23 / 0.95)",
            border: "1px solid rgb(239 68 68 / 0.4)",
            borderRadius: "0.5rem",
            color: "rgb(226 232 240)",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
