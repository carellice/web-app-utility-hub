import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PageState } from '../../types/pdf';
import { PageThumbnail } from './PageThumbnail';
import { PageActions } from './PageActions';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { useUiContext } from '../../hooks/useUiContext';

interface SortablePageCardProps {
  page: PageState;
  index: number;
}

export function SortablePageCard({ page, index }: SortablePageCardProps) {
  const { dispatch } = useDocumentContext();
  const { openEditor } = useUiContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative cursor-grab rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
      onClick={() => openEditor(page.id)}
    >
      <div className="flex items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
        <PageThumbnail page={page} />
      </div>
      <p className="mt-2 text-center text-xs text-neutral-500">
        {index + 1}
      </p>
      <PageActions
        onRotate={() => dispatch({ type: 'ROTATE_PAGE', payload: { pageId: page.id, degrees: 90 } })}
        onDelete={() => dispatch({ type: 'DELETE_PAGE', payload: page.id })}
      />
    </div>
  );
}
