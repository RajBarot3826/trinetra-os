# 👁️ Project TRINETRA: AI Crime Intelligence OS

![TRINETRA OS](https://img.shields.io/badge/Status-Live_Datathon_MVP-success)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)
![FastAPI](https://img.shields.io/badge/AI_Engine-Python_FastAPI-009688)

**TRINETRA** (The Third Eye) is a next-generation Crime Intelligence Operating System designed to eliminate data silos, synthesize fragmented police records into a unified intelligence graph, and empower law enforcement with predictive analytics.

Built exclusively for **Datathon 2026**.

---

## 🚀 Core Capabilities

1. **Crime Data Fusion Engine:** Consolidates FIRs, criminal histories, and geospatial tracking into a single source of truth.
2. **AI Crime Analytics Engine:** Uses `scikit-learn` DBSCAN clustering to dynamically detect emerging crime hotspots based on recent incidents.
3. **Criminal Network Intelligence:** Utilizes Graph Analytics to map out hidden gang connections, identifying the hierarchy and influence scores of suspects.
4. **Autonomous AI Investigation (CrimeGPT):** A simulated natural language co-pilot allowing officers to query complex networks via text.
5. **Command Center:** A stunning, dark-mode Next.js UI using `react-leaflet` and `react-force-graph` for military-grade data visualization.

---

## 🏗️ Architecture

TRINETRA uses a Polyglot Architecture designed for enterprise scalability:
*   **Frontend (`/trinetra-frontend`):** Next.js App Router, Tailwind CSS, Recharts, Deck.gl/Leaflet.
*   **AI Engine (`/trinetra-backend`):** Python FastAPI, Pandas, Scikit-Learn, NetworkX.
*   **Database:** SQLite (MVP) generating synthetic, realistic FIR data for Bengaluru districts.

---

## 💻 Running Locally

### 1. Start the AI Engine (Backend)
```bash
cd trinetra-backend
pip install -r requirements.txt
python data/generate_dataset.py  # Generates realistic mock FIRs and networks
uvicorn main:app --reload --port 8000
```

### 2. Start the Command Center (Frontend)
```bash
cd trinetra-frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000` to access the Command Center.

---

## ☁️ Deployment Strategy

*   **Frontend:** Deployed globally via Netlify edge nodes.
*   **Backend:** Dockerized Python FastAPI hosted on Render.com.

---

*Designed and engineered by an elite task force for Datathon 2026.*
