import { createContext, useReducer, type ReactNode } from 'react';
import { documentReducer, initialDocumentState, type DocumentAction } from './documentReducer';
import type { DocumentState } from '../types/pdf';

interface DocumentContextValue {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
}

export const DocumentContext = createContext<DocumentContextValue | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState);

  return (
    <DocumentContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  );
}
