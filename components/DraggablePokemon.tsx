"use client"

import { useDraggable } from "@dnd-kit/core"

export default function DraggablePokemon({ pokemon }: any) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: pokemon.instanceId,
    data: pokemon,
  })

  return (
    <div className="border-3 border-green-400 rounded-2xl bg-linear-to-br from-green-300 to-emerald-400 shadow-lg shadow-green-900/20 px-22">
      <img
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        src={pokemon.img}
        className="w-30 h-30 object-contain cursor-grab"
      />
    </div>
  )
}