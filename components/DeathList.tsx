import { useDroppable } from "@dnd-kit/core"
import DraggablePokemon from "./DraggablePokemon"

export default function DeathList({ pokemonList }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: "death" })

  return (
    <div
      ref={setNodeRef}
      className={`border p-3 mt-6 min-h-[200px] bg-red-300 ${
        isOver ? "bg-red-100" : ""
      }`}
    >
      <h2 className="font-bold mb-2">💀 Deathlist</h2>

      <div className="flex flex-wrap gap-2">
        {pokemonList.map((p: any) => (
          <DraggablePokemon key={p.instanceId} pokemon={p} />
        ))}
      </div>
    </div>
  )
}