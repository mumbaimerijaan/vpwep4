# FIFA World Cup 2026™ — Smart Stadium & Tournament Operations Center
## A Real-time 3D Digital Twin & AI Decision Support System

This project is an advanced, high-fidelity **3D Digital Twin & Artificial Intelligence (AI) Operations Center** designed for Al Janoub Stadium during the FIFA World Cup 2026™. The application integrates 3D spatial monitoring, crowd analytics simulation, and real-time LLM-guided operations recommendations to provide tournament directors with a complete operational cockpit.

---

## 🏆 Problem Statement & Objective
Managing modern mega-events like the FIFA World Cup requires coordinating public safety, mass transit, stadium occupancy, and emergency response teams. Standard static dashboards isolate spatial views (where things are) from analytical data (metrics/incidents).

**This solution solves this by:**
1. Placing a interactive **3D spatial coordinate map** directly at the center of the viewport to display actual physical locations of incidents.
2. Embedding a **Generative AI Copilot** that translates incoming anomalies into step-by-step mitigation workflows.
3. Consolidating transport tracking, medical dispatches, crowd densities, and sustainability metrics in a unified control room interface.

---

## 🚀 Key Features

### 1. Interactive 3D Digital Twin (Three.js)
* **Real-time 3D Render:** Displays the physical structure of Al Janoub Stadium, fully rotatable and zoomable via OrbitControls.
* **Interactive Hotspots:** Spatial beacons representing critical zones (Gates, Metro station, VIP lounges, Concessions, Parking structures).
* **3D Collision Occlusion:** Smart raycasting hides spatial labels that are physically blocked behind the stadium body relative to the camera vector.
* **Cinematic Camera Pathing:** Staggered camera movements fly and zoom to hotspots upon selection.

### 2. Operations Dashboard (Multi-Panel Control)
Clicking the sidebar navigates between 8 operational contexts:
* **Overview:** Circular stadium track overlay showing active gate check-ins and emergency statuses.
* **AI Crowd Intelligence:** Dynamic density blobs, heatmap overlays, and threshold alert tracking.
* **Transport:** Transit schedules, metro queue intervals, and Park & Ride capacity monitoring.
* **Security:** Access control logs, CCTV live-status counts, and security team coordinates.
* **Medical:** Active responder telemetry and medical center dispatch indicators.
* **Sustainability:** Energy loads, reservoir limits, and solar panel power generations.
* **Communications:** PA announcers logging, radio channels activity, and broadcast logs.
* **Reports:** Generate and download matchday logs and handover summaries.

### 3. AI-Powered Decision Support
* **AI Operational Copilot (LLM-Guided):** Synthesizes multi-source anomalies and proposes contextual suggestions.
* **AI-Generated Recommendations:** Step-by-step mitigation paths with confidence levels and estimated impact metrics.
* **Simulation Sandbox:** Operators can "Apply Recommendation" to trigger GSAP simulations: updates crowd statuses, clears alerts, and advances the live event timeline.

---

## 🛠️ Technology Stack
* **Graphics Core:** [Three.js](https://threejs.org/) (WebGL 3D Rendering, geometries, lighting, mapping)
* **Animations Engine:** [GSAP](https://greensock.com/gsap/) (Smooth cinematic zooms, metric counting, panel entrances)
* **Structuring:** Vanilla HTML5, CSS3 Custom Properties (white glassmorphism & dark-neon styles)
* **Application logic:** ES Modules (JavaScript)
* **Build System:** [Vite](https://vite.dev/) (Production compilation & assets chunking)

---

## 📂 Project Structure
```
├── assets/
│   ├── images/
│   │   ├── locations/     # Asset preview pictures (Gate A, Metro, VIP, etc.)
│   │   ├── floor.jpg      # Main sunset landscape floor texture
│   │   ├── skybox.jpg     # 360 Skybox environment texture
│   │   ├── wireframe.png  # UI layout wireframe background map
│   │   └── stadium_topdown.png
│   └── models/
├── css/
│   ├── base.css           # Custom variables, reset styles, accessibility
│   ├── layout.css         # Grid columns, dashboard boxes, responsive styling
│   ├── ui.css             # Glassmorphism panels, icons, KPI cards
│   └── animations.css     # Pulse beacons, alerts transitions
├── js/
│   ├── app.js             # Main initializer and navigation setup
│   ├── config.js          # Centralized Three.js & camera settings
│   ├── constants.js       # Decoupled mock database, charts, and details
│   ├── scene.js           # 3D Scene setup, textures, and asset cleanups
│   ├── camera.js          # Perspective camera controls and pivots
│   ├── lighting.js        # Lighting models (Hemisphere/Directional)
│   ├── hotspots.js        # Beacons, raycasting, and info cards
│   ├── dashboard.js       # Dashboard panels switcher, sparklines, timeline
│   └── notification-ui.js # Event notifications panel controls
├── Dockerfile             # Multi-stage Docker deployment config
├── nginx.conf.template    # Cloud Run dynamic Nginx template
└── package.json           # Scripts and dependencies definitions
```

---

## 💻 Local Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)

### Setup Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/mumbaimerijaan/vpwep4.git
   cd vpwep4
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the local address in your web browser:
   `http://localhost:5173/`

5. To test the optimized production build:
   ```bash
   npm run build
   `npm run preview`
   ```

---

## ☁️ Google Cloud Run Deployment
The project is containerized using a multi-stage Docker setup. It builds the static client bundle and serves it via Nginx, with support for the **`PORT`** environment variable specified by Cloud Run.

### Step-by-Step Console Deployment:
1. **Prepare Build:** Connect your GitHub repository to Google Cloud Build.
2. **Build and Deploy:** Deploy directly using the Cloud Console interface:
   * Select **Cloud Run** in the Google Cloud Console.
   * Click **Create Service**.
   * Choose **"Continuously deploy new revisions from a source repository"** and select this repository.
   * Under **Build Configuration**, choose **Dockerfile**.
   * The container automatically reads the dynamic `$PORT` environment variable via `envsubst` to serve the application on the designated port.
   * Ensure **"Allow unauthenticated invocations"** is checked.
   * Click **Create** to launch your live operations center!

---

## ♿ Accessibility (a11y)
* **Screen Reader Friendly:** Direct `aria-label` definitions added on all toggle controllers, buttons, and tab switchers.
* **Keyboard Navigation:** High-contrast focus state indicators defined on focusable controls.
* **Visual Usability:** Text contrasts are tuned for visibility with clean typography sizes (Inter font).

---

## 🔒 Security
* **MIME Verification:** Configured Nginx static serve headers to deny injection.
* **Input Sanitization:** Dynamically updated text values use safe, sanitizing `textContent` assignments to block XSS vulnerabilities.
* **Secrets Policy:** Zero API keys, database credentials, or debug codes are present in the repository.

---

## 👥 Authors
* **Mumbai Meri Jaan**
