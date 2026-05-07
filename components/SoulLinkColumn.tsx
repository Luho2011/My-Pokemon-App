import { useDroppable } from "@dnd-kit/core"
import DraggablePokemon from "./DraggablePokemon"

const colorVariants = {
  blue: "from-blue-500/90 to-blue-800/90 shadow-blue-900/40",
  yellow: "from-yellow-400/90 to-yellow-700/90 shadow-yellow-900/40",
  purple: "from-purple-500/90 to-purple-800/90 shadow-purple-900/40",
  gray: "from-gray-950/70 to-gray-800/70 shadow-gray-900/40",
}

type ColorVariant = keyof typeof colorVariants

type Pokemon = {
  instanceId: string
  name: string
  img: string
}

type Props = {
  id: string
  player: string
  pokemonList: Pokemon[]
  color: ColorVariant
}

export default function SoulLinkColumn({ id, player, pokemonList, color }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border-4 border-white/70 shadow-2xl bg-linear-to-b ${colorVariants[color]} p-2 min-h-[250px] flex flex-col items-center ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      <h2 className="font-bold mb-2 text-white">{player}</h2>

      <div className="flex flex-col gap-2 items-center">
        {pokemonList.map((p: any) => (
          <DraggablePokemon key={p.instanceId} pokemon={p} />
        ))}
      </div>
    </div>
  )
}