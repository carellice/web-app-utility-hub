import { useRef, useState, useCallback, useEffect } from 'react';
import type { Annotation } from '../../types/pdf';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';

interface TextAnnotationProps {
  annotation: Annotation;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function TextAnnotation({ annotation, containerRef }: TextAnnotationProps) {
  const { dispatch } = useDocumentContext();
  const { ui, setSelectedAnnotationId } = useUiContext();
  const textRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isSelected = ui.selectedAnnotationId === annotation.id;
  const isEmpty = annotation.content.trim() === '';

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (ui.activeTool !== 'select') return;
      e.stopPropagation();
      e.preventDefault();
      setSelectedAnnotationId(annotation.id);
      setDragging(true);

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const currentX = (annotation.x / 100) * rect.width;
      const currentY = (annotation.y / 100) * rect.height;
      dragOffset.current = {
        x: e.clientX - rect.left - currentX,
        y: e.clientY - rect.top - currentY,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [annotation, containerRef, ui.activeTool, setSelectedAnnotationId]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
      const y = ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100;
      dispatch({
        type: 'UPDATE_ANNOTATION',
        payload: { ...annotation, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) },
      });
    },
    [dragging, annotation, containerRef, dispatch]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleBlur = useCallback(() => {
    const el = textRef.current;
    if (!el) return;
    const text = el.textContent ?? '';
    if (text.trim() === '') {
      dispatch({ type: 'DELETE_ANNOTATION', payload: { pageId: annotation.pageId, annotationId: annotation.id } });
    } else {
      dispatch({ type: 'UPDATE_ANNOTATION', payload: { ...annotation, content: text } });
    }
  }, [annotation, dispatch]);

  useEffect(() => {
    if (isSelected && textRef.current && isEmpty) {
      textRef.current.focus();
    }
  }, [isSelected, isEmpty]);

  return (
    <div
      className={`absolute cursor-move select-none ${isSelected ? 'ring-2 ring-coral ring-offset-1' : ''}`}
      style={{
        left: `${annotation.x}%`,
        top: `${annotation.y}%`,
        fontSize: `${annotation.fontSize ?? 16}px`,
        color: annotation.fontColor ?? '#000000',
        minWidth: '60px',
        minHeight: '1.5em',
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        className={`outline-none rounded px-1 ${
          isEmpty
            ? 'border border-dashed border-coral/60 bg-coral/5'
            : isSelected
              ? 'bg-white/50'
              : ''
        }`}
        style={{ minWidth: '60px', minHeight: '1.5em' }}
        data-placeholder="Scrivi qui..."
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={(e) => {
          e.stopPropagation();
          (e.target as HTMLElement).focus();
        }}
      >
        {annotation.content}
      </div>
      {isSelected && (
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
      )}
    </div>
  );
}
