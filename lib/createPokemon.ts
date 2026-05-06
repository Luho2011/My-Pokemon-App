export function createPokemon(pokemon: any) {
  const id = pokemon.url.split("/").filter(Boolean).pop()

  return {
    name: pokemon.name,
    url: pokemon.url,
    img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    instanceId: crypto.randomUUID(),
  }
}