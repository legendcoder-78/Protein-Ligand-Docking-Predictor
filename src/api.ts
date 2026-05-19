import { createServerFn } from "@tanstack/react-start";

/**
 * Utility to simulate network/processing delay
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates pseudo-deterministic mock binding affinity results based on input SMILES.
 * This simulates the output of a GNN model without the computational overhead.
 */
const generateMockResult = (smiles: string, protein: string) => {
  // Simple hash for deterministic results per SMILES
  let hash = 0;
  for (let i = 0; i < smiles.length; i++) {
    hash = (hash << 5) - hash + smiles.charCodeAt(i);
    hash |= 0;
  }
  
  const seed = Math.abs(hash);
  const pkd = +(6 + (seed % 300) / 100).toFixed(2);
  const dg = +(-(8 + (seed % 400) / 100)).toFixed(2);
  const reliability = 80 + (seed % 15);

  const allResidues = [
    ["HIS-57", "H-bond"],
    ["ASP-102", "ionic"],
    ["SER-195", "covalent"],
    ["TRP-215", "π-stack"],
    ["TYR-151", "H-bond"],
    ["GLY-193", "van der Waals"],
  ];

  // Randomly select interaction residues based on seed
  const interactions = allResidues
    .sort(() => (seed % 10) - 5)
    .slice(0, 3 + (seed % 2));

  return {
    pkd,
    dg,
    interactions,
    reliability,
    smiles,
    protein,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Server function to simulate docking a single ligand to a protein.
 * Includes a realistic delay to mimic AI inference.
 */
export const dockLigand = createServerFn({ method: "POST" })
  .inputValidator((data: { smiles: string; protein: string }) => data)
  .handler(async ({ data }) => {
    console.log(`[API] Docking ligand: ${data.smiles} to protein: ${data.protein}`);
    
    // Simulate processing delay (1.5s to 3s)
    const delay = 1500 + Math.random() * 1500;
    await sleep(delay);

    return generateMockResult(data.smiles, data.protein);
  });

/**
 * Server function to simulate batch screening of multiple ligands.
 * Returns a ranked list based on predicted binding affinity (pKd).
 */
export const compareLigands = createServerFn({ method: "POST" })
  .inputValidator((data: { protein: string; ligands: { id: string; smiles: string }[] }) => data)
  .handler(async ({ data }) => {
    console.log(`[API] Comparing ${data.ligands.length} ligands for protein: ${data.protein}`);

    // Simulate batch processing delay (fixed 2s)
    await sleep(2000);

    const results = data.ligands.map((ligand) => ({
      ...generateMockResult(ligand.smiles, data.protein),
      id: ligand.id,
    }));

    // Sort by affinity (pKd descending) for the leaderboard
    return results.sort((a, b) => b.pkd - a.pkd);
  });
