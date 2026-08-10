import { useContext } from 'react';
import { UiContext } from '../context/UiContext';

export function useUiContext() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUiContext must be used inside UiProvider');
  return ctx;
}
