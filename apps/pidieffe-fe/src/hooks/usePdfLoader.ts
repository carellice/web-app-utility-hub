import { useCallback } from 'react';
import { useDocumentContext } from './useDocumentContext';
import { useUiContext } from './useUiContext';
import type { PageState, SourceDocument } from '../types/pdf';
import { readFileAsArrayBuffer } from '../lib/fileUtils';
import { getPdfJs } from '../lib/pdfWorker';

let docIdCounter = 0;
let pageIdCounter = 0;

function generateDocId() {
  return `doc-${++docIdCounter}-${Date.now()}`;
}

function generatePageId() {
  return `page-${++pageIdCounter}-${Date.now()}`;
}

export function usePdfLoader() {
  const { dispatch } = useDocumentContext();
  const { setViewMode } = useUiContext();

  const loadPdf = useCallback(
    async (file: File) => {
      dispatch({ type: 'LOAD_PDF_START' });

      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const data = new Uint8Array(arrayBuffer);

        const pdfjs = await getPdfJs();
        const pdf = await pdfjs.getDocument({ data: data.slice() }).promise;
        const numPages = pdf.numPages;

        const docId = generateDocId();
        const sourceDoc: SourceDocument = { id: docId, name: file.name, data };

        const pages: PageState[] = Array.from({ length: numPages }, (_, i) => ({
          id: generatePageId(),
          sourceDocId: docId,
          sourcePageIndex: i,
          rotation: 0,
          annotations: [],
        }));

        const name = file.name.replace(/\.pdf$/i, '');
        dispatch({ type: 'LOAD_PDF_SUCCESS', payload: { sourceDoc, pages, name } });
        setViewMode('grid');
        pdf.destroy();
      } catch (err) {
        dispatch({
          type: 'LOAD_PDF_ERROR',
          payload: err instanceof Error ? err.message : 'Errore nel caricamento del PDF',
        });
      }
    },
    [dispatch, setViewMode]
  );

  const mergePdf = useCallback(
    async (file: File) => {
      dispatch({ type: 'LOAD_PDF_START' });

      try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const data = new Uint8Array(arrayBuffer);

        const pdfjs = await getPdfJs();
        const pdf = await pdfjs.getDocument({ data: data.slice() }).promise;
        const numPages = pdf.numPages;

        const docId = generateDocId();
        const sourceDoc: SourceDocument = { id: docId, name: file.name, data };

        const pages: PageState[] = Array.from({ length: numPages }, (_, i) => ({
          id: generatePageId(),
          sourceDocId: docId,
          sourcePageIndex: i,
          rotation: 0,
          annotations: [],
        }));

        dispatch({ type: 'MERGE_PDF_SUCCESS', payload: { sourceDoc, pages } });
        pdf.destroy();
      } catch (err) {
        dispatch({
          type: 'LOAD_PDF_ERROR',
          payload: err instanceof Error ? err.message : 'Errore nel merge del PDF',
        });
      }
    },
    [dispatch]
  );

  return { loadPdf, mergePdf };
}
