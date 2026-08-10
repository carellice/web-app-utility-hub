import type { DocumentState, PageState, Annotation, SourceDocument } from '../types/pdf';

export type DocumentAction =
  | { type: 'LOAD_PDF_START' }
  | { type: 'LOAD_PDF_SUCCESS'; payload: { sourceDoc: SourceDocument; pages: PageState[]; name: string } }
  | { type: 'LOAD_PDF_ERROR'; payload: string }
  | { type: 'MERGE_PDF_SUCCESS'; payload: { sourceDoc: SourceDocument; pages: PageState[] } }
  | { type: 'REORDER_PAGES'; payload: PageState[] }
  | { type: 'ROTATE_PAGE'; payload: { pageId: string; degrees: number } }
  | { type: 'DELETE_PAGE'; payload: string }
  | { type: 'ADD_ANNOTATION'; payload: Annotation }
  | { type: 'UPDATE_ANNOTATION'; payload: Annotation }
  | { type: 'DELETE_ANNOTATION'; payload: { pageId: string; annotationId: string } }
  | { type: 'RESET' };

export const initialDocumentState: DocumentState = {
  pages: [],
  sourceDocuments: [],
  documentName: '',
  loading: false,
  error: null,
};

export function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case 'LOAD_PDF_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_PDF_SUCCESS':
      return {
        ...state,
        loading: false,
        pages: action.payload.pages,
        sourceDocuments: [action.payload.sourceDoc],
        documentName: action.payload.name,
      };

    case 'LOAD_PDF_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'MERGE_PDF_SUCCESS':
      return {
        ...state,
        loading: false,
        pages: [...state.pages, ...action.payload.pages],
        sourceDocuments: [...state.sourceDocuments, action.payload.sourceDoc],
      };

    case 'REORDER_PAGES':
      return { ...state, pages: action.payload };

    case 'ROTATE_PAGE':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.payload.pageId
            ? { ...p, rotation: (p.rotation + action.payload.degrees) % 360 }
            : p
        ),
      };

    case 'DELETE_PAGE':
      return {
        ...state,
        pages: state.pages.filter((p) => p.id !== action.payload),
      };

    case 'ADD_ANNOTATION':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.payload.pageId
            ? { ...p, annotations: [...p.annotations, action.payload] }
            : p
        ),
      };

    case 'UPDATE_ANNOTATION':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.payload.pageId
            ? {
                ...p,
                annotations: p.annotations.map((a) =>
                  a.id === action.payload.id ? action.payload : a
                ),
              }
            : p
        ),
      };

    case 'DELETE_ANNOTATION':
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === action.payload.pageId
            ? {
                ...p,
                annotations: p.annotations.filter((a) => a.id !== action.payload.annotationId),
              }
            : p
        ),
      };

    case 'RESET':
      return initialDocumentState;

    default:
      return state;
  }
}
