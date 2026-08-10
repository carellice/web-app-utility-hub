import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { ViewMode, ActiveTool, UiState } from '../types/pdf';

interface UiContextValue {
  ui: UiState;
  setViewMode: (mode: ViewMode) => void;
  setSelectedPageId: (id: string | null) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setSelectedAnnotationId: (id: string | null) => void;
  openEditor: (pageId: string) => void;
  goToGrid: () => void;
}

export const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [ui, setUi] = useState<UiState>({
    viewMode: 'upload',
    selectedPageId: null,
    activeTool: 'select',
    selectedAnnotationId: null,
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setUi((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setSelectedPageId = useCallback((id: string | null) => {
    setUi((prev) => ({ ...prev, selectedPageId: id }));
  }, []);

  const setActiveTool = useCallback((tool: ActiveTool) => {
    setUi((prev) => ({ ...prev, activeTool: tool, selectedAnnotationId: null }));
  }, []);

  const setSelectedAnnotationId = useCallback((id: string | null) => {
    setUi((prev) => ({ ...prev, selectedAnnotationId: id }));
  }, []);

  const openEditor = useCallback((pageId: string) => {
    setUi((prev) => ({
      ...prev,
      viewMode: 'editor',
      selectedPageId: pageId,
      activeTool: 'select',
      selectedAnnotationId: null,
    }));
  }, []);

  const goToGrid = useCallback(() => {
    setUi((prev) => ({
      ...prev,
      viewMode: 'grid',
      selectedPageId: null,
      activeTool: 'select',
      selectedAnnotationId: null,
    }));
  }, []);

  return (
    <UiContext.Provider
      value={{
        ui,
        setViewMode,
        setSelectedPageId,
        setActiveTool,
        setSelectedAnnotationId,
        openEditor,
        goToGrid,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}
