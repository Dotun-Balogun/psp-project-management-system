import { Card } from "./ui/card";
const C = ["#f2c200", "#c8281e", "#6b7280", "#059669", "#8b5cf6"];
export function Donut({ title, data }: { title: string; data: [string, number][] }) {
  const t = data.reduce((a, d) => a + d[1], 0) || 1, r = 40, c = 2 * Math.PI * r;
  const offs = data.map((_, i) => data.slice(0, i).reduce((a, d) => a + (d[1] / t) * c, 0));
  return (
    <Card className="p-5"><p className="mb-3 font-semibold">{title}</p>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 -rotate-90" role="img" aria-label={title}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="16" />
          {data.map(([l, v], i) => { const len = (v / t) * c; return <circle key={l} cx="50" cy="50" r={r} fill="none" stroke={C[i % 5]} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offs[i]} />; })}
        </svg>
        <ul className="space-y-1 text-sm">{data.map(([l, v], i) => <li key={l} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C[i % 5] }} />{l}: {v}</li>)}</ul>
      </div>
    </Card>
  );
}
