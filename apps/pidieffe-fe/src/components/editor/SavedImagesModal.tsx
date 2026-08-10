import { useRef } from 'react';
import { Modal } from '../common/Modal';
import { readFileAsDataURL } from '../../lib/fileUtils';
import { ACCEPTED_IMAGE_TYPES } from '../../constants/config';
import type { SavedImage } from '../../types/pdf';

interface SavedImagesModalProps {
  open: boolean;
  onClose: () => void;
  savedImages: SavedImage[];
  onAdd: (name: string, dataUrl: string) => void;
  onRemove: (id: string) => void;
  onSelect: (image: SavedImage) => void;
}

export function SavedImagesModal({
  open,
  onClose,
  savedImages,
  onAdd,
  onRemove,
  onSelect,
}: SavedImagesModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      const name = file.name.replace(/\.[^.]+$/, '');
      onAdd(name, dataUrl);
    } catch (err) {
      console.error('Errore nel caricamento immagine:', err);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-4 text-lg font-semibold text-neutral-800">Timbri salvati</h2>

      {savedImages.length === 0 ? (
        <p className="mb-4 text-sm text-neutral-500">
          Nessun timbro salvato. Carica un&apos;immagine per iniziare.
        </p>
      ) : (
        <div className="mb-4 grid max-h-64 grid-cols-3 gap-3 overflow-y-auto">
          {savedImages.map((img) => (
            <div key={img.id} className="group relative">
              <button
                type="button"
                className="flex w-full cursor-pointer flex-col items-center rounded-lg border border-neutral-200 p-2 transition-colors hover:border-coral hover:bg-coral/5"
                onClick={() => {
                  onSelect(img);
                  onClose();
                }}
              >
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="mb-1 h-16 w-full object-contain"
                  draggable={false}
                />
                <span className="w-full truncate text-center text-xs text-neutral-600">
                  {img.name}
                </span>
              </button>
              <button
                type="button"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(img.id);
                }}
                title="Elimina"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 cursor-pointer rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral/90"
          onClick={() => fileRef.current?.click()}
        >
          Carica nuova
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-50"
          onClick={onClose}
        >
          Chiudi
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={handleFileChange}
      />
    </Modal>
  );
}
