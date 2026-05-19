import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { compareLigands } from "../api";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Batch Compare — BindGraph" },
      { name: "description", content: "Rank candidate ligands and export docked complexes." },
    ],
  }),
  component: Compare,
});

const initialLeaderboard = [
  { id: "1", name: "Imatinib", smiles: "Cc1ccc(NC(=O)c2ccc(CN3CCN(C)CC3)cc2)cc1", pkd: 9.85, dg: -13.4, reliability: 93 },
  { id: "2", name: "Dasatinib", smiles: "CC1=C(C=C(C=C1)NC...", pkd: 9.41, dg: -12.8, reliability: 91 },
  { id: "3", name: "Nilotinib", smiles: "Cc1cn(-c2cc(NC...", pkd: 8.92, dg: -12.1, reliability: 88 },
  { id: "4", name: "Bosutinib", smiles: "COc1cc(Nc2ncnc3...", pkd: 8.34, dg: -11.4, reliability: 85 },
  { id: "5", name: "Ponatinib", smiles: "Cc1ccc(C#Cc2ccc...", pkd: 7.91, dg: -10.8, reliability: 83 },
  { id: "6", name: "Aspirin", smiles: "CC(=O)Oc1ccccc1C(=O)O", pkd: 4.21, dg: -5.7, reliability: 79 },
  { id: "7", name: "Caffeine", smiles: "Cn1cnc2c1c(=O)n(C)c(=O)n2C", pkd: 3.88, dg: -5.3, reliability: 74 },
];

function Compare() {
  const [leaderboard, setLeaderboard] = useState<any[]>(initialLeaderboard);
  const [loading, setLoading] = useState(false);

  const runScreening = async () => {
    setLoading(true);
    try {
      const ligands = leaderboard.map(l => ({ id: l.id, smiles: l.smiles }));
      const results = await compareLigands({ data: { protein: "2HYY.pdb", ligands } });
      
      // Merge back the names
      const updated = results.map((res: any, index: number) => {
        const original = leaderboard.find(l => l.id === res.id);
        return {
          ...res,
          rank: index + 1,
          name: original?.name || "Unknown",
        };
      });
      
      setLeaderboard(updated);
    } catch (error) {
      console.error("Screening failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-primary uppercase tracking-wider">Batch screening</div>
          <h1 className="mt-1 text-3xl font-bold">Molecular Leaderboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Target protein: <span className="font-mono text-primary">ABL1 kinase (PDB 2HYY)</span> · {leaderboard.length} ligands ranked</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={runScreening}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {loading ? "Screening..." : "Run Batch Screening"}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            <FileText className="h-4 w-4" /> PDF Report
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-border">
            <Download className="h-4 w-4" /> Export PDB
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_1fr_120px_120px_100px] gap-4 px-6 py-3 bg-secondary/40 text-[10px] font-mono uppercase text-muted-foreground">
          <span>Rank</span>
          <span>Ligand</span>
          <span>SMILES</span>
          <span className="text-right">pKd</span>
          <span className="text-right">ΔG</span>
          <span className="text-right">Conf</span>
        </div>
        {leaderboard.map((l, index) => (
          <div key={l.id} className="grid grid-cols-[60px_1fr_1fr_120px_120px_100px] gap-4 px-6 py-4 border-t border-border items-center hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-2">
              <span className={`h-7 w-7 rounded-md flex items-center justify-center text-xs font-mono font-bold ${index < 3 ? "bg-primary text-primary-foreground glow-border" : "bg-secondary text-muted-foreground"}`}>
                {index + 1}
              </span>
            </div>
            <div className="font-semibold">{l.name}</div>
            <div className="font-mono text-xs text-muted-foreground truncate">{l.smiles}</div>
            <div className="text-right">
              <div className="font-mono font-bold gradient-text">{l.pkd.toFixed(2)}</div>
              <div className="h-1 rounded-full bg-secondary mt-1 overflow-hidden">
                <div className="h-full" style={{ width: `${l.pkd * 10}%`, background: "var(--gradient-glow)" }} />
              </div>
            </div>
            <div className="text-right font-mono text-sm">{l.dg.toFixed(1)}</div>
            <div className="text-right font-mono text-sm text-muted-foreground">{l.reliability}%</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <div className="text-sm text-muted-foreground">Drop a <span className="font-mono text-primary">.smi</span> or <span className="font-mono text-primary">.csv</span> file with up to 10,000 SMILES to screen against the target protein.</div>
      </div>
    </div>
  );
}
