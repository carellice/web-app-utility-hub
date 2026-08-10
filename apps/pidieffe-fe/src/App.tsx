import { useEffect } from 'react';
import { useUiContext } from './hooks/useUiContext';
import { MainLayout } from './components/layout/MainLayout';
import { UploadZone } from './components/upload/UploadZone';
import { PageGrid } from './components/grid/PageGrid';
import { EditorView } from './components/editor/EditorView';

function AppContent({ logoSrc }: { logoSrc: string }) {
  const { ui } = useUiContext();

  useEffect(() => {
    if (ui.viewMode === 'upload') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [ui.viewMode]);

  return (
    <MainLayout logoSrc={logoSrc}>
      {ui.viewMode === 'upload' && <UploadZone logoSrc={logoSrc} />}
      {ui.viewMode === 'grid' && <PageGrid />}
      {ui.viewMode === 'editor' && <EditorView />}
    </MainLayout>
  );
}

export default function App({ logoSrc = '/logo.png' }: { logoSrc?: string }) {
  return <AppContent logoSrc={logoSrc} />;
}
