import { useDroppable } from "@dnd-kit/core"
import DraggablePokemon from "./DraggablePokemon"
import type { Pokemon } from "@/lib/types"

const colorVariants = {
  blue: "from-blue-500/90 to-blue-800/90 shadow-blue-900/40",
  yellow: "from-yellow-400/90 to-yellow-700/90 shadow-yellow-900/40",
  purple: "from-purple-500/90 to-purple-800/90 shadow-purple-900/40",
  gray: "from-gray-950/70 to-gray-800/70 shadow-gray-900/40",
}

type ColorVariant = keyof typeof colorVariants

type Props = {
  id: string
  player: string
  pokemonList: Pokemon[]
  color: ColorVariant
  onRemove: (instanceId: string) => void
  rowCount: number
  hoveredRow: number | null
  onHoverRow: (row: number | null) => void
}

export default function SoulLinkColumn({ id, player, pokemonList, color, onRemove, rowCount, hoveredRow, onHoverRow }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  // eine Zelle pro Link-Zeile, leere Zeilen als Platzhalter, damit alle Spalten gleich hoch sind
  const rows = Array.from({ length: rowCount }, (_, row) =>
    pokemonList.find((p) => p.position === row)
  )

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border-4 border-white/70 shadow-2xl bg-linear-to-b ${colorVariants[color]} p-2 min-h-[250px] flex flex-col items-center ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      <h2 className="font-bold mb-2 text-white">{player}</h2>

      <div className="flex flex-col gap-2 items-center">
        {rows.map((p, row) =>
          p ? (
            <DraggablePokemon
              key={p.instanceId}
              pokemon={p}
              onRemove={onRemove}
              linkRow={row}
              highlighted={hoveredRow === row}
              onHover={onHoverRow}
            />
          ) : (
            <div
              key={`empty-${row}`}
              className="h-34 w-76 rounded-2xl border-2 border-dashed border-white/40 flex items-center justify-center text-white/50 text-sm"
            >
              leer
            </div>
          )
        )}
      </div>
    </div>
  )
}
