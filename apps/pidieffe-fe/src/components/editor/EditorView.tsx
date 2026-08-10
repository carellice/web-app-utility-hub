import { useCallback, useMemo, useState } from 'react';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';
import { useSavedImages } from '../../hooks/useSavedImages';
import { PageCanvas } from './PageCanvas';
import { AnnotationLayer } from './AnnotationLayer';
import { ToolPanel } from './ToolPanel';
import { SavedImagesModal } from './SavedImagesModal';
import { IconButton } from '../common/IconButton';
import type { ActiveTool, Annotation, SavedImage } from '../../types/pdf';

let stampIdCounter = 0;

function MobileToolBar({ onOpenSavedImages }: { onOpenSavedImages: () => void }) {
  const { ui, setActiveTool, goToGrid } = useUiContext();

  const tools: { key: ActiveTool; label: string; icon: string }[] = [
    { key: 'select', label: 'Seleziona', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
    { key: 'text', label: 'Testo', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
    { key: 'image', label: 'Immagine', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <>
      {tools.map((tool) => (
        <button
          type="button"
          key={tool.key}
          className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-colors ${
            ui.activeTool === tool.key
              ? 'bg-coral text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
          onClick={(e) => { e.stopPropagation(); setActiveTool(tool.key); }}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
          </svg>
          <span>{tool.label}</span>
        </button>
      ))}
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100"
        onClick={(e) => { e.stopPropagation(); onOpenSavedImages(); }}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span>Timbri</span>
      </button>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-100"
        onClick={(e) => { e.stopPropagation(); goToGrid(); }}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        <span>Griglia</span>
      </button>
    </>
  );
}

export function EditorView() {
  const { state, dispatch } = useDocumentContext();
  const { ui, setSelectedPageId, setSelectedAnnotationId } = useUiContext();
  const { savedImages, addImage, removeImage } = useSavedImages();
  const [stampModalOpen, setStampModalOpen] = useState(false);

  const currentPageIndex = useMemo(
    () => state.pages.findIndex((p) => p.id === ui.selectedPageId),
    [state.pages, ui.selectedPageId]
  );

  const currentPage = currentPageIndex >= 0 ? state.pages[currentPageIndex] : null;

  const goToPrev = useCallback(() => {
    if (currentPageIndex > 0) {
      setSelectedPageId(state.pages[currentPageIndex - 1].id);
    }
  }, [currentPageIndex, state.pages, setSelectedPageId]);

  const goToNext = useCallback(() => {
    if (currentPageIndex < state.pages.length - 1) {
      setSelectedPageId(state.pages[currentPageIndex + 1].id);
    }
  }, [currentPageIndex, state.pages, setSelectedPageId]);

  const handleInsertSavedImage = useCallback(
    (savedImage: SavedImage) => {
      if (!currentPage) return;

      const img = new Image();
      img.onload = () => {
        const baseWidth = 20;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        // Approximate A4 page ratio (width/height ≈ 0.707)
        const heightPct = (baseWidth * 0.707) / imgAspect;

        const annotation: Annotation = {
          id: `stamp-${++stampIdCounter}-${Date.now()}`,
          pageId: currentPage.id,
          type: 'image',
          x: 40,
          y: Math.max(0, 50 - heightPct / 2),
          width: baseWidth,
          height: heightPct,
          content: savedImage.dataUrl,
        };
        dispatch({ type: 'ADD_ANNOTATION', payload: annotation });
        setSelectedAnnotationId(annotation.id);
      };
      img.onerror = () => {
        // Fallback: insert with square proportions
        const annotation: Annotation = {
          id: `stamp-${++stampIdCounter}-${Date.now()}`,
          pageId: currentPage.id,
          type: 'image',
          x: 40,
          y: 40,
          width: 20,
          height: 20,
          content: savedImage.dataUrl,
        };
        dispatch({ type: 'ADD_ANNOTATION', payload: annotation });
        setSelectedAnnotationId(annotation.id);
      };
      img.src = savedImage.dataUrl;
    },
    [currentPage, dispatch, setSelectedAnnotationId]
  );

  const handleSaveToStamps = useCallback(() => {
    if (!currentPage || !ui.selectedAnnotationId) return;
    const ann = currentPage.annotations.find((a) => a.id === ui.selectedAnnotationId);
    if (!ann || ann.type !== 'image') return;
    addImage('Timbro', ann.content);
  }, [currentPage, ui.selectedAnnotationId, addImage]);

  if (!currentPage) return null;

  return (
    <div className="flex h-full">
      {/* Sidebar - desktop */}
      <div className="hidden w-48 shrink-0 flex-col border-r border-neutral-200 bg-white p-3 md:flex">
        <ToolPanel
          onOpenSavedImages={() => setStampModalOpen(true)}
          onSaveToStamps={handleSaveToStamps}
        />
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 flex-col">
        {/* Page navigation */}
        <div className="flex items-center justify-center gap-4 border-b border-neutral-200 bg-white px-4 py-2">
          <IconButton label="Pagina precedente" onClick={goToPrev} disabled={currentPageIndex <= 0}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </IconButton>
          <span className="text-sm text-neutral-600">
            {currentPageIndex + 1} / {state.pages.length}
          </span>
          <IconButton
            label="Pagina successiva"
            onClick={goToNext}
            disabled={currentPageIndex >= state.pages.length - 1}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </IconButton>
        </div>

        {/* Canvas area */}
        <div className="flex flex-1 items-start justify-center overflow-auto bg-neutral-200 p-4 md:p-8">
          <div className="relative inline-block shadow-xl">
            <PageCanvas page={currentPage} />
            <AnnotationLayer page={currentPage} />
          </div>
        </div>

        {/* Bottom bar - mobile */}
        <div className="flex items-center justify-center gap-2 border-t border-neutral-200 bg-white px-3 py-2 md:hidden">
          <MobileToolBar onOpenSavedImages={() => setStampModalOpen(true)} />
        </div>
      </div>

      <SavedImagesModal
        open={stampModalOpen}
        onClose={() => setStampModalOpen(false)}
        savedImages={savedImages}
        onAdd={addImage}
        onRemove={removeImage}
        onSelect={handleInsertSavedImage}
      />
    </div>
  );
}
