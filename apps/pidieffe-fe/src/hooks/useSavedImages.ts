import { useState, useCallback } from 'react';
import type { SavedImage } from '../types/pdf';

const STORAGE_KEY = 'pidieffe-saved-images';

function loadImages(): SavedImage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedImage[]) : [];
  } catch {
    return [];
  }
}

function persist(images: SavedImage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

export function useSavedImages() {
  const [savedImages, setSavedImages] = useState<SavedImage[]>(loadImages);

  const addImage = useCallback((name: string, dataUrl: string) => {
    setSavedImages((prev) => {
      const next = [...prev, { id: `si-${Date.now()}`, name, dataUrl }];
      persist(next);
      return next;
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setSavedImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const renameImage = useCallback((id: string, name: string) => {
    setSavedImages((prev) => {
      const next = prev.map((img) => (img.id === id ? { ...img, name } : img));
      persist(next);
      return next;
    });
  }, []);

  return { savedImages, addImage, removeImage, renameImage };
}
