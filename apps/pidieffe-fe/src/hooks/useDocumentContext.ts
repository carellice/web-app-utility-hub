import { useContext } from 'react';
import { DocumentContext } from '../context/DocumentContext';

export function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocumentContext must be used inside DocumentProvider');
  return ctx;
}
