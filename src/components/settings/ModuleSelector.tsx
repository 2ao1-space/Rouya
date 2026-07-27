"use client"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AppModuleDefinition, AppModuleId } from "@/types/settings"

interface ModuleSelectorProps {
  allModules: AppModuleDefinition[]
  selectedIds: AppModuleId[]
  onChange: (ids: AppModuleId[]) => void
}

function SortableModuleItem({ module }: { module: AppModuleDefinition }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: module.id,
  })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-lg bg-white border border-neutral-200 px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="اسحب للترتيب"
        className="cursor-grab text-neutral-400 touch-none"
      >
        <i className="ti ti-grip-vertical text-sm" aria-hidden="true" />
      </button>
      <i className={`ti ${module.icon} text-sm`} aria-hidden="true" />
      <span className="text-sm">{module.label}</span>
    </div>
  )
}

export function ModuleSelector({ allModules, selectedIds, onChange }: ModuleSelectorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function toggleModule(id: AppModuleId) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((m) => m !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = selectedIds.indexOf(active.id as AppModuleId)
    const newIndex = selectedIds.indexOf(over.id as AppModuleId)
    onChange(arrayMove(selectedIds, oldIndex, newIndex))
  }

  const selectedModules = selectedIds
    .map((id) => allModules.find((m) => m.id === id))
    .filter((m): m is AppModuleDefinition => Boolean(m))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-neutral-500 mb-2">اختار الصفحات اللي عايزها</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {allModules.map((module) => {
            const isSelected = selectedIds.includes(module.id)
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => toggleModule(module.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                  isSelected
                    ? "border-2 border-neutral-900 bg-neutral-900 text-white"
                    : "border border-dashed border-neutral-300 text-neutral-500"
                }`}
              >
                <i className={`ti ${module.icon} text-sm`} aria-hidden="true" />
                {module.label}
                {isSelected && (
                  <i className="ti ti-check text-sm mr-auto" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedModules.length > 0 && (
        <div>
          <p className="text-xs text-neutral-500 mb-2">
            رتّب صفحاتك (زي ما هتظهر في الناف بار)
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={selectedModules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {selectedModules.map((module) => (
                  <SortableModuleItem key={module.id} module={module} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}