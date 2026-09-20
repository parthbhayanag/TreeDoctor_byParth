# TreeDoctor 🌲

> **AI-Powered Urban Tree Health Monitoring & Early Warning Platform**  
> *"Google Maps tells us where trees are. TreeDoctor tells us which ones need our help."*

---

## 📖 Overview

Urban forestry initiatives routinely spend millions planting trees, yet cities lose thousands of specimens annually to preventable drought stress, fungal pathogens, bark beetle infestations, and root compaction. Traditional urban tree inventories are static records of location and species that quickly become outdated.

**TreeDoctor** transforms urban canopy management from static inventories into a continuous, proactive health monitoring and early warning system. By pairing multimodal vision AI (Gemini 2.5 Flash) with longitudinal time-series health tracking, municipal intervention workflows, and real-time microclimate telemetry, TreeDoctor detects tree decline months before irreversible crown death occurs.

---

## ✨ Key Capabilities

### 1. 🗺️ Interactive Urban Canopy Health Map
- **Full Geographic Visualization**: Interactive geospatial visualization powered by Leaflet with fluid pan, zoom, and specimen clustering.
- **Multi-Layer Base Maps**: Seamless switching between High-Contrast Dark, High-Resolution Satellite imagery, and Topographic Terrain.
- **Dynamic Status Filtering**: Filter and inspect specimens by clinical status:
  - 🟢 **Healthy** (80–100) — Optimal vigor and foliage density
  - 🟡 **Needs Attention** (60–79) — Mild chlorosis, minor pruning or irrigation needed
  - 🟠 **At Risk** (40–59) — Significant branch dieback, early pathogen symptoms
  - 🔴 **Critical** (0–39) — Severe structural compromise or active pathogen decay
- **Quick-Telemetry Inspection Cards**: Tap any specimen to immediately view canopy health status, trend indicators, and real-time atmospheric readings.

### 2. 📷 AI Arborist Diagnostic Scanner
- **Multimodal Computer Vision**: Powered by Google DeepMind's `gemini-2.5-flash` model.
- **Dual Capture Modes**: Real-time webcam integration and high-resolution photo upload.
- **Clinical Pathology Detection**: Identifies species, foliar necrosis, canopy thinning percentage, fungal fruiting bodies, pest boring holes, and trunk fissures.
- **Quantified Scoring & Urgency**: Computes a standardized 0–100 health score with triage urgency levels (*Low*, *Medium*, *High*, *Immediate*).
- **Targeted Action Plans**: Delivers prioritized, arborist-grade recommendations (e.g., systemic fungicide injection, crown thinning, soil decompaction).

### 3. 📈 Longitudinal Health & Early Warning Engine
- **Time-Series Tracking**: Maintains historical scan timelines for every individual tree specimen.
- **Decline Vector Alerts**: Triggers high-priority municipal alerts when a tree experiences rapid health degradation (e.g. drop of >10 points between scans).
- **Longitudinal Trend Curves**: Interactive health charts tracking score changes across weeks and months.
- **Photo-to-Photo Comparison**: Compare historical vs. recent canopy photos side-by-side to visually confirm canopy retreat.

### 4. 🌦️ Real-Time Microclimate & Environmental Telemetry
- **Precision Station Grid**: Integrates real-time weather and air quality observations grounded to the tree's physical coordinates via Open-Meteo & Copernicus Atmosphere services.
- **Four Core Atmospheric Metrics**:
  - **Actual Ambient Temperature** (°C) and current cloud/weather conditions.
  - **Precipitation & Rainfall Deficit** (mm) with 7-day cumulative rainfall analysis against urban canopy evapotranspiration benchmarks.
  - **Relative Humidity** (%) evaluating vapor pressure deficit (VPD) and transpiration stress.
  - **Air Quality Index (AQI)** with particulate matter concentrations (PM2.5 and PM10 in µg/m³).
- **AI Microclimate Cross-Correlation**: Correlates acute canopy yellowing or leaf scorch against localized thermal spikes and prolonged drought conditions.
- **On-Demand Sync**: Instant telemetry re-synchronization with one-click refresh controls.

### 5. 🏛️ Municipal Action Queue & Dispatch
- **Automated Triage**: Automatically converts high-risk and critical diagnostics into actionable municipal work orders.
- **Prescribed Interventions**: Deep-root irrigation, micro-injection treatments, structural cabling, hazard pruning, and root-collar excavation.
- **Status Lifecycle**: Track work orders across *Pending*, *In Progress*, and *Resolved* states with field notes and dispatch timestamps.

