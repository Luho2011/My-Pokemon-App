"use client"

import { useDraggable } from "@dnd-kit/core"

export default function PokemonCard({ pokemon }: any) {
  if (!pokemon?.img) return null // 🔥 safety

  const { setNodeRef, listeners, attributes } = useDraggable({
    id: pokemon.instanceId,
    data: pokemon,
  })

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={pokemon.img}
      className="w-20 h-20 object-contain cursor-grab"
      alt={pokemon.name}
    />
  )
}