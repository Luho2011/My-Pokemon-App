import { pokemonDEtoEN } from "./pokemon-names"

export function normalizePokemonQuery(query: string) {
  return (
    pokemonDEtoEN[query.toLowerCase()] ||
    query.toLowerCase()
  )
}

export async function getFirst151Pokemon() {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  )

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon")
  }

  const data = await res.json()

  return data.results as {
    name: string
    url: string
  }[]
}

export function getPokemonId(url: string) {
  return url.split("/").filter(Boolean).pop()
}