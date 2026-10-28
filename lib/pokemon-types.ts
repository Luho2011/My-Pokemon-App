export type PokemonType =
  | "normal" | "fire" | "water" | "grass" | "electric" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic"
  | "bug" | "rock" | "ghost" | "dragon" | "dark" | "steel"

// Klassen statisch ausgeschrieben, damit Tailwind sie erzeugt
export const TYPE_INFO: Record<PokemonType, { label: string; color: string }> = {
  normal: { label: "Normal", color: "bg-[#A8A77A]" },
  fire: { label: "Feuer", color: "bg-[#EE8130]" },
  water: { label: "Wasser", color: "bg-[#6390F0]" },
  grass: { label: "Pflanze", color: "bg-[#63BC5A]" },
  electric: { label: "Elektro", color: "bg-[#F7D02C]" },
  ice: { label: "Eis", color: "bg-[#96D9D6]" },
  fighting: { label: "Kampf", color: "bg-[#C22E28]" },
  poison: { label: "Gift", color: "bg-[#A33EA1]" },
  ground: { label: "Boden", color: "bg-[#E2BF65]" },
  flying: { label: "Flug", color: "bg-[#89AAE3]" },
  psychic: { label: "Psycho", color: "bg-[#F95587]" },
  bug: { label: "Käfer", color: "bg-[#A6B91A]" },
  rock: { label: "Gestein", color: "bg-[#B6A136]" },
  ghost: { label: "Geist", color: "bg-[#735797]" },
  dragon: { label: "Drache", color: "bg-[#6F35FC]" },
  dark: { label: "Unlicht", color: "bg-[#705746]" },
  steel: { label: "Stahl", color: "bg-[#B7B7CE]" },
}

type Types = [PokemonType] | [PokemonType, PokemonType]

// Gen-3-Typen, Index 0 = Pokédex-Nr. 1
const TYPES_BY_DEX: Types[] = [
  ["grass", "poison"], ["grass", "poison"], ["grass", "poison"], // 1-3
  ["fire"], ["fire"], ["fire", "flying"], // 4-6
  ["water"], ["water"], ["water"], // 7-9
  ["bug"], ["bug"], ["bug", "flying"], // 10-12
  ["bug", "poison"], ["bug", "poison"], ["bug", "poison"], // 13-15
  ["normal", "flying"], ["normal", "flying"], ["normal", "flying"], // 16-18
  ["normal"], ["normal"], // 19-20
  ["normal", "flying"], ["normal", "flying"], // 21-22
  ["poison"], ["poison"], // 23-24
  ["electric"], ["electric"], // 25-26
  ["ground"], ["ground"], // 27-28
  ["poison"], ["poison"], ["poison", "ground"], // 29-31
  ["poison"], ["poison"], ["poison", "ground"], // 32-34
  ["normal"], ["normal"], // 35-36
  ["fire"], ["fire"], // 37-38
  ["normal"], ["normal"], // 39-40
  ["poison", "flying"], ["poison", "flying"], // 41-42
  ["grass", "poison"], ["grass", "poison"], ["grass", "poison"], // 43-45
  ["bug", "grass"], ["bug", "grass"], // 46-47
  ["bug", "poison"], ["bug", "poison"], // 48-49
  ["ground"], ["ground"], // 50-51
  ["normal"], ["normal"], // 52-53
  ["water"], ["water"], // 54-55
  ["fighting"], ["fighting"], // 56-57
  ["fire"], ["fire"], // 58-59
  ["water"], ["water"], ["water", "fighting"], // 60-62
  ["psychic"], ["psychic"], ["psychic"], // 63-65
  ["fighting"], ["fighting"], ["fighting"], // 66-68
  ["grass", "poison"], ["grass", "poison"], ["grass", "poison"], // 69-71
  ["water", "poison"], ["water", "poison"], // 72-73
  ["rock", "ground"], ["rock", "ground"], ["rock", "ground"], // 74-76
  ["fire"], ["fire"], // 77-78
  ["water", "psychic"], ["water", "psychic"], // 79-80
  ["electric", "steel"], ["electric", "steel"], // 81-82
  ["normal", "flying"], // 83
  ["normal", "flying"], ["normal", "flying"], // 84-85
  ["water"], ["water", "ice"], // 86-87
  ["poison"], ["poison"], // 88-89
  ["water"], ["water", "ice"], // 90-91
  ["ghost", "poison"], ["ghost", "poison"], ["ghost", "poison"], // 92-94
  ["rock", "ground"], // 95
  ["psychic"], ["psychic"], // 96-97
  ["water"], ["water"], // 98-99
  ["electric"], ["electric"], // 100-101
  ["grass", "psychic"], ["grass", "psychic"], // 102-103
  ["ground"], ["ground"], // 104-105
  ["fighting"], ["fighting"], // 106-107
  ["normal"], // 108
  ["poison"], ["poison"], // 109-110
  ["ground", "rock"], ["ground", "rock"], // 111-112
  ["normal"], // 113
  ["grass"], // 114
  ["normal"], // 115
  ["water"], ["water"], // 116-117
  ["water"], ["water"], // 118-119
  ["water"], ["water", "psychic"], // 120-121
  ["psychic"], // 122
  ["bug", "flying"], // 123
  ["ice", "psychic"], // 124
  ["electric"], // 125
  ["fire"], // 126
  ["bug"], // 127
  ["normal"], // 128
  ["water"], ["water", "flying"], // 129-130
  ["water", "ice"], // 131
  ["normal"], // 132
  ["normal"], ["water"], ["electric"], ["fire"], // 133-136
  ["normal"], // 137
  ["rock", "water"], ["rock", "water"], // 138-139
  ["rock", "water"], ["rock", "water"], // 140-141
  ["rock", "flying"], // 142
  ["normal"], // 143
  ["ice", "flying"], ["electric", "flying"], ["fire", "flying"], // 144-146
  ["dragon"], ["dragon"], ["dragon", "flying"], // 147-149
  ["psychic"], ["psychic"], // 150-151
]

