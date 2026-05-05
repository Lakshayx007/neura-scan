# NeuraScan

NeuraScan is an AI-assisted brain MRI diagnostic tool. Doctors upload MRI scans, record their own assessment first, and then receive AI-generated diagnosis - minimizing over-reliance on automation.

## Project Structure

```text
neurascan/
  frontend/   Next.js 14 app with TypeScript, Tailwind CSS, App Router, Framer Motion
  backend/    Python FastAPI app for MRI upload and EfficientNet inference
  README.md
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend includes:

- Landing page with Linear-inspired dark UI and glassmorphism.
- `/diagnose` core app with strict 3-step workflow.
- Demo mode enabled by default in `frontend/lib/api.ts`, so the app works without a live backend.
- `Try Demo` link that opens `/diagnose` with a preloaded sample MRI placeholder.

To use live inference, set `DEMO_MODE` to `false` in `frontend/lib/api.ts` and run the backend on `http://localhost:8000`.

## Backend Setup

```bash
cd backend
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API endpoints:

- `GET /api/health` returns `{ "status": "ok" }`.
- `POST /api/diagnose` accepts multipart field `image` and form field `doctor_notes`.

The model loader attempts to use the HuggingFace model first:

- [Devarshi/brain_tumor_mri_efficientnet](https://huggingface.co/Devarshi/brain_tumor_mri_efficientnet)

If unavailable, it builds an EfficientNetB3 4-class classifier and loads `backend/model_weights.h5` if present.

## Dataset

The training benchmark referenced in the UI is based on the Kaggle dataset:

- [Brain Tumor MRI Dataset by Masoud Nickparvar](https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset)

Classes:

- Glioma
- Meningioma
- Pituitary Tumor
- No Tumor

## Why Doctor-First Design?

Medical AI can quietly shape clinician judgment if its output appears too early. NeuraScan is designed around an anti-automation-bias workflow: the doctor uploads the scan, records their own observations and preliminary diagnosis, and only then sees the AI result.

This preserves independent clinical reasoning while still giving the care team a fast second read, confidence scores, and a structured comparison between human and model assessments.

## Clinical Safety

NeuraScan is a decision-support prototype. It assists clinical decision-making and does not replace professional medical judgment, radiology review, or local clinical protocols.