### 6. 🌲 Frictionless Tree Registration
- **Interactive Map Pinning**: Drag-and-drop or tap to pinpoint any tree's exact coordinates without manually typing street addresses.
- **Pre-Registration Telemetry**: Automatically samples local ambient weather and air quality for the selected pin location before saving.
- **Live Baseline Scan**: Immediately attaches initial photographic evidence and AI diagnosis to create a new longitudinal record.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Leaflet |
| **Backend & Runtime** | Node.js, Express, `tsx` (Dev), `esbuild` (Production Bundle) |
| **AI & Multimodal Vision**| `@google/genai` (Gemini 2.5 Flash Multimodal Vision & Reasoning) |
| **Atmospheric Telemetry** | Open-Meteo Precision Weather API & Copernicus Air Quality Grid |
| **Development & Build** | Vite, PostCSS, Strict TypeScript (`tsc --noEmit`) |

---

## 📁 Project Structure

```text
├── server.ts                  # Express server: Gemini AI vision routes, REST APIs, & weather telemetry
├── src/
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Primary view orchestrator & navigation state
│   ├── types.ts               # Global TypeScript definitions (Tree, TreeScan, EnvironmentalData, etc.)
│   ├── index.css              # Tailwind CSS directives & global style tokens
│   ├── components/
│   │   ├── TreeHealthMap.tsx        # Interactive Leaflet map with tile switchers & markers
│   │   ├── TreeScannerView.tsx      # Dual-mode camera/upload AI diagnostic workflow
│   │   ├── TreeProfileModal.tsx     # Full tree record, longitudinal chart, & live telemetry hub
│   │   ├── AddTreeModal.tsx         # Zero-typing tree registration with map pin & live weather preview
│   │   ├── MunicipalDashboard.tsx   # Triage queue, dispatch management, & canopy statistics
│   │   ├── EarlyWarningBanner.tsx   # Critical threshold warning bar for sudden decline
│   │   ├── LongitudinalChart.tsx    # Visual health trajectory and historical scan points
│   │   ├── ScoreGauge.tsx           # Circular SVG gauge rendering standardized health scores
│   │   └── LandingView.tsx          # Introductory welcome portal with platform highlights
│   ├── utils/
│   │   ├── environmental.ts         # Telemetry client utilities (Open-Meteo / Copernicus)
│   │   └── helpers.ts               # Status color formatters, trend evaluators, & helpers
│   └── data/
│       └── seedTrees.ts             # Initial urban canopy dataset with historical scans
├── metadata.json              # Platform capabilities and hardware frame permissions
├── package.json               # Package manifests and production build scripts
└── vite.config.ts             # Vite configuration with Tailwind CSS integration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/treedoctor.git
   cd treedoctor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

### Running Locally

- **Start Development Server:**
  ```bash
  npm run dev
  ```
  The application dev server starts on `http://localhost:3000` with instant live reload.

- **Run Type Check / Linter:**
  ```bash
  npm run lint
  ```

- **Build for Production:**
  ```bash
  npm run build
  ```
  Builds the client SPA into `/dist` and bundles `server.ts` into a self-contained CommonJS artifact `dist/server.cjs` via `esbuild`.

- **Start Production Server:**
  ```bash
  npm start
  ```

---

## 🔌 API Reference

The server exposes REST endpoints under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trees` | Returns all registered urban trees with their scan histories and alerts |
| `POST` | `/api/trees` | Registers a new tree specimen with initial photo, location, and telemetry |
| `GET` | `/api/trees/:id` | Returns complete details and longitudinal scan history for a single tree |
| `DELETE` | `/api/trees/:id` | Removes a tree specimen from the active monitoring register |
| `POST` | `/api/trees/:id/scan` | Logs a new diagnostic scan; computes health delta and triggers alerts if sudden drop occurs |
| `POST` | `/api/analyze-image` | Sends a canopy/bark photo to Gemini 2.5 Flash for multimodal arborist evaluation |
| `GET` | `/api/trees/:id/environmental` | Retrieves live Open-Meteo weather and Copernicus air quality telemetry for a tree's GPS location |
| `GET` | `/api/environmental-telemetry` | Queries real-time weather & AQI for arbitrary coordinates (`?lat=...&lng=...`) |
| `GET` | `/api/municipal/actions` | Returns all pending and resolved municipal dispatch actions |
| `PATCH` | `/api/municipal/actions/:id` | Updates action status (`pending` → `in_progress` → `resolved`) |

---

## 🔒 Security & Privacy

- **Server-Side API Key Isolation**: The `GEMINI_API_KEY` is strictly managed server-side in `server.ts`. It is never exposed to client-side bundles or browser DevTools.
- **Hardware Permissions**: Explicit permissions for `camera` (for live canopy scanning) and `geolocation` (for pinpointing trees in the field) are declared in `metadata.json` and requested only upon user action.
- **Zero Mock Telemetry**: Atmospheric data is fetched directly from real meteorological observation grids.

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
