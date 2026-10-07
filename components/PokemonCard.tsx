"use client"

import { useDraggable } from "@dnd-kit/core"
import type { Pokemon } from "@/lib/types"

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
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