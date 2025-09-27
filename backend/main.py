from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional



from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Confidence Scoring Engine Prototype")

# ✅ Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # (for dev, allow all)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- rest of your existing code ---

# ✅ Request Model
class HazardReport(BaseModel):
    location: str
    description: str
    has_photo: bool = False
    nearby_reports: int = 0
    user_trust: str = "low"   # low / medium / high
    inc_data_confirmed: bool = False
    ai_media_verification: bool = False


@app.get("/")
def root():
    return {"message": "Hazard Confidence Engine Running 🚀"}


@app.post("/calculate_score/")
def calculate_score(report: HazardReport):
    score = 0
    details = []

    # 1. Geotag/Location
    if "beach" in report.location.lower() or "coast" in report.location.lower():
        score += 20
        details.append(("Geotag (near coast)", 20))

    # 2. Nearby reports
    if report.nearby_reports > 0:
        bonus = min(report.nearby_reports * 10, 25)
        score += bonus
        details.append((f"{report.nearby_reports} nearby reports", bonus))

    # 3. User Trust
    trust_bonus = {"low": 5, "medium": 15, "high": 25}
    bonus = trust_bonus.get(report.user_trust, 0)
    score += bonus
    details.append((f"User trust: {report.user_trust}", bonus))

    # 4. INCOIS/Tide Data
    if report.inc_data_confirmed:
        score += 25
        details.append(("INCOIS confirms", 25))

    # 5. AI Media Verification
    if report.has_photo and report.ai_media_verification:
        score += 10
        details.append(("AI confirms photo authenticity", 10))

    # ✅ Clamp max score to 100
    score = min(score, 100)

    # ✅ Label
    label = "Highly Reliable" if score >= 80 else "Moderate" if score >= 50 else "Unreliable"

    return {
        "location": report.location,
        "description": report.description,
        "confidence_score": score,
        "status": label,
        "calculation_steps": details
    }
