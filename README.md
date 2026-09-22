# AI-Enabled Livestock Health Early-Warning & Surveillance Platform

An enterprise-grade, multi-tiered livestock health surveillance and decision-support platform connecting farmers, field workers, veterinarians, diagnostic laboratories, and government authorities.

> **DOMAIN SAFETY NOTICE**:  
> The system does **not** claim to autonomously diagnose diseases. The AI engine is strictly designed for **"AI-assisted risk assessment, early warning, and veterinary triage"**. Spatial groupings are designated as **"Potential / suspected emerging clusters"** until formal clinical, epidemiological, and laboratory confirmation exists.

---

## 1. System Architecture & Flow

```
FARMER / FIELD WORKER
        ↓
OFFLINE / MOBILE / IVR
        ↓
HEALTH & MORTALITY REPORTING
        ↓
UNIFIED HEALTH DATA
        ↓
AI-ASSISTED RISK INTELLIGENCE & HYBRID SCORING
        ↓
SPATIO-TEMPORAL CLUSTER DETECTION
        ↓
EXPLAINABLE RISK ALERTS
        ↓
VETERINARY TRIAGE & PRIORITY QUEUE
        ↓
CLINICAL INVESTIGATION & SAMPLE DISPATCH
        ↓
LABORATORY ASSAY & RESULT VALIDATION
        ↓
GOVERNMENT COMMAND & EPIDEMIOLOGICAL SURVEILLANCE
        ↓
CLOSED-LOOP FEEDBACK TO AI REGISTRY
```

---

## 2. Role-Based Access Control (RBAC)

The platform supports 7 distinct institutional and field roles:

1. **`FARMER`**: Manage livestock holdings, submit health and mortality reports (online/offline), view preventive advisories and risk alerts.
2. **`FIELD_WORKER`**: Grassroots para-vet enumerator, collect field observations, verify suspected symptoms, assist veterinary investigations.
3. **`VETERINARIAN`**: Clinical surgeon, prioritize triage queue (P1 to P4), review case histories, request laboratory samples, initiate quarantine and containment protocols.
4. **`LAB_STAFF`**: Regional diagnostic laboratory staff, manage sample chain-of-custody, log assay results (RT-PCR, ELISA, Culture), validate diagnostic findings.
5. **`DISTRICT_OFFICER`**: District animal husbandry command, GIS hotspot surveillance, vaccination gap monitoring, rapid response deployment.
6. **`STATE_ADMIN`**: State-wide epidemiological surveillance, inter-district risk comparisons, resource planning, and biological asset protection.
7. **`SUPER_ADMIN`**: Full platform control, RBAC provisioning, immutable security audit logs, master disease catalogs, and model versioning.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, PostGIS, Zod, JWT, bcryptjs, Helmet, CORS.
- **AI/ML Microservice**: Python, FastAPI, Scikit-learn, Pandas, NumPy, Pydantic.
- **Containerization**: Docker, Docker Compose.

---

## 4. Quick Start: Running Locally

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)
- Python (3.10+; optional for ML service standalone)

### Step 1: Run Backend & Test Suite
```bash
cd backend
npm install
npm test            # Runs full Vitest suite (16 tests for Auth & RBAC)
npm run dev         # Starts backend API on http://localhost:5000
```

### Step 2: Run Frontend
```bash
cd frontend
npm install
npm run dev         # Starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 5. Pre-Configured Demo Credentials

All test accounts use the default password: **`DemoPass123!`**

| Role | Email | Name / Function |
|---|---|---|
| **FARMER** | `farmer@livestock.gov` | Ramesh Kumar (Livestock Owner) |
| **FIELD_WORKER** | `fieldworker@livestock.gov` | Anitha Selvam (Field Para-Vet) |
| **VETERINARIAN** | `vet@livestock.gov` | Dr. Sundaramurthy (Veterinary Surgeon) |
| **LAB_STAFF** | `lab@livestock.gov` | Dr. Priya Sharma (Microbiologist) |
| **DISTRICT_OFFICER** | `district@livestock.gov` | Dr. K. Natarajan (District AH Officer) |
| **STATE_ADMIN** | `state@livestock.gov` | Dr. V. Rajendran (State Epidemiologist) |
| **SUPER_ADMIN** | `admin@livestock.gov` | System Super Administrator |

*(The login screen also features one-click autofill buttons for each persona).*

---

## 6. Docker Deployment (Single Command)

```bash
docker compose -f docker/docker-compose.yml up --build
```
This spins up:
- PostgreSQL + PostGIS on `5432`
- Express Backend on `5000`
- FastAPI ML Service on `8000`
- React Frontend on `5173`
