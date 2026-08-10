export interface SourceDocument {
  id: string;
  name: string;
  data: Uint8Array;
}

export interface Annotation {
  id: string;
  pageId: string;
  type: 'text' | 'image';
  x: number; // percentage of page width (0-100)
  y: number; // percentage of page height (0-100)
  width: number; // percentage
  height: number; // percentage
  content: string; // text content or base64 data URL
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
}

export interface PageState {
  id: string;
  sourceDocId: string;
  sourcePageIndex: number; // 0-based index in the source PDF
  rotation: number; // 0, 90, 180, 270
  annotations: Annotation[];
}

export interface DocumentState {
  pages: PageState[];
  sourceDocuments: SourceDocument[];
  documentName: string;
  loading: boolean;
  error: string | null;
}

export interface SavedImage {
  id: string;
  name: string;
  dataUrl: string;
}

export type ViewMode = 'upload' | 'grid' | 'editor';

export type ActiveTool = 'select' | 'text' | 'image';

export interface UiState {
  viewMode: ViewMode;
  selectedPageId: string | null;
  activeTool: ActiveTool;
  selectedAnnotationId: string | null;
}
