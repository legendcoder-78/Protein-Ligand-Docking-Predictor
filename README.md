# 🧬 BindGraph — GNN-Powered Protein-Ligand Docking

> **⚠️ Current State — This project currently uses a Random Forest Machine Learning model for protein-ligand docking prediction as a proof of concept. A more advanced Graph Neural Network (GNN) implementation is planned for the future.**

BindGraph is a web-based platform that predicts protein-ligand binding affinity. While currently powered by traditional ML (Random Forest), our vision is to upgrade to **Graph Neural Networks (GNNs)** — replacing hours of physics-based simulation with milliseconds of message passing.

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

### Backend
Currently implemented as a basic ML inference API:
- **Python** & **FastAPI** — API server
- **Scikit-Learn** — Random Forest Classification
- **RDKit** — Molecular parsing and feature extraction

#### Future GNN Backend (Planned)
The following components are planned for the future GNN implementation:
- **PyTorch** — Deep learning framework for the GNN model
- **PyG (PyTorch Geometric)** — Graph neural network library
- **DeepChem** — Molecular ML toolkit
- **PDBbind dataset** — Training data (19,443 protein-ligand complexes)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **bun**
- **Python** 3.9+
- **pip** (Python package installer)

### Installation & Running

This project requires running both the frontend UI and the backend ML inference server simultaneously.

#### 1. Start the ML Backend Server

Open a terminal and set up the Python environment:

```bash
# Clone the repository
git clone https://github.com/legendcoder-78/Protein-Ligand-Docking-Predictor.git

# Navigate to the project directory
cd Protein-Ligand-Docking-Predictor

# Set up a virtual environment (optional but recommended)
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate

# Install the required Python packages
pip install fastapi uvicorn scikit-learn rdkit joblib numpy

# Navigate to the python files directory and start the inference server
cd python_files
python inference.py
```
The FastAPI server will start running at `http://127.0.0.1:5000`.

#### 2. Start the Frontend Web App

Open a **new terminal window/tab**, keep the backend running, and start the frontend:

```bash
# Navigate to the root of the project
cd Protein-Ligand-Docking-Predictor

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the port specified by Vite, typically 8080).

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
- [x] Basic ML inference server (Python/FastAPI + Random Forest)
- [x] Molecular parsing pipeline (RDKit)
- [ ] Backend GNN inference server (PyTorch + PyG)
- [ ] PDBbind model training
- [ ] Real-time WebSocket predictions
- [ ] 3D molecular viewer (WebGL / Mol*)
- [ ] User authentication & run history persistence
- [ ] PDF/PDB export functionality

---

## 📄 License

This project is currently private.

---

> **Note:** Some data displayed in the UI (like dashboard analytics and leaderboard rankings) may still be **mock/simulated**. The actual docking lab now connects to a basic ML backend.
# Protein-Ligand-Docking-Predictor
