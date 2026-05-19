import { createServerFn } from "@tanstack/react-start";

/**
 * Server function to handle genuine model inference.
 * Executes on the server layer securely away from client injection.
 */
export const dockLigand = createServerFn({ method: "POST" })
  .inputValidator((data: { smiles: string; protein: string; pdbContent?: string }) => data)
  .handler(async ({ data }) => {
    console.log(`[API Proxy] Passing payload data to Python inference node...`);
    
    // 1. Create a Standard Web FormData payload to transport text/files over HTTP
    const pipelineForm = new FormData();
    pipelineForm.append("smiles", data.smiles);
    
    // Create a mock blob from text data if file contents exist, or use a default placeholder file blob
    const fileBlob = new Blob([data.pdbContent || "ATOM CONTENT PLACEHOLDER"], { type: "text/plain" });
    pipelineForm.append("pdb_file", fileBlob, `${data.protein}.pdb`);

    try {
      // 2. Fetch the prediction directly from your backend local machine learning core
      const targetResponse = await fetch("http://127.0.0.1:5000/api/v1/predict", {
        method: "POST",
        body: pipelineForm,
      });

      if (!targetResponse.ok) {
        throw new Error(`Python engine error: ${targetResponse.statusText}`);
      }

      const mlModelResult = await targetResponse.json();

      // 3. Map values explicitly back to your Tanstack state components
      return {
        pkd: mlModelResult.pkd,
        dg: mlModelResult.dg,
        interactions: mlModelResult.interactions,
        reliability: mlModelResult.reliability,
        smiles: data.smiles,
        protein: data.protein,
        timestamp: new Date().toISOString(),
        willBind: mlModelResult.will_bind
      };

    } catch (error) {
      console.error("[API Integration Error]:", error);
      // Clean fallback object so your UI elements don't collapse if connection resets
      return {
        pkd: 0.0,
        dg: 0.0,
        interactions: [],
        reliability: 0,
        smiles: data.smiles,
        protein: data.protein,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  });

// Maintain your batch processor function
export const compareLigands = createServerFn({ method: "POST" })
  .inputValidator((data: { protein: string; ligands: { id: string; smiles: string }[] }) => data)
  .handler(async ({ data }) => {
    console.log(`[API] Comparing ${data.ligands.length} ligands for protein: ${data.protein}`);
    
    // Map using Promise.all() across dockLigand logic
    const results = await Promise.all(
      data.ligands.map(async (ligand) => {
        const pipelineForm = new FormData();
        pipelineForm.append("smiles", ligand.smiles);
        
        const fileBlob = new Blob(["ATOM CONTENT PLACEHOLDER"], { type: "text/plain" });
        pipelineForm.append("pdb_file", fileBlob, `${data.protein}.pdb`);
        
        try {
          const targetResponse = await fetch("http://127.0.0.1:5000/api/v1/predict", {
            method: "POST",
            body: pipelineForm,
          });

          if (!targetResponse.ok) {
            throw new Error(`Python engine error: ${targetResponse.statusText}`);
          }

          const mlModelResult = await targetResponse.json();

          return {
            id: ligand.id,
            pkd: mlModelResult.pkd,
            dg: mlModelResult.dg,
            interactions: mlModelResult.interactions,
            reliability: mlModelResult.reliability,
            smiles: ligand.smiles,
            protein: data.protein,
            timestamp: new Date().toISOString(),
            willBind: mlModelResult.will_bind
          };
        } catch (error) {
          return {
            id: ligand.id,
            pkd: 0.0,
            dg: 0.0,
            interactions: [],
            reliability: 0,
            smiles: ligand.smiles,
            protein: data.protein,
            timestamp: new Date().toISOString(),
            error: true
          };
        }
      })
    );

    // Sort by affinity (pKd descending) for the leaderboard
    return results.sort((a, b) => b.pkd - a.pkd);
  });
