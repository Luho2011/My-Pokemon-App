"use client"

import { useDraggable } from "@dnd-kit/core"
import type { Pokemon } from "@/lib/types"
import { linkColor } from "@/lib/links"

type Props = {
  pokemon: Pokemon
  onRemove: (instanceId: string) => void
  linkRow?: number
  highlighted?: boolean
  onHover?: (row: number | null) => void
}

export default function DraggablePokemon({ pokemon, onRemove, linkRow, highlighted, onHover }: Props) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: pokemon.instanceId,
    data: pokemon,
  })

  const color = linkRow != null ? linkColor(linkRow) : null
  const frame = color
    ? `border-4 ${color.border} ${highlighted ? `ring-4 ${color.ring} scale-105` : ""}`
    : "border-3 border-green-400"
  const background = color ? color.bg : "from-green-300 to-emerald-400"

  return (
    <div
      onMouseEnter={() => linkRow != null && onHover?.(linkRow)}
      onMouseLeave={() => linkRow != null && onHover?.(null)}
      className={`relative h-34 rounded-2xl bg-linear-to-br ${background} shadow-lg shadow-green-900/20 px-22 transition-transform ${frame}`}
    >
      {color && (
        <span className={`absolute top-1 left-2 rounded-full px-2 text-xs font-bold text-white ${color.badge}`}>
          🔗 {linkRow! + 1}
        </span>
      )}
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
        alt={pokemon.name}
        className="w-30 h-30 object-contain cursor-grab"
      />
    </div>
  )
}
