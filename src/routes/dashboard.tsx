import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BindGraph" },
      { name: "description", content: "Affinity scoring, interaction breakdown, and reliability metrics." },
    ],
  }),
  component: Dashboard,
});

const recentRuns = [
  { id: "RUN-2841", protein: "4HHB", ligand: "Aspirin", pkd: 7.42, conf: 0.87 },
  { id: "RUN-2840", protein: "1ATP", ligand: "Staurosporine", pkd: 9.13, conf: 0.92 },
  { id: "RUN-2839", protein: "3PTB", ligand: "Benzamidine", pkd: 5.21, conf: 0.78 },
  { id: "RUN-2838", protein: "1HVR", ligand: "XK-263", pkd: 8.04, conf: 0.81 },
  { id: "RUN-2837", protein: "2RH1", ligand: "Carazolol", pkd: 9.55, conf: 0.94 },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
      <div>
        <div className="text-xs font-mono text-primary uppercase tracking-wider">Dashboard</div>
        <h1 className="mt-1 text-3xl font-bold">Analytical Overview</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          ["Total runs", "2,841", "+128 this week"],
          ["Avg pKd", "7.31", "↑ 0.4 vs baseline"],
          ["Mean confidence", "0.86", "stable"],
          ["GPU minutes", "47.2", "of 500 quota"],
        ].map(([l, v, s]) => (
          <div key={l} className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase">{l}</div>
            <div className="mt-2 text-3xl font-bold gradient-text">{v}</div>
            <div className="mt-1 text-[10px] font-mono text-muted-foreground">{s}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Affinity distribution chart */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Affinity distribution</h3>
            <span className="text-[10px] font-mono text-muted-foreground">last 30 days</span>
          </div>
          <div className="h-64 flex items-end gap-1.5">
            {[12, 18, 25, 38, 52, 68, 80, 92, 78, 64, 48, 32, 24, 18, 12, 8].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "var(--gradient-glow)", opacity: 0.3 + (h / 100) * 0.7 }} />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>pKd 3.0</span><span>pKd 6.5</span><span>pKd 10.0</span>
          </div>
        </div>

        {/* Interaction breakdown */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Interaction types</h3>
          <div className="space-y-3">
            {[["H-bond", 42], ["Hydrophobic", 28], ["π-stack", 15], ["Ionic", 9], ["Covalent", 6]].map(([k, v]) => (
              <div key={k as string}>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span>{k}</span><span className="text-muted-foreground">{v}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent runs */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">Recent runs</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 font-mono text-[10px] uppercase text-muted-foreground">
            <tr>
              <th className="text-left p-3 px-6">ID</th>
              <th className="text-left p-3">Protein</th>
              <th className="text-left p-3">Ligand</th>
              <th className="text-right p-3">pKd</th>
              <th className="text-right p-3 px-6">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                <td className="p-3 px-6 font-mono text-primary">{r.id}</td>
                <td className="p-3 font-mono">{r.protein}</td>
                <td className="p-3">{r.ligand}</td>
                <td className="p-3 text-right font-mono font-semibold">{r.pkd.toFixed(2)}</td>
                <td className="p-3 px-6 text-right font-mono text-muted-foreground">{(r.conf * 100).toFixed(0)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
