# Doctor notes are collected BEFORE AI results are shown on the frontend — by design, to reduce automation bias.
from __future__ import annotations

from datetime import datetime, timezone
from io import BytesIO

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from model_loader import predict_image

app = FastAPI(
    title="NeuraScan API",
    description="AI-assisted brain MRI diagnostic support API.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/diagnose")
async def diagnose(
    image: UploadFile = File(...),
    doctor_notes: str = Form(...),
) -> dict[str, object]:
    if not doctor_notes.strip():
        raise HTTPException(status_code=400, detail="doctor_notes is required.")

    contents = await image.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    try:
        scan = Image.open(BytesIO(contents))
        inference = predict_image(scan)
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=400, detail="Unsupported image format.") from exc
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {
        "prediction": inference["prediction"],
        "confidence": inference["confidence"],
        "all_scores": inference["all_scores"],
        "doctor_notes": doctor_notes.strip(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
