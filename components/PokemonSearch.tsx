"use client"

import { useEffect, useState, useRef  } from "react"
import { getFirst151Pokemon, getPokemonId, normalizePokemonQuery } from "@/lib/pokemon"


export default function PokemonSearch({
      setSelectedPokemon,
}: {
  setSelectedPokemon: (p: any) => void
}) {
    
  const [pokemon, setPokemon] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const data = await getFirst151Pokemon()
      setPokemon(data)
    }

    load()
  }, [])

    // 🔥 CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setQuery("") // 👈 schließt Liste
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


    const filtered =
    query.trim().length > 0
    ? pokemon.filter((p) =>
        p.name.toLowerCase().includes(
          normalizePokemonQuery(query)
        )
      )
    : []
    

  return (
    <div ref={wrapperRef} className="max-w-md">
      <input
        className="border p-2 rounded"
        placeholder="Suche Pokémon..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-2 bg-white border rounded shadow w-[212px]">
        {filtered.map((p) => {
          const id = getPokemonId(p.url)
          return (
            <div
              key={p.name}
                onClick={() => {
                  setSelectedPokemon(p)
                  setQuery("") // 👈 auch schließen nach Auswahl
                }}
              className="flex items-center p-1 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={p.name}
              />
              <span className="capitalize">{p.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}