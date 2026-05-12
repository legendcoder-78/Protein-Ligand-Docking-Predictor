# 🧬 BindGraph — GNN-Powered Protein-Ligand Docking

> **⚠️ Ideation Stage — This project is currently a frontend concept/prototype. The backend (GNN inference engine, molecular parsing, and docking pipeline) has not been implemented yet.**

BindGraph is a web-based platform that aims to predict protein-ligand binding affinity using **Graph Neural Networks (GNNs)** — replacing hours of physics-based simulation with milliseconds of message passing.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)

---

## 🎯 Vision

Traditional protein-ligand docking relies on physics-based simulations that can take **hours per molecule**. BindGraph envisions using Graph Neural Networks to compress that to **milliseconds**, making it possible to screen millions of drug candidates in a single day.

### How It Will Work

```
PDB File → Residue Graph       ─┐
                                 ├─→ MPNN Message Passing → Pooled Representation → ΔG / pKd
SMILES String → Atom Graph     ─┘
```

1. **PARSE** — PDB → residue graph · SMILES → atom graph
2. **EMBED** — Encode chemical features per node
3. **PROPAGATE** — MPNN passes messages along edges
4. **PREDICT** — Pooled representation → ΔG scalar

---

## ✨ Features (Frontend UI)

| Page | Description |
|------|-------------|
| **Landing** | Hero section with animated molecular network, stats, and feature overview |
| **Docking Lab** | Interactive simulator with protein upload, SMILES input, 3D viewport, and affinity readouts |
| **Dashboard** | Analytical overview with affinity distribution charts, interaction breakdowns, and run history |
| **Batch Compare** | Molecular leaderboard for ranking candidate ligands with export options |
| **About** | Deep dive into the GNN architecture and message-passing pipeline |

---

## 🛠️ Tech Stack

### Frontend (Implemented ✅)
- **React 19** with TypeScript
- **TanStack Router** for file-based routing
- **TanStack Start** for SSR capabilities
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible component primitives
- **Lucide React** for icons
- **Recharts** for data visualization
- **Vite 7** as the build tool
- **Cloudflare Workers** (deployment target via Wrangler)

### Backend (Not Implemented ❌)
The following components are part of the ideation and have **not been built yet**:
- **PyTorch** — Deep learning framework for the GNN model
- **PyG (PyTorch Geometric)** — Graph neural network library
- **RDKit** — Molecular parsing and SMILES processing
- **DeepChem** — Molecular ML toolkit
- **PDBbind dataset** — Training data (19,443 protein-ligand complexes)
- **REST API** — Backend inference server for real-time predictions

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/legendcoder-78/graphy-ligand-snap.git

# Navigate to the project directory
cd graphy-ligand-snap

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 📁 Project Structure

```
graphy-ligand-snap/
├── public/              # Static assets (favicon, logos, manifest)
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── routes/          # File-based routes (TanStack Router)
│   │   ├── __root.tsx   # Root layout with navigation
│   │   ├── index.tsx    # Landing page
│   │   ├── lab.tsx      # Docking Lab simulator
│   │   ├── dashboard.tsx# Analytics dashboard
│   │   ├── compare.tsx  # Batch screening leaderboard
│   │   └── about.tsx    # About / How it works
│   ├── router.tsx       # Router configuration
│   ├── server.ts        # Server entry point
│   ├── start.ts         # App bootstrap
│   └── styles.css       # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc       # Cloudflare Workers config
```

---

## 🗺️ Roadmap

- [x] Frontend UI prototype
- [x] Interactive docking lab interface
- [x] Dashboard with mock analytics
- [x] Batch screening leaderboard
- [ ] Backend GNN inference server (PyTorch + PyG)
- [ ] Molecular parsing pipeline (RDKit)
- [ ] PDBbind model training
- [ ] Real-time WebSocket predictions
- [ ] 3D molecular viewer (WebGL / Mol*)
- [ ] User authentication & run history persistence
- [ ] PDF/PDB export functionality

---

## 📄 License

This project is currently private.

---

> **Note:** All data displayed in the UI (affinity scores, run history, leaderboard rankings) is **mock/simulated** and does not reflect real molecular docking results. The backend inference engine is planned for future development.
