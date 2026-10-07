"use client"

import { useDraggable } from "@dnd-kit/core"
import type { Pokemon } from "@/lib/types"

type Props = {
  pokemon: Pokemon
  onRemove: (instanceId: string) => void
}

export default function DraggablePokemon({ pokemon, onRemove }: Props) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: pokemon.instanceId,
    data: pokemon,
  })

  return (
    <div className="relative border-3 border-green-400 rounded-2xl bg-linear-to-br from-green-300 to-emerald-400 shadow-lg shadow-green-900/20 px-22">
      <button
        type="button"
        aria-label="Pokémon entfernen"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onRemove(pokemon.instanceId)}
        className="absolute top-1 right-2 text-black font-bold text-xl leading-none cursor-pointer hover:scale-125 transition-transform"
      >
        ×
      </button>
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
