import { getPokemonTypes, TYPE_INFO, type PokemonType } from "@/lib/pokemon-types"

export function TypeIcon({ type, small }: { type: PokemonType; small?: boolean }) {
  const { label, color } = TYPE_INFO[type]
  return (
    <span
      title={label}
      className={`flex items-center justify-center rounded-full shadow-sm ${color} ${
        small ? "h-[22px] w-[22px] border border-white/80" : "h-8 w-8 border-2 border-white/80"
      }`}
    >
      <img src={`/types/${type}.svg`} alt={label} className={small ? "h-3.5 w-3.5" : "h-5 w-5"} />
    </span>
  )
}

export default function TypeBadges({ img }: { img: string }) {
  const types = getPokemonTypes(img)
  if (types.length === 0) return null

  return (
    <>
      {types.map((type) => (
        <TypeIcon key={type} type={type} />
      ))}
    </>
  )
}
