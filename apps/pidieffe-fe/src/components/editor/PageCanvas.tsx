import { useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import type { PageState } from '../../types/pdf';

interface PageCanvasProps {
  page: PageState;
  width?: number;
}

export function PageCanvas({ page, width = 700 }: PageCanvasProps) {
  const { state } = useDocumentContext();
  const sourceDoc = state.sourceDocuments.find((d) => d.id === page.sourceDocId);

  const fileData = useMemo(() => {
    if (!sourceDoc) return null;
    return { data: sourceDoc.data.slice() };
  }, [sourceDoc]);

  if (!fileData) return null;

  return (
    <div style={{ transform: `rotate(${page.rotation}deg)` }}>
      <Document file={fileData} loading={null}>
        <Page
          pageNumber={page.sourcePageIndex + 1}
          width={width}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
