import { useUiContext } from '../../hooks/useUiContext';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import type { ActiveTool, Annotation } from '../../types/pdf';

interface ToolPanelProps {
  onOpenSavedImages?: () => void;
  onSaveToStamps?: () => void;
}

export function ToolPanel({ onOpenSavedImages, onSaveToStamps }: ToolPanelProps) {
  const { ui, setActiveTool, goToGrid } = useUiContext();
  const { state, dispatch } = useDocumentContext();

  const currentPage = state.pages.find((p) => p.id === ui.selectedPageId);
  const selectedAnnotation = currentPage?.annotations.find(
    (a) => a.id === ui.selectedAnnotationId
  );

  const tools: { key: ActiveTool; label: string; icon: string }[] = [
    { key: 'select', label: 'Seleziona', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122' },
    { key: 'text', label: 'Aggiungi testo', icon: 'M4 7V4h16v3M9 20h6M12 4v16' },
    { key: 'image', label: 'Immagine', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="flex flex-col gap-1">
      <p className="mb-1 hidden text-xs font-semibold uppercase tracking-wider text-neutral-400 md:block">
        Strumenti
      </p>

      {tools.map((tool) => (
        <button
          type="button"
          key={tool.key}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
            ui.activeTool === tool.key
              ? 'bg-coral text-white'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTool(tool.key);
          }}
          title={tool.label}
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tool.icon} />
          </svg>
          <span>{tool.label}</span>
        </button>
      ))}

      {/* Image annotation controls */}
      {selectedAnnotation && selectedAnnotation.type === 'image' && onSaveToStamps && (
        <div className="mt-2 border-t border-neutral-200 pt-2">
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onSaveToStamps();
            }}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span>Salva nei timbri</span>
          </button>
        </div>
      )}

      {/* Text annotation controls */}
      {selectedAnnotation && selectedAnnotation.type === 'text' && (
        <div className="mt-2 border-t border-neutral-200 pt-2">
          <label className="mb-1 block text-xs text-neutral-500">Dimensione</label>
          <input
            type="range"
            min={8}
            max={72}
            value={selectedAnnotation.fontSize ?? 16}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_ANNOTATION',
                payload: { ...selectedAnnotation, fontSize: Number(e.target.value) } as Annotation,
              })
            }
            className="w-full"
          />
          <label className="mb-1 mt-2 block text-xs text-neutral-500">Colore</label>
          <input
            type="color"
            value={selectedAnnotation.fontColor ?? '#000000'}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_ANNOTATION',
                payload: { ...selectedAnnotation, fontColor: e.target.value } as Annotation,
              })
            }
            className="h-8 w-full cursor-pointer rounded border border-neutral-200"
          />
        </div>
      )}

      <div className="mt-2 border-t border-neutral-200 pt-2">
        {onOpenSavedImages && (
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onOpenSavedImages();
            }}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Timbri salvati</span>
          </button>
        )}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            goToGrid();
          }}
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Griglia</span>
        </button>
      </div>
    </div>
  );
}
