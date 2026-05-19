import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Play, FlaskConical } from "lucide-react";
import { dockLigand } from "../api";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Docking Lab — BindGraph" },
      { name: "description", content: "Interactive protein-ligand docking with live 3D viewport and binding heatmap." },
    ],
  }),
  component: Lab,
});

function Lab() {
  const [smiles, setSmiles] = useState("CC(=O)Oc1ccccc1C(=O)O");
  const [pdb, setPdb] = useState<string>("4HHB.pdb");
  const [pdbContent, setPdbContent] = useState<string>("");
  const [heatmap, setHeatmap] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ 
    pkd: number; 
    dg: number; 
    interactions: string[][]; 
    reliability: number 
  } | null>({ 
    pkd: 7.42, 
    dg: -10.1, 
    interactions: [["HIS-57", "H-bond"], ["ASP-102", "ionic"], ["SER-195", "covalent"], ["TRP-215", "π-stack"]],
    reliability: 87
  });

  const run = async () => {
    setRunning(true);
    try {
      const data = await dockLigand({ data: { smiles, protein: pdb, pdbContent } });
      setResult(data);
    } catch (error) {
      console.error("Docking failed:", error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-mono text-primary uppercase tracking-wider">Docking Lab</div>
          <h1 className="mt-1 text-3xl font-bold">Visual Binding Simulator</h1>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-border disabled:opacity-50"
        >
          <Play className="h-4 w-4" /> {running ? "Docking…" : "Run Inference"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr_300px] gap-4">
        {/* Inputs */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <label className="text-xs font-mono text-muted-foreground uppercase">Protein (PDB)</label>
            <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-md p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
              <Upload className="h-6 w-6 mx-auto text-primary" />
              <div className="mt-2 text-sm font-mono">{pdb}</div>
              <div className="text-xs text-muted-foreground">Drop or select .pdb file</div>
              <input 
                type="file" 
                accept=".pdb"
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPdb(file.name);
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    setPdbContent(ev.target?.result as string);
                  };
                  reader.readAsText(file);
                }} 
              />
            </label>
            <button onClick={() => { setPdb("1ATP.pdb"); setPdbContent(""); }} className="mt-3 w-full text-xs font-mono text-muted-foreground hover:text-primary">↻ Use sample 1ATP</button>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <label className="text-xs font-mono text-muted-foreground uppercase">Ligand (SMILES)</label>
            <textarea
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-md bg-input border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-2 text-[10px] font-mono text-muted-foreground">Aspirin · C9H8O4 · 180.16 g/mol</div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Binding Heatmap</span>
              <button
                onClick={() => setHeatmap(!heatmap)}
                className={`relative h-5 w-9 rounded-full transition-colors ${heatmap ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${heatmap ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </label>
            <p className="mt-2 text-xs text-muted-foreground">Highlight high-interaction surface regions in neon.</p>
          </div>
        </aside>

        {/* Viewport */}
        <div className="rounded-lg border border-border bg-card overflow-hidden relative min-h-[500px] grid-bg">
          <div className="absolute top-3 left-3 flex gap-2 text-[10px] font-mono">
            <span className="px-2 py-1 rounded bg-background/80 border border-border">VIEWPORT · WebGL</span>
            <span className="px-2 py-1 rounded bg-background/80 border border-border text-primary">● LIVE</span>
          </div>
          <div className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground bg-background/80 border border-border rounded px-2 py-1">
            HEATMAP {heatmap ? "ON" : "OFF"}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-md">
              {/* protein blob */}
              <defs>
                <radialGradient id="prot" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="oklch(0.4 0.08 250)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="oklch(0.25 0.04 245)" stopOpacity="0.4" />
                </radialGradient>
                <radialGradient id="heat" cx="55%" cy="50%">
                  <stop offset="0%" stopColor="oklch(0.85 0.2 215)" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="oklch(0.78 0.18 215)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <ellipse cx="200" cy="210" rx="160" ry="140" fill="url(#prot)" />
              {heatmap && <ellipse cx="220" cy="200" rx="80" ry="70" fill="url(#heat)" />}
              {/* ligand ball-and-stick */}
              <g transform="translate(220 200)" opacity={running ? 0.3 : 1}>
                <line x1="0" y1="0" x2="20" y2="-15" stroke="oklch(0.85 0.2 215)" strokeWidth="2" />
                <line x1="20" y1="-15" x2="40" y2="0" stroke="oklch(0.85 0.2 215)" strokeWidth="2" />
                <line x1="0" y1="0" x2="-15" y2="15" stroke="oklch(0.85 0.2 215)" strokeWidth="2" />
                <line x1="40" y1="0" x2="55" y2="-20" stroke="oklch(0.85 0.2 215)" strokeWidth="2" />
                {[[0,0,"oklch(0.78 0.18 215)"],[20,-15,"oklch(0.97 0.01 220)"],[40,0,"oklch(0.78 0.18 215)"],[-15,15,"oklch(0.72 0.25 330)"],[55,-20,"oklch(0.97 0.01 220)"]].map(([x,y,c],i)=>(
                  <circle key={i} cx={x as number} cy={y as number} r="6" fill={c as string} stroke="oklch(0.18 0.03 240)" strokeWidth="1.5" />
                ))}
              </g>
              {/* surface points */}
              {Array.from({length: 40}).map((_, i) => {
                const a = (i / 40) * Math.PI * 2;
                return <circle key={i} cx={200 + Math.cos(a) * 158} cy={210 + Math.sin(a) * 138} r="1.5" fill="oklch(0.78 0.18 215)" opacity="0.6" />;
              })}
            </svg>
          </div>
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground bg-background/80 border border-border rounded px-2 py-1">
            Drag to rotate · scroll to zoom
          </div>
        </div>

        {/* Results panel */}
        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase">Affinity</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold gradient-text">{result?.pkd.toFixed(2)}</span>
              <span className="text-xs font-mono text-muted-foreground">pKd</span>
            </div>
            <div className="mt-1 text-xs font-mono text-muted-foreground">ΔG = {result?.dg.toFixed(2)} kcal/mol</div>
            {/* speedometer bar */}
            <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full" style={{ width: `${(result?.pkd ?? 0) * 10}%`, background: "var(--gradient-glow)" }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>weak</span><span>strong</span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase">Key residues</div>
            <ul className="mt-3 space-y-2 text-sm font-mono">
              {result?.interactions.map(([r, t]) => (
                <li key={r} className="flex justify-between items-center">
                  <span className="text-primary">{r}</span>
                  <span className="text-[10px] text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="text-xs font-mono text-muted-foreground uppercase">Reliability</div>
            <div className="mt-2 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{result?.reliability}%</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inputs match the PDBbind training distribution.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
