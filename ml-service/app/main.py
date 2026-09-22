from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional
import datetime

app = FastAPI(
    title="Livestock Health Risk Intelligence Microservice",
    description="AI-assisted risk assessment, early warning, and veterinary triage service.",
    version="1.0.0"
)

class RiskPredictionRequest(BaseModel):
    species: str
    symptoms: List[str]
    severity: str
    duration_days: int
    mortality_flag: bool = False
    temperature_c: Optional[float] = None
    milk_yield_drop_pct: Optional[float] = None
    nearby_cases_count_7d: int = 0
    vaccination_status: Optional[str] = "UNKNOWN"

class RiskPredictionResponse(BaseModel):
    risk_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    model_version: str
    top_factors: List[str]
    prediction_timestamp: str

@app.get("/health")
def healthcheck():
    return {
        "status": "UP",
        "service": "Livestock Risk ML Engine",
        "model_loaded": "rf-v1.0",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.post("/predict-risk", response_model=RiskPredictionResponse)
def predict_risk(payload: RiskPredictionRequest):
    # Simulated heuristic/baseline RF score pipeline for Phase 1 stub
    score = 0.15
    factors = []

    if payload.mortality_flag:
        score += 0.40
        factors.append("mortality_signal_detected")
    if payload.severity in ["SEVERE", "CRITICAL"]:
        score += 0.25
        factors.append("high_clinical_severity")
    if payload.nearby_cases_count_7d > 5:
        score += 0.20
        factors.append("elevated_nearby_case_density")
    if payload.vaccination_status in ["UNVACCINATED", "OVERDUE"]:
        score += 0.10
        factors.append("vaccination_gap_present")

    score = min(max(score, 0.05), 0.99)
    level = "LOW"
    if score >= 0.75:
        level = "CRITICAL"
    elif score >= 0.50:
        level = "HIGH"
    elif score >= 0.25:
        level = "MODERATE"

    return RiskPredictionResponse(
        risk_probability=round(score, 4),
        risk_level=level,
        model_version="rf-baseline-v1",
        top_factors=factors or ["baseline_endemic_monitoring"],
        prediction_timestamp=datetime.datetime.utcnow().isoformat()
    )
