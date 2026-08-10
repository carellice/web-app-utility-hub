// Utility operations for PDF page management
// Currently handled directly via reducer actions and pdf-lib at export time.
// This file serves as an extension point for future operations.

export function getRotationLabel(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  switch (normalized) {
    case 90: return '90°';
    case 180: return '180°';
    case 270: return '270°';
    default: return '0°';
  }
}