export const POKEMON_TYPES: Record<number, PokemonType[]> = Object.fromEntries(
  TYPES_BY_DEX.map((types, i) => [i + 1, types])
)

// Pokédex-Nr. steckt im Sprite-URL (.../pokemon/1.png)
export function getPokemonTypes(img: string): PokemonType[] {
  const match = img.match(/(\d+)\.png$/)
  return match ? POKEMON_TYPES[Number(match[1])] ?? [] : []
}

// Gen-3-Typentabelle: Angreifer → Verteidiger
const SUPER_EFFECTIVE: Record<PokemonType, PokemonType[]> = {
  normal: [],
  fire: ["grass", "ice", "bug", "steel"],
  water: ["fire", "ground", "rock"],
  grass: ["water", "ground", "rock"],
  electric: ["water", "flying"],
  ice: ["grass", "ground", "flying", "dragon"],
  fighting: ["normal", "ice", "rock", "dark", "steel"],
  poison: ["grass"],
  ground: ["fire", "electric", "poison", "rock", "steel"],
  flying: ["grass", "fighting", "bug"],
  psychic: ["fighting", "poison"],
  bug: ["grass", "psychic", "dark"],
  rock: ["fire", "ice", "flying", "bug"],
  ghost: ["psychic", "ghost"],
  dragon: ["dragon"],
  dark: ["psychic", "ghost"],
  steel: ["ice", "rock"],
}

const NOT_VERY_EFFECTIVE: Record<PokemonType, PokemonType[]> = {
  normal: ["rock", "steel"],
  fire: ["fire", "water", "rock", "dragon"],
  water: ["water", "grass", "dragon"],
  grass: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"],
  electric: ["electric", "grass", "dragon"],
  ice: ["fire", "water", "ice", "steel"],
  fighting: ["poison", "flying", "psychic", "bug"],
  poison: ["poison", "ground", "rock", "ghost"],
  ground: ["grass", "bug"],
  flying: ["electric", "rock", "steel"],
  psychic: ["psychic", "steel"],
  bug: ["fire", "fighting", "poison", "flying", "ghost", "steel"],
  rock: ["fighting", "ground", "steel"],
  ghost: ["dark", "steel"],
  dragon: ["steel"],
  dark: ["fighting", "dark", "steel"],
  steel: ["fire", "water", "electric", "steel"],
}

const IMMUNE: Partial<Record<PokemonType, PokemonType[]>> = {
  normal: ["ghost"],
  electric: ["ground"],
  fighting: ["ghost"],
  poison: ["steel"],
  ground: ["flying"],
  psychic: ["dark"],
  ghost: ["normal"],
}

const ALL_TYPES = Object.keys(TYPE_INFO) as PokemonType[]

function effectiveness(attacker: PokemonType, defender: PokemonType): number {
  if (IMMUNE[attacker]?.includes(defender)) return 0
  if (SUPER_EFFECTIVE[attacker].includes(defender)) return 2
  if (NOT_VERY_EFFECTIVE[attacker].includes(defender)) return 0.5
  return 1
}

// Angriffstypen, die gegen dieses Pokémon mind. 2× treffen (4× zuerst)
export function getWeaknesses(types: PokemonType[]): { type: PokemonType; multiplier: number }[] {
  return ALL_TYPES.map((type) => ({
    type,
    multiplier: types.reduce((m, def) => m * effectiveness(type, def), 1),
  }))
    .filter(({ multiplier }) => multiplier >= 2)
    .sort((a, b) => b.multiplier - a.multiplier)
}

// Typen, gegen die mind. einer der eigenen Typen sehr effektiv ist
export function getStrengths(types: PokemonType[]): PokemonType[] {
  return [...new Set(types.flatMap((t) => SUPER_EFFECTIVE[t]))]
}
