"use client"
import { use } from "react"
import { useEffect, useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import PokemonSearch from "@/components/PokemonSearch"
import PokemonCard from "@/components/PokemonCard"
import SoulLinkColumn from "@/components/SoulLinkColumn"
import DeathList from "@/components/DeathList"
import { createPokemon } from "@/lib/createPokemon"


export default function RunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null)
  const [activePokemon, setActivePokemon] = useState<any>(null)
  const [board, setBoard] = useState<any>({
    player1: [],
    player2: [],
    player3: [],
    player4: [],
    death: [],
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  // 🔥 LOAD FROM DB
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/run/${id}`)
      const data = await res.json()

      const grouped: any = {
        player1: [],
        player2: [],
        player3: [],
        player4: [],
        death: [],
      }

      data.pokemon.forEach((p: any) => {
        if (!grouped[p.slot]) grouped[p.slot] = []
        grouped[p.slot].push(p)
      })

      setBoard(grouped)
    }

    load()
  }, [id])

  // 🔥 SEARCH SELECT
const handleSelectPokemon = async (pokemon: any) => {
  const created = createPokemon(pokemon)

  setSelectedPokemon(created)

  await fetch("/api/pokemon/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      runId: id, // deine run id
      ...created,
    }),
  })
}

  // 🔥 DRAG START
  const handleDragStart = (event: any) => {
    setActivePokemon(event.active.data.current)
  }

  // 🔥 DRAG END (DB + UI SYNC)
  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    setActivePokemon(null)
    if (!over) return

    const pokemon = active.data.current
    if (!pokemon?.instanceId) return

    const targetSlot = over.id

    // 🔥 UI UPDATE
    setBoard((prev: any) => {
      const copy = structuredClone(prev)

      for (const key in copy) {
        copy[key] = copy[key].filter(
          (p: any) => p.instanceId !== pokemon.instanceId
        )
      }

      if (!copy[targetSlot]) copy[targetSlot] = []

      copy[targetSlot].push({
        ...pokemon,
        slot: targetSlot,
      })

      return copy
    })

    // 🔥 DB UPDATE
await fetch("/api/pokemon/move", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    instanceId: pokemon.instanceId,
    slot: over.id,
  }),
})

  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 space-y-6 relative flex flex-col items-center">

        <div className="absolute top-1 left-1">
          <PokemonSearch setSelectedPokemon={handleSelectPokemon} />
          {selectedPokemon && (
            <PokemonCard pokemon={selectedPokemon} />
          )}
        </div>

        <div className="flex justify-center gap-3 w-[1310px]">
          <SoulLinkColumn id="player1" player="P1" pokemonList={board.player1} />
          <SoulLinkColumn id="player2" player="P2" pokemonList={board.player2} />
          <SoulLinkColumn id="player3" player="P3" pokemonList={board.player3} />
          <SoulLinkColumn id="player4" player="P4" pokemonList={board.player4} />
        </div>

        <DeathList pokemonList={board.death} />

        <DragOverlay>
          {activePokemon ? (
            <img
              src={activePokemon.img}
              className="w-20 h-20 object-contain"
            />
          ) : null}
        </DragOverlay>

      </div>
    </DndContext>
  )
}