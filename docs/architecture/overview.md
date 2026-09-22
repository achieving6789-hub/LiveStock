# Architecture Overview: AI-Enabled Livestock Health Platform

## 1. Domain Guardrails & Safety Architecture
- **Non-Diagnostic Principle**: Under no circumstances does the AI output a confirmed disease diagnosis. All ML inferences and rule outputs are explicitly categorized as **Risk Probabilities (0.0 to 1.0)** and **Priority Triage Recommendations**.
- **Cluster Status Designation**: Spatial groupings generated via spatio-temporal clustering algorithms (e.g. DBSCAN) are formally tagged as **"Potential / Suspected Emerging Clusters"**.
- **Confirmation Chain**: A condition only transitions from suspected to confirmed once a licensed Veterinarian records clinical findings and a recognized Diagnostic Laboratory issues a **VALIDATED** result.

## 2. Multi-Tiered Layer Breakdown

### Layer 1: Grassroots Data Ingestion
- Multi-channel reporting via Mobile App, Offline Sync queue, IVR Gateway, and Field Workers.
- Idempotency key tracking ensures network retries never produce duplicate disease events or mortality figures.

### Layer 2: Hybrid Risk Engine
- **Deterministic Rule Engine**: Evaluates clinical severity, sudden mortality, local case velocity, and village vaccination deficits.
- **Statistical / ML Classifier**: Pre-trained Random Forest / Logistic Regression estimator scoring multi-factorial disease susceptibility.
- **Combined Composite Score**: Dynamically weighted aggregation translated into actionable risk bands:
  - `0 - 24`: LOW
  - `25 - 49`: MODERATE
  - `50 - 74`: HIGH
  - `75 - 100`: CRITICAL

### Layer 3: Spatio-Temporal Intelligence
- PostGIS spatial indexing (`geometry(Point, 4326)`) computes localized case density, geographic centroids, and cluster radii.
- Nearby village risk comparisons within configurable radii (default 5 km to 25 km).

### Layer 4: Clinical Triage & Laboratory Closed Loop
- Priority-ranked veterinary queue (Priority 1 to 4).
- Chain of custody sample tracking (`REQUESTED` -> `COLLECTED` -> `DISPATCHED` -> `RECEIVED` -> `TESTING` -> `RESULT_AVAILABLE` -> `VALIDATED`).
- Model feedback registry tracking true positives, false positives, and sensitivity for versioned model audits.
