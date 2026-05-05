import jsPDF from "jspdf";

export type ReportPayload = {
  prediction: string;
  confidence: number;
  allScores: Record<string, number>;
  doctorNotes: string;
  doctorDiagnosis: string;
  scanPreviewUrl?: string;
};

const labelMap: Record<string, string> = {
  glioma: "Glioma",
  Glioma: "Glioma",
  meningioma: "Meningioma",
  Meningioma: "Meningioma",
  pituitary_tumor: "Pituitary Tumor",
  "Pituitary Tumor": "Pituitary Tumor",
  no_tumor: "No Tumor",
  "No Tumor": "No Tumor",
};

function labelFor(value: string) {
  return labelMap[value] ?? value;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace("likely ", "")
    .replace("appears healthy", "no_tumor")
    .replaceAll(" ", "_");
}

function scoreRows(allScores: Record<string, number>) {
  return Object.entries(allScores)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label: labelFor(label), value }));
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function imageUrlToDataUrl(url?: string) {
  if (!url) return null;

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth || 320;
    canvas.height = image.naturalHeight || 320;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#050507";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Unable to embed scan image in report", error);
    return null;
  }
}

function header(doc: jsPDF, subtitle: string) {
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, 210, 26, "F");
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 26, 210, 2.5, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("NeuraScan Imaging Center", 14, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("AI-assisted neuroradiology diagnostic support", 14, 20);
  doc.setFont("helvetica", "bold");
  doc.text(subtitle, 154, 13);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${formatDate()}`, 154, 20);
}

function footer(doc: jsPDF, page = 1) {
  doc.setDrawColor(218, 224, 235);
  doc.line(14, 282, 196, 282);
  doc.setTextColor(96, 104, 122);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("This document is produced by NeuraScan for clinical review workflows.", 14, 288);
  doc.text(`Page ${page}`, 184, 288);
}

function sectionTitle(doc: jsPDF, title: string, y: number) {
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(title, 14, y);
  doc.setDrawColor(99, 102, 241);
  doc.line(14, y + 2.5, 196, y + 2.5);
}

function infoBox(doc: jsPDF, x: number, y: number, w: number, h: number, title: string, value: string) {
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(225, 231, 239);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(title, x + 4, y + 6);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(value, x + 4, y + 12);
}

function wrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export async function downloadPatientReport(payload: ReportPayload) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const scanImage = await imageUrlToDataUrl(payload.scanPreviewUrl);
  const prediction = labelFor(payload.prediction);
  const match = normalize(payload.doctorDiagnosis) === normalize(payload.prediction);

  header(doc, "Patient Diagnostic Report");

  infoBox(doc, 14, 36, 40, 18, "Patient", "Demo Patient");
  infoBox(doc, 58, 36, 32, 18, "Age / Sex", "42 / M");
  infoBox(doc, 94, 36, 42, 18, "Study", "Brain MRI");
  infoBox(doc, 140, 36, 56, 18, "Report Status", "Physician approved");

  sectionTitle(doc, "Clinical Study", 66);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Study Type: Brain MRI anomaly assessment", 14, 76);
  doc.text(`AI-assisted diagnostic suggestion: ${prediction}`, 14, 82);
  doc.text(`AI confidence: ${Math.round(payload.confidence * 100)}%`, 14, 88);
  doc.text(`Human-AI agreement: ${match ? "Concordant" : "Requires review"}`, 14, 94);

  if (scanImage) {
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(142, 66, 54, 54, 2, 2);
    doc.addImage(scanImage, "PNG", 144, 68, 50, 50);
  }

  sectionTitle(doc, "Findings", 112);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const findings =
    prediction === "No Tumor"
      ? "No dominant tumor-class activation was detected in this submitted MRI image. Final interpretation should correlate with full MRI series and clinical history."
      : `The submitted MRI image was reviewed with an AI-assisted second-read workflow. The approved report notes imaging features most consistent with ${prediction}. Correlation with full MRI series, prior imaging, and clinical findings is recommended.`;
  let y = wrappedText(doc, findings, 14, 123, 118);

  sectionTitle(doc, "Impression", y + 8);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  y = wrappedText(doc, `1. Impression favors: ${prediction}.`, 14, y, 176);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  y = wrappedText(
    doc,
    "2. This is a physician-approved demo report generated after independent doctor assessment was recorded before AI output.",
    14,
    y + 2,
    176,
  );
  y = wrappedText(
    doc,
    "3. Please consult the treating physician or radiologist for final clinical interpretation and management.",
    14,
    y + 2,
    176,
  );

  sectionTitle(doc, "Doctor's Approved Assessment", y + 10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  y = wrappedText(doc, payload.doctorNotes || "No additional notes recorded.", 14, y + 22, 176);

  sectionTitle(doc, "Authorization", 238);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.text("Reviewed by: ______________________________", 14, 252);
  doc.text("Radiologist / Treating Physician", 14, 258);
  doc.text("Signature: ________________________________", 108, 252);
  doc.text(`Date: ${formatDate()}`, 108, 258);

  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(14, 264, 182, 12, 2, 2, "FD");
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(8);
  doc.text("Patient copy: simplified for communication. Technical AI evidence is available in the physician report.", 18, 271);

  footer(doc);
  doc.save("neurascan-patient-diagnostic-report.pdf");
}

export async function downloadDoctorReport(payload: ReportPayload) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const scanImage = await imageUrlToDataUrl(payload.scanPreviewUrl);
  const rows = scoreRows(payload.allScores);
  const prediction = labelFor(payload.prediction);
  const secondBest = rows[1];
  const margin = Math.max(0, payload.confidence - (secondBest?.value ?? 0));
  const match = normalize(payload.doctorDiagnosis) === normalize(payload.prediction);

  header(doc, "Doctor AI Evidence Report");

  infoBox(doc, 14, 36, 48, 18, "Model", "EfficientNetB3");
  infoBox(doc, 66, 36, 42, 18, "Top Class", prediction);
  infoBox(doc, 112, 36, 32, 18, "Confidence", `${Math.round(payload.confidence * 100)}%`);
  infoBox(doc, 148, 36, 48, 18, "Doctor-AI", match ? "Concordant" : "Discordant");

  sectionTitle(doc, "AI Technical Summary", 66);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.text(`Prediction: ${prediction}`, 14, 76);
  doc.text(`Next best differential: ${secondBest ? labelFor(secondBest.label) : "N/A"}`, 14, 82);
  doc.text(`Confidence margin: ${Math.round(margin * 100)} percentage points`, 14, 88);
  doc.text(`Doctor preliminary diagnosis: ${payload.doctorDiagnosis}`, 14, 94);
  doc.text(`Automation-bias guardrail: Doctor notes collected before AI output`, 14, 100);

  if (scanImage) {
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(142, 66, 54, 54, 2, 2);
    doc.addImage(scanImage, "PNG", 144, 68, 50, 50);
  }

  sectionTitle(doc, "Class Probability Distribution", 116);
  let y = 128;
  rows.forEach((row) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(row.label, 14, y);
    doc.text(`${Math.round(row.value * 100)}%`, 184, y, { align: "right" });
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(14, y + 3, 170, 3, 1, 1, "F");
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(14, y + 3, Math.max(3, 170 * row.value), 3, 1, 1, "F");
    y += 13;
  });

  sectionTitle(doc, "Model Rationale", y + 8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  const rationale = [
    `The highest probability class was ${prediction}, with a confidence score of ${Math.round(payload.confidence * 100)}%.`,
    `The model separated this class from ${secondBest ? secondBest.label : "the next class"} by ${Math.round(margin * 100)} percentage points.`,
    "Visual evidence overlay in the interface highlights regions that contributed most strongly to the class decision.",
    "This output is intended for physician review and must be interpreted alongside the complete MRI series and clinical context.",
  ];
  y += 20;
  rationale.forEach((item, index) => {
    y = wrappedText(doc, `${index + 1}. ${item}`, 14, y, 176);
    y += 2;
  });

  sectionTitle(doc, "Doctor Assessment Captured Before AI", y + 8);
  doc.setTextColor(51, 65, 85);
  y = wrappedText(doc, payload.doctorNotes || "No doctor notes recorded.", 14, y + 20, 176);

  if (y > 236) {
    footer(doc);
    doc.addPage();
    header(doc, "Doctor AI Evidence Report");
    y = 40;
  }

  sectionTitle(doc, "Review Checklist", y + 10);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  y += 24;
  [
    "Full MRI series reviewed by physician",
    "AI output compared with independent clinical assessment",
    "Discordance resolved or documented",
    "Final impression approved for patient communication",
  ].forEach((item) => {
    doc.rect(14, y - 3, 4, 4);
    doc.text(item, 22, y);
    y += 8;
  });

  doc.text("Physician approval: _________________________", 14, 262);
  doc.text("Date / time: _______________________________", 108, 262);
  footer(doc);
  doc.save("neurascan-doctor-ai-evidence-report.pdf");
}
