"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Square, CheckSquare, Trash2 } from "lucide-react";
import { TodoItem } from "../types/notes";
import {
  useTodoItems,
  useAddTodoItem,
  useToggleTodoItem,
  useDeleteTodoItem,
  useReorderTodoItems,
} from "../hooks/useTodoItems";

function SortableTodoRow({
  item,
  onToggle,
  onDelete,
}: {
  item: TodoItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-1"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab text-neutral-300 touch-none"
      >
        <GripVertical size={13} />
      </button>
      <button type="button" onClick={onToggle}>
        {item.done ? (
          <CheckSquare size={16} className="text-green-600" />
        ) : (
          <Square size={16} className="text-neutral-300" />
        )}
      </button>
      <span
        className={`flex-1 text-sm ${item.done ? "line-through text-neutral-400" : "text-neutral-900"}`}
      >
        {item.text}
      </span>
      <button
        type="button"
        onClick={onDelete}
        className="text-neutral-300 hover:text-red-500"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

export function TodoItemsEditor({ noteId }: { noteId: string }) {
  const { data: items = [] } = useTodoItems(noteId);
  const addItem = useAddTodoItem(noteId);
  const toggleItem = useToggleTodoItem(noteId);
  const deleteItem = useDeleteTodoItem(noteId);
  const reorderItems = useReorderTodoItems(noteId);

  const [newItemText, setNewItemText] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    reorderItems.mutate(reordered.map((i) => i.id));
  }

  return (
    <div className="flex flex-col gap-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableTodoRow
              key={item.id}
              item={item}
              onToggle={() =>
                toggleItem.mutate({ itemId: item.id, done: !item.done })
              }
              onDelete={() => deleteItem.mutate(item.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 mt-1">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newItemText.trim()) {
              addItem.mutate(newItemText.trim());
              setNewItemText("");
            }
          }}
          placeholder="عنصر جديد..."
          className="flex-1 rounded-lg border border-dashed border-neutral-300 px-3 py-1.5 text-xs"
        />
      </div>
    </div>
  );
}
