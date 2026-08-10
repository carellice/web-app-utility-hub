/**
 * Convert annotation position from percentage-based (browser coordinate system,
 * origin top-left) to PDF points (origin bottom-left).
 */
export function percentToPdfPoints(
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent: number,
  pageWidth: number,
  pageHeight: number
) {
  const x = (xPercent / 100) * pageWidth;
  const w = (widthPercent / 100) * pageWidth;
  const h = (heightPercent / 100) * pageHeight;
  // Flip Y axis: browser top-left -> PDF bottom-left
  const y = pageHeight - (yPercent / 100) * pageHeight - h;

  return { x, y, width: w, height: h };
}
