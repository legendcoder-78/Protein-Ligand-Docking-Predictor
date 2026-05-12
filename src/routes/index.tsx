import { createFileRoute, Link } from "@tanstack/react-router";
import { Atom, Zap, Network, Gauge } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BindGraph — Predict binding affinity in milliseconds" },
      { name: "description", content: "GNN-powered protein-ligand docking. Drop a PDB, paste a SMILES, get binding affinity in milliseconds." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-mono text-muted-foreground mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            GNN inference · &lt;50ms per ligand
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] max-w-4xl">
            Find the <span className="gradient-text glow-text">key</span><br />
            for every lock.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            BindGraph predicts protein-ligand binding affinity using Graph Neural Networks —
            replacing hours of physics simulation with milliseconds of message passing.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/lab" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-border hover:opacity-90">
              <Zap className="h-4 w-4" /> Open Docking Lab
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium hover:bg-secondary">
              How it works
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
            {[
              ["10⁶", "ligands / day"],
              ["<50ms", "per prediction"],
              ["0.78", "Pearson r vs PDBbind"],
              ["19,443", "complexes trained"],
            ].map(([v, l]) => (
              <div key={l} className="bg-card p-6">
                <div className="text-2xl md:text-3xl font-mono gradient-text">{v}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12">
          <div className="text-xs font-mono text-primary uppercase tracking-wider">Core capabilities</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold max-w-2xl">A computational lab in your browser.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Atom, title: "Visual Docking", desc: "Drop a .pdb file, paste a SMILES string. Watch the ligand snap into the predicted binding pocket in 3D.", tag: "INTERACTIVE" },
            { icon: Gauge, title: "Affinity Scoring", desc: "Speedometer-style readouts of pKd and ΔG, with a reliability score against the PDBbind training distribution.", tag: "ANALYTICAL" },
            { icon: Network, title: "Batch Screening", desc: "Rank thousands of candidate ligands simultaneously. Export the top docked complexes as PDB or PDF.", tag: "PRODUCTION" },
          ].map((f) => (
            <div key={f.title} className="group relative rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{f.tag}</span>
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-8 md:p-12 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-primary uppercase tracking-wider">The pipeline</div>
              <h2 className="mt-2 text-3xl font-bold">From molecule to message-passing.</h2>
              <p className="mt-4 text-muted-foreground">
                Atoms become nodes, bonds become edges, and a Message Passing Neural Network
                learns the geometry of binding — like a key finding its lock in the dark.
              </p>
              <div className="mt-8 space-y-3 font-mono text-xs">
                {[
                  ["01", "PARSE", "PDB → residue graph · SMILES → atom graph"],
                  ["02", "EMBED", "Encode chemical features per node"],
                  ["03", "PROPAGATE", "MPNN passes messages along edges"],
                  ["04", "PREDICT", "Pooled representation → ΔG scalar"],
                ].map(([n, k, d]) => (
                  <div key={n} className="flex gap-4 items-start">
                    <span className="text-primary">{n}</span>
                    <span className="font-semibold w-24">{k}</span>
                    <span className="text-muted-foreground">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-lg grid-bg border border-border flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full p-8">
                {/* nodes */}
                {[
                  [100, 40], [60, 80], [140, 80], [40, 130], [100, 110], [160, 130], [80, 170], [130, 170],
                ].map(([cx, cy], i) => (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="6" fill="oklch(0.78 0.18 215)" opacity="0.9" />
                    <circle cx={cx} cy={cy} r="12" fill="oklch(0.78 0.18 215)" opacity="0.15" />
                  </g>
                ))}
                {/* edges */}
                {[
                  [100, 40, 60, 80], [100, 40, 140, 80], [60, 80, 40, 130], [60, 80, 100, 110],
                  [140, 80, 100, 110], [140, 80, 160, 130], [40, 130, 80, 170], [100, 110, 80, 170],
                  [100, 110, 130, 170], [160, 130, 130, 170],
                ].map((e, i) => (
                  <line key={i} x1={e[0]} y1={e[1]} x2={e[2]} y2={e[3]} stroke="oklch(0.78 0.18 215)" strokeWidth="1" opacity="0.4" />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto">
          Screen a million molecules <span className="gradient-text">before lunch.</span>
        </h2>
        <Link to="/lab" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground glow-border">
          <Zap className="h-4 w-4" /> Launch Docking Lab
        </Link>
      </section>
    </div>
  );
}
