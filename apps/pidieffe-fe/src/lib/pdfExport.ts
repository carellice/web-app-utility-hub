import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import type { PageState, SourceDocument } from '../types/pdf';
import { percentToPdfPoints } from './annotationMapping';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return rgb(0, 0, 0);
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  );
}

export async function exportPdf(
  pages: PageState[],
  sourceDocuments: SourceDocument[]
): Promise<Uint8Array> {
  const newPdf = await PDFDocument.create();
  const font = await newPdf.embedFont(StandardFonts.Helvetica);

  const sourcePdfCache = new Map<string, PDFDocument>();

  for (const page of pages) {
    let sourcePdf = sourcePdfCache.get(page.sourceDocId);
    if (!sourcePdf) {
      const sourceDoc = sourceDocuments.find((d) => d.id === page.sourceDocId);
      if (!sourceDoc) throw new Error(`Source document ${page.sourceDocId} not found`);
      sourcePdf = await PDFDocument.load(sourceDoc.data);
      sourcePdfCache.set(page.sourceDocId, sourcePdf);
    }

    const [copiedPage] = await newPdf.copyPages(sourcePdf, [page.sourcePageIndex]);

    if (page.rotation !== 0) {
      copiedPage.setRotation(degrees(page.rotation));
    }

    newPdf.addPage(copiedPage);

    // Get page dimensions
    const { width: pageWidth, height: pageHeight } = copiedPage.getSize();

    // Apply annotations (text overlays and images)
    for (const annotation of page.annotations) {
      const { x, y, width, height } = percentToPdfPoints(
        annotation.x,
        annotation.y,
        annotation.width,
        annotation.height,
        pageWidth,
        pageHeight
      );

      if (annotation.type === 'text') {
        const fontSize = annotation.fontSize ?? 16;
        const color = annotation.fontColor ? hexToRgb(annotation.fontColor) : rgb(0, 0, 0);
        copiedPage.drawText(annotation.content, {
          x,
          y: y + height - fontSize,
          size: fontSize,
          font,
          color,
        });
      } else if (annotation.type === 'image') {
        const dataUrl = annotation.content;
        let image;
        if (dataUrl.includes('image/png')) {
          const base64 = dataUrl.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          image = await newPdf.embedPng(imageBytes);
        } else {
          const base64 = dataUrl.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          image = await newPdf.embedJpg(imageBytes);
        }

        const imgNaturalWidth = image.width;
        const imgNaturalHeight = image.height;
        const imgAspect = imgNaturalWidth / imgNaturalHeight;
        const boxAspect = width / height;

        let drawW = width;
        let drawH = height;
        let drawX = x;
        let drawY = y;

        if (imgAspect > boxAspect) {
          drawH = width / imgAspect;
          drawY = y + (height - drawH) / 2;
        } else {
          drawW = height * imgAspect;
          drawX = x + (width - drawW) / 2;
        }

        copiedPage.drawImage(image, { x: drawX, y: drawY, width: drawW, height: drawH });
      }
    }
  }

  return newPdf.save();
}
