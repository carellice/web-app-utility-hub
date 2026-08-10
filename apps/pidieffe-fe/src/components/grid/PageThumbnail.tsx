import { memo, useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import type { PageState } from '../../types/pdf';
import { THUMBNAIL_SCALE } from '../../constants/config';

interface PageThumbnailProps {
  page: PageState;
  scale?: number;
}

export const PageThumbnail = memo(
  function PageThumbnail({ page, scale = THUMBNAIL_SCALE }: PageThumbnailProps) {
    const { state } = useDocumentContext();
    const sourceDoc = state.sourceDocuments.find((d) => d.id === page.sourceDocId);

    const fileData = useMemo(() => {
      if (!sourceDoc) return null;
      return { data: sourceDoc.data.slice() };
    }, [sourceDoc]);

    if (!fileData) return null;

    return (
      <div
        className="overflow-hidden rounded bg-white shadow-sm"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        <Document file={fileData} loading={null}>
          <Page
            pageNumber={page.sourcePageIndex + 1}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    );
  },
  (prev, next) =>
    prev.page.id === next.page.id &&
    prev.page.rotation === next.page.rotation &&
    prev.scale === next.scale
);
