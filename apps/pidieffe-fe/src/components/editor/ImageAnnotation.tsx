import { useRef, useCallback } from 'react';
import type { Annotation } from '../../types/pdf';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';

interface ImageAnnotationProps {
  annotation: Annotation;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ImageAnnotation({ annotation, containerRef }: ImageAnnotationProps) {
  const { dispatch } = useDocumentContext();
  const { ui, setSelectedAnnotationId } = useUiContext();
  const dragRef = useRef(false);
  const resizeRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const annotationRef = useRef(annotation);
  annotationRef.current = annotation;
  const isSelected = ui.selectedAnnotationId === annotation.id;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (ui.activeTool !== 'select') return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedAnnotationId(annotation.id);
      dragRef.current = true;

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const currentX = (annotation.x / 100) * rect.width;
      const currentY = (annotation.y / 100) * rect.height;
      dragOffset.current = {
        x: e.clientX - rect.left - currentX,
        y: e.clientY - rect.top - currentY,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [annotation.id, annotation.x, annotation.y, containerRef, ui.activeTool, setSelectedAnnotationId]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const ann = annotationRef.current;

      if (dragRef.current) {
        const x = ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100;
        dispatch({
          type: 'UPDATE_ANNOTATION',
          payload: { ...ann, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
        });
      }

      if (resizeRef.current) {
        const newW = ((e.clientX - rect.left) / rect.width) * 100 - ann.x;
        const clampedW = Math.max(3, newW);
        // Maintain aspect ratio: scale height proportionally
        const ratio = ann.height / ann.width;
        const clampedH = clampedW * ratio;
        dispatch({
          type: 'UPDATE_ANNOTATION',
          payload: { ...ann, width: clampedW, height: clampedH },
        });
      }
    },
    [containerRef, dispatch]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = false;
    resizeRef.current = false;
  }, []);

  const handleResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      resizeRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  return (
    <div
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-coral' : ''}`}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        width: `${annotation.width}%`,
        height: `${annotation.height}%`,
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <img
        src={annotation.content}
        alt="annotation"
        className="pointer-events-none h-full w-full object-contain"
        draggable={false}
      />
      {isSelected && (
        <>
          <button
            type="button"
            className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white shadow"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: 'DELETE_ANNOTATION',
                payload: { pageId: annotation.pageId, annotationId: annotation.id },
              });
            }}
          >
            x
          </button>
          {/* Resize handle - bottom-right corner */}
          <div
            className="absolute -bottom-1.5 -right-1.5 h-5 w-5 cursor-se-resize rounded-sm border-2 border-white bg-coral shadow"
            onPointerDown={handleResizeStart}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        </>
      )}
    </div>
  );
}
