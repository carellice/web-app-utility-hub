import { useCallback, useState } from 'react';
import { useDocumentContext } from './useDocumentContext';
import { exportPdf } from '../lib/pdfExport';
import { downloadBlob } from '../lib/fileUtils';
import { EXPORT_SUFFIX } from '../constants/config';

export function useExportPdf() {
  const { state } = useDocumentContext();
  const [exporting, setExporting] = useState(false);

  const doExport = useCallback(async () => {
    if (state.pages.length === 0) return;

    setExporting(true);

    try {
      const pdfBytes = await exportPdf(state.pages, state.sourceDocuments);
      const fileName = `${state.documentName}${EXPORT_SUFFIX}.pdf`;
      downloadBlob(pdfBytes, fileName, 'application/pdf');
    } catch (err) {
      console.error('Export failed:', err);
      alert('Errore durante l\'esportazione del PDF.');
    } finally {
      setExporting(false);
    }
  }, [state]);

  return { doExport, exporting };
}
