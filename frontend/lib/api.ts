export const DEMO_MODE = true;

export type DiagnosisApiResponse = {
  prediction: string;
  confidence: number;
  all_scores: Record<string, number>;
  timestamp: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function diagnoseImage(
  imageFile: File,
  doctorNotes: string,
  doctorDiagnosis: string,
): Promise<DiagnosisApiResponse | null> {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return {
      prediction: "Glioma",
      confidence: 0.847,
      all_scores: {
        glioma: 0.847,
        meningioma: 0.091,
        pituitary_tumor: 0.042,
        no_tumor: 0.02,
      },
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("doctor_notes", `${doctorNotes}\n\nPreliminary diagnosis: ${doctorDiagnosis}`);

    const response = await fetch(`${API_URL}/api/diagnose`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as DiagnosisApiResponse;
  } catch (error) {
    console.error("Diagnosis request failed", error);
    return null;
  }
}
