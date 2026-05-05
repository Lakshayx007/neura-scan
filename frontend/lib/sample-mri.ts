export const SAMPLE_MRI_DATA_URL =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="scan" cx="50%" cy="48%" r="58%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="14%" stop-color="#dbeafe"/>
      <stop offset="30%" stop-color="#a5b4fc"/>
      <stop offset="48%" stop-color="#6366f1"/>
      <stop offset="72%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#050507"/>
    </radialGradient>
  </defs>
  <rect width="320" height="320" fill="#050507"/>
  <circle cx="160" cy="160" r="134" fill="url(#scan)"/>
  <circle cx="160" cy="160" r="118" fill="none" stroke="#64748b" stroke-opacity="0.45" stroke-width="18"/>
  <ellipse cx="160" cy="160" rx="96" ry="118" fill="none" stroke="#f8fafc" stroke-opacity="0.24" stroke-width="5"/>
  <ellipse cx="160" cy="160" rx="58" ry="92" fill="none" stroke="#f8fafc" stroke-opacity="0.18" stroke-width="4"/>
  <path d="M160 54v212M107 102c31 12 48 33 53 67M213 101c-31 12-48 33-53 67M105 197c31-16 50-4 55 32M215 196c-33-13-50 1-55 33" fill="none" stroke="#f8fafc" stroke-opacity="0.22" stroke-width="4" stroke-linecap="round"/>
  <circle cx="117" cy="129" r="13" fill="#f8fafc" opacity="0.18"/>
  <circle cx="199" cy="190" r="18" fill="#f8fafc" opacity="0.13"/>
</svg>`);

export async function sampleMriFile() {
  const response = await fetch(SAMPLE_MRI_DATA_URL);
  const blob = await response.blob();
  return new File([blob], "sample-brain-mri.svg", { type: blob.type || "image/svg+xml" });
}
