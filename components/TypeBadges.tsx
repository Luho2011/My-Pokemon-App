import { getPokemonTypes, TYPE_INFO } from "@/lib/pokemon-types"

export default function TypeBadges({ img }: { img: string }) {
  const types = getPokemonTypes(img)
  if (types.length === 0) return null

  return (
    <>
      {types.map((type) => {
        const { label, color } = TYPE_INFO[type]
        return (
          <span
            key={type}
            title={label}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/80 shadow-sm ${color}`}
          >
            <img src={`/types/${type}.svg`} alt={label} className="h-5 w-5" />
          </span>
        )
      })}
    </>
  )
}
