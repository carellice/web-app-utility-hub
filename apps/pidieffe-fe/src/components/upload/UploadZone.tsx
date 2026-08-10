import { useState, useCallback, useRef } from 'react';
import { usePdfLoader } from '../../hooks/usePdfLoader';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ACCEPTED_FILE_TYPES } from '../../constants/config';

export function UploadZone({ logoSrc }: { logoSrc: string }) {
  const { loadPdf } = usePdfLoader();
  const { state } = useDocumentContext();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') {
        alert('Per favore seleziona un file PDF.');
        return;
      }
      loadPdf(file);
    },
    [loadPdf]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (state.loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner message="Caricamento PDF..." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <img src={logoSrc} alt="PIDIEFFE" className="mx-auto mb-4 h-24 w-24" />
        <h1 className="mb-2 text-2xl font-bold text-slate-dark">PIDIEFFE</h1>
        <p className="text-neutral-600">
          Manipola i tuoi PDF direttamente nel browser.
          <br />
          Nessun upload su server, tutto locale.
        </p>
      </div>

      <div
        className={`flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors ${
          dragOver
            ? 'border-coral bg-coral/5'
            : 'border-neutral-300 hover:border-coral hover:bg-neutral-100'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <svg className="mb-4 h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="mb-1 text-sm font-medium text-neutral-700">
          Trascina qui il tuo PDF
        </p>
        <p className="text-xs text-neutral-500">oppure clicca per selezionare</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {state.error && (
        <p className="mt-4 text-sm text-red-600">{state.error}</p>
      )}
    </div>
  );
}
