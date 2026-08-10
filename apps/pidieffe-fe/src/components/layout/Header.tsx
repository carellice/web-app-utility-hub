import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';
import { useExportPdf } from '../../hooks/useExportPdf';
import { Button } from '../common/Button';
import { APP_NAME, APP_WEBSITE } from '../../constants/config';

export function Header({ logoSrc }: { logoSrc: string }) {
  const { state } = useDocumentContext();
  const { ui, goToGrid } = useUiContext();
  const { doExport, exporting } = useExportPdf();

  const showActions = ui.viewMode !== 'upload' && state.pages.length > 0;

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <a href={APP_WEBSITE} target="_blank" rel="noopener noreferrer" title="Vai al sito">
          <img
            src={logoSrc}
            alt={APP_NAME}
            className="h-8 w-8 rounded transition-opacity hover:opacity-80"
          />
        </a>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-dark">{APP_NAME}</span>
          {state.documentName && (
            <span className="max-w-[200px] truncate text-xs text-neutral-500">
              {state.documentName}
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-2">
          {ui.viewMode === 'editor' && (
            <Button variant="ghost" size="sm" onClick={goToGrid}>
              Griglia
            </Button>
          )}
          <Button size="sm" onClick={doExport} disabled={exporting}>
            {exporting ? 'Esportando...' : 'Esporta PDF'}
          </Button>
        </div>
      )}
    </header>
  );
}
