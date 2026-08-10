import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useDocumentContext } from '../../hooks/useDocumentContext';
import { SortablePageCard } from './SortablePageCard';
import { MergeButton } from './MergeButton';
import { PageThumbnail } from './PageThumbnail';

export function PageGrid() {
  const { state, dispatch } = useDocumentContext();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = state.pages.findIndex((p) => p.id === active.id);
        const newIndex = state.pages.findIndex((p) => p.id === over.id);
        const reordered = arrayMove(state.pages, oldIndex, newIndex);
        dispatch({ type: 'REORDER_PAGES', payload: reordered });
      }
    },
    [state.pages, dispatch]
  );

  const activePage = activeId ? state.pages.find((p) => p.id === activeId) : null;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-dark">
          {state.pages.length} {state.pages.length === 1 ? 'pagina' : 'pagine'}
        </h2>
        <MergeButton />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={state.pages.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {state.pages.map((page, index) => (
              <SortablePageCard key={page.id} page={page} index={index} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activePage && (
            <div className="rounded-xl border border-coral bg-white p-3 shadow-lg">
              <PageThumbnail page={activePage} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
