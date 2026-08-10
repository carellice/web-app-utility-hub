import { useCallback, useEffect, useRef } from 'react';
import type { Annotation, PageState } from '../../types/pdf';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';
import { TextAnnotation } from './TextAnnotation';
import { ImageAnnotation } from './ImageAnnotation';
import { readFileAsDataURL } from '../../lib/fileUtils';
import { ACCEPTED_IMAGE_TYPES } from '../../constants/config';

let annotationIdCounter = 0;
let clipboardAnnotation: Annotation | null = null;

interface AnnotationLayerProps {
  page: PageState;
}

export function AnnotationLayer({ page }: AnnotationLayerProps) {
  const { dispatch } = useDocumentContext();
  const { ui, setSelectedAnnotationId, setActiveTool } = useUiContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const addImageAnnotation = useCallback(
    async (file: File, x: number, y: number) => {
      try {
        const dataUrl = await readFileAsDataURL(file);

        // Load image to get natural dimensions for correct aspect ratio
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Impossibile caricare l\'immagine'));
          img.src = dataUrl;
        });

        const container = containerRef.current;
        const baseWidth = 20; // % of container width
        let widthPct = baseWidth;
        let heightPct = baseWidth;

        if (container && img.naturalWidth && img.naturalHeight) {
          const containerRect = container.getBoundingClientRect();
          const imgAspect = img.naturalWidth / img.naturalHeight;
          // Convert width% to pixels, compute height preserving aspect ratio, convert back to %
          const widthPx = (baseWidth / 100) * containerRect.width;
          const heightPx = widthPx / imgAspect;
          heightPct = (heightPx / containerRect.height) * 100;
        }

        const newAnnotation: Annotation = {
          id: `ann-${++annotationIdCounter}-${Date.now()}`,
          pageId: page.id,
          type: 'image',
          x,
          y,
          width: widthPct,
          height: heightPct,
          content: dataUrl,
        };
        dispatch({ type: 'ADD_ANNOTATION', payload: newAnnotation });
        setSelectedAnnotationId(newAnnotation.id);
        setActiveTool('select');
      } catch (err) {
        console.error('Errore nel caricamento immagine:', err);
      }
    },
    [page.id, dispatch, setSelectedAnnotationId, setActiveTool, containerRef]
  );

  const openImagePicker = useCallback(
    (x: number, y: number) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = ACCEPTED_IMAGE_TYPES;
      input.style.display = 'none';
      document.body.appendChild(input);
      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) {
          addImageAnnotation(file, x, y);
        }
        document.body.removeChild(input);
      });
      input.click();
    },
    [addImageAnnotation]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (ui.activeTool === 'text') {
        const newAnnotation: Annotation = {
          id: `ann-${++annotationIdCounter}-${Date.now()}`,
          pageId: page.id,
          type: 'text',
          x,
          y,
          width: 20,
          height: 5,
          content: '',
          fontSize: 16,
          fontColor: '#000000',
        };
        dispatch({ type: 'ADD_ANNOTATION', payload: newAnnotation });
        setSelectedAnnotationId(newAnnotation.id);
        setActiveTool('select');
      } else if (ui.activeTool === 'image') {
        openImagePicker(x, y);
      } else {
        setSelectedAnnotationId(null);
      }
    },
    [ui.activeTool, page.id, dispatch, setSelectedAnnotationId, setActiveTool, openImagePicker]
  );

  // Copy/paste annotations with Ctrl/Cmd+C/V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      if (e.key === 'c' && ui.selectedAnnotationId) {
        const ann = page.annotations.find((a) => a.id === ui.selectedAnnotationId);
        if (ann) {
          clipboardAnnotation = { ...ann };
          e.preventDefault();
        }
      }

      if (e.key === 'v' && clipboardAnnotation) {
        e.preventDefault();
        const offset = 2; // offset in % to avoid exact overlap
        const pasted: Annotation = {
          ...clipboardAnnotation,
          id: `ann-${++annotationIdCounter}-${Date.now()}`,
          pageId: page.id,
          x: Math.min(clipboardAnnotation.x + offset, 100 - clipboardAnnotation.width),
          y: Math.min(clipboardAnnotation.y + offset, 100 - clipboardAnnotation.height),
        };
        dispatch({ type: 'ADD_ANNOTATION', payload: pasted });
        setSelectedAnnotationId(pasted.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ui.selectedAnnotationId, page, dispatch, setSelectedAnnotationId]);

  const cursorClass =
    ui.activeTool === 'text'
      ? 'cursor-text'
      : ui.activeTool === 'image'
        ? 'cursor-crosshair'
        : 'cursor-default';

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-10 ${cursorClass}`}
      onClick={handleClick}
    >
      {/* Tool hint banner */}
      {ui.activeTool !== 'select' && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full bg-coral/90 px-4 py-1.5 text-xs font-medium text-white shadow-md">
          {ui.activeTool === 'text'
            ? 'Clicca sulla pagina per aggiungere testo'
            : 'Clicca sulla pagina per aggiungere un\'immagine'}
        </div>
      )}

      {page.annotations.map((ann) =>
        ann.type === 'text' ? (
          <TextAnnotation key={ann.id} annotation={ann} containerRef={containerRef} />
        ) : (
          <ImageAnnotation key={ann.id} annotation={ann} containerRef={containerRef} />
        )
      )}
    </div>
  );
}
