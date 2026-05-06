import { useDroppable } from "@dnd-kit/core"
import DraggablePokemon from "./DraggablePokemon"

export default function SoulLinkColumn({ id, player, pokemonList }: any) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`border-2 p-2 rounded min-h-[250px] bg-gray-100 ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      <h2 className="font-bold mb-2">{player}</h2>

      <div className="flex flex-col gap-2 items-center">
        {pokemonList.map((p: any) => (
          <DraggablePokemon key={p.instanceId} pokemon={p} />
        ))}
      </div>
    </div>
  )
}