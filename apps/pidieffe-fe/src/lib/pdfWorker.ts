import { pdfjs } from 'react-pdf';

let configured = false;

export async function getPdfJs() {
  if (!configured && typeof window !== 'undefined') {
    // Il worker viene servito come asset statico: così Vite non gli aggiunge
    // il client HMR, che in un Web Worker causerebbe `window is not defined`.
    pdfjs.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.mjs';
    configured = true;
  }

  return pdfjs;
}

export { pdfjs };
