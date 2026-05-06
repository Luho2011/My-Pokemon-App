"use client"

import { useDraggable } from "@dnd-kit/core"

export default function DraggablePokemon({ pokemon }: any) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: pokemon.instanceId,
    data: pokemon,
  })

  return (
    <div className="bg-green-300 px-22">
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