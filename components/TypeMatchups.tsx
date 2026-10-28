import { getPokemonTypes, getStrengths, getWeaknesses, TYPE_INFO } from "@/lib/pokemon-types"
import { TypeIcon } from "./TypeBadges"

export default function TypeMatchups({ img }: { img: string }) {
  const types = getPokemonTypes(img)
  if (types.length === 0) return null

  const weaknesses = getWeaknesses(types)
  const strengths = getStrengths(types)

  return (
    <div className="flex w-[100px] flex-col gap-1">
      {weaknesses.length > 0 && (
        <div title="Schwach gegen" className="flex flex-wrap gap-0.5 rounded-lg border-2 border-red-500 bg-red-500/15 p-px">
          {weaknesses.map(({ type, multiplier }) => (
            <span key={type} className="relative" title={`${TYPE_INFO[type].label} ×${multiplier}`}>
              <TypeIcon type={type} small />
              {multiplier >= 4 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-0.5 text-[8px] font-bold leading-2.5 text-white">
                  4
                </span>
              )}
            </span>
          ))}
        </div>
      )}
      {strengths.length > 0 && (
        <div title="Effektiv gegen" className="flex flex-wrap gap-0.5 rounded-lg border-2 border-green-600 bg-green-600/15 p-px">
          {strengths.map((type) => (
            <TypeIcon key={type} type={type} small />
          ))}
        </div>
      )}
    </div>
  )
}
