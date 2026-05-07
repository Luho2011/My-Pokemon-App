import { useDroppable } from "@dnd-kit/core"
import DraggablePokemon from "./DraggablePokemon"

export default function DeathList({ pokemonList }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: "death" })

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-red-500 rounded-2xl bg-linear-to-br from-red-400 to-red-500 shadow-lg shadow-green-900/20 p-3 mt-6 min-h-[200px] ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      <h2 className="font-bold mb-2">💀 Todesliste</h2>

      <div className="flex flex-wrap gap-2">
        {pokemonList.map((p: any) => (
          <DraggablePokemon key={p.instanceId} pokemon={p} />
        ))}
      </div>
    </div>
  )
}