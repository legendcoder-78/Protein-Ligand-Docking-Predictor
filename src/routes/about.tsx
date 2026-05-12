import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BindGraph" },
      { name: "description", content: "How GNNs replace hours of physics simulation with milliseconds of message passing." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="text-xs font-mono text-primary uppercase tracking-wider">About</div>
      <h1 className="mt-2 text-4xl md:text-5xl font-bold">Accelerating discovery,<br />one graph at a time.</h1>

      <div className="prose prose-invert mt-12 space-y-12 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-bold text-foreground">The Vision</h2>
          <p className="mt-3 leading-relaxed">
            Traditional protein-ligand docking relies on physics-based simulations that can take hours per molecule.
            BindGraph uses <span className="text-primary">Graph Neural Networks</span> to compress that to milliseconds —
            making it possible to screen millions of drug candidates in a single day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">Molecules as Graphs</h2>
          <p className="mt-3 leading-relaxed">
            We treat molecules less like static images and more like social networks.
            Atoms and amino acids become nodes encoded with chemical properties — mass, electronegativity, hybridization.
            Chemical bonds and spatial proximities become edges.
          </p>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-xs font-mono text-primary uppercase">Nodes</div>
              <p className="mt-2 text-sm">Atoms / residues with feature vectors capturing chemistry and geometry.</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="text-xs font-mono text-primary uppercase">Edges</div>
              <p className="mt-2 text-sm">Covalent bonds and spatial distances — what connects to what, and how far.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">Message Passing</h2>
          <p className="mt-3 leading-relaxed">
            The MPNN architecture lets each node iteratively pull information from its neighbors.
            Over several rounds, the model identifies pockets where the ligand's graph fits perfectly into the protein's —
            <span className="text-primary"> like a key finding its lock in the dark.</span>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground">Tech Stack</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {["PyTorch", "PyG", "RDKit", "DeepChem"].map((t) => (
              <div key={t} className="rounded-md border border-border bg-card p-4 text-center font-mono text-sm">{t}</div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="text-xs font-mono text-primary uppercase">Trained on</div>
          <div className="mt-2 text-2xl font-bold text-foreground gradient-text">PDBbind 2020 · 19,443 complexes</div>
          <p className="mt-2 text-sm">Achieves Pearson r = 0.78 on the CASF-2016 core test set.</p>
        </section>
      </div>
    </div>
  );
}
