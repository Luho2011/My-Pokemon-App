"use client"
import { use } from "react"
import { useEffect, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
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
import PokemonStrength from "@/components/PokemonStrength"
import PokemonCalculator from "@/components/PokemonCalculator"
import PokemonRoutes from "@/components/PokemonRoutes"
import type { Board, PokeApiEntry, Pokemon, Route } from "@/lib/types"
import { PLAYER_SLOTS, firstFreeRow, isPlayerSlot, rowCount } from "@/lib/links"


export default function RunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [activePokemon, setActivePokemon] = useState<Pokemon | null>(null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [board, setBoard] = useState<Board>({
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

  //  LOAD FROM DB
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/run/${id}`)
      const data = await res.json()

      const grouped: Board = {
        player1: [],
        player2: [],
        player3: [],
        player4: [],
        death: [],
      }

      // geht die liste (db) der pokemon des run durch in api/run/ und holt alle pokemon als data. dann checken, wo es sich befindet
      ;(data.pokemon as Pokemon[]).forEach((p) => {
        // befindet sich das pokemon nicht in player1-4 oder death, dann erstelle grouped[bench]. hat pokemon slot = player1, push es grouped[player1].push(gluamanda)
        const slot = p.slot ?? "bench"
        if (!grouped[slot]) grouped[slot] = []
        grouped[slot].push(p)
      })

      // Link-Zeilen: ältere Pokémon ohne position bekommen die erste freie Zeile und werden gespeichert
      for (const slot of PLAYER_SLOTS) {
        const placed = grouped[slot].filter((p) => p.position != null)
        for (const p of grouped[slot].filter((p) => p.position == null)) {
          p.position = firstFreeRow(placed)
          placed.push(p)
          fetch("/api/pokemon/move", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceId: p.instanceId, slot, position: p.position }),
          })
        }
        grouped[slot] = placed
      }

      setBoard(grouped)
      setRoutes(data.routes || [])
    }

    load()
  }, [id])

  //  SEARCH SELECT
const handleSelectPokemon = async (pokemon: PokeApiEntry) => {
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

  //  DRAG START
  const handleDragStart = (event: DragStartEvent) => {
    setActivePokemon(event.active.data.current as Pokemon)
  }

  //  DRAG END (DB + UI SYNC)
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    setActivePokemon(null)
    if (!over) return

    const pokemon = active.data.current as Pokemon | undefined
    if (!pokemon?.instanceId) return

    const targetSlot = String(over.id)
    if (pokemon.slot === targetSlot) return

    // in eine Spieler-Spalte: erste freie Link-Zeile dieser Spalte
    const position = isPlayerSlot(targetSlot)
      ? firstFreeRow(board[targetSlot] ?? [])
      : null

    // stirbt ein gelinktes Pokémon, kommen alle Partner der Zeile mit
    const linkDeath =
      targetSlot === "death" && isPlayerSlot(pokemon.slot) && pokemon.position != null

    //  UI UPDATE
    setBoard((prev) => {
      const copy = structuredClone(prev)

      if (linkDeath) {
        for (const slot of PLAYER_SLOTS) {
          const linked = copy[slot].filter((p) => p.position === pokemon.position)
          copy[slot] = copy[slot].filter((p) => p.position !== pokemon.position)
          copy.death.push(...linked.map((p) => ({ ...p, slot: "death", position: null })))
        }
        return copy
      }

      for (const key in copy) {
        copy[key] = copy[key].filter(
          (p) => p.instanceId !== pokemon.instanceId
        )
      }

      if (!copy[targetSlot]) copy[targetSlot] = []

      copy[targetSlot].push({
        ...pokemon,
        slot: targetSlot,
        position,
      })

      return copy
    })

    if (pokemon.instanceId === selectedPokemon?.instanceId) setSelectedPokemon(null)

    //  DB UPDATE
await fetch("/api/pokemon/move", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    instanceId: pokemon.instanceId,
    slot: targetSlot,
    position,
  }),
})

  }

  //  REMOVE (UI + DB)
  const handleRemovePokemon = async (instanceId: string) => {
    setBoard((prev) => {
      const copy = structuredClone(prev)
      for (const key in copy) {
        copy[key] = copy[key].filter((p) => p.instanceId !== instanceId)
      }
      return copy
    })

    await fetch("/api/pokemon/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instanceId }),
    })
  }

  const rows = rowCount(board)

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="px-2 py-2 relative flex flex-col items-center min-h-screen bg-[url('/run-bg.png')] bg-cover bg-center">
        <div className="w-80 object-contain top-0 mb-2">
            <img
              src="/logo.png"
              alt="Logo"
            />
        </div>
        <div className="absolute top-1 left-1 z-50">
          <PokemonSearch setSelectedPokemon={handleSelectPokemon} />
          {selectedPokemon && (
            <PokemonCard pokemon={selectedPokemon} />
          )}
          <div className="absolute left-4 mt-10 z-50 w-200">
            <PokemonStrength />
            <PokemonCalculator />
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {(["blue", "yellow", "purple", "gray"] as const).map((color, i) => (
            <SoulLinkColumn
              key={PLAYER_SLOTS[i]}
              id={PLAYER_SLOTS[i]}
              player={`P${i + 1}`}
              pokemonList={board[PLAYER_SLOTS[i]]}
              color={color}
              onRemove={handleRemovePokemon}
              rowCount={rows}
              hoveredRow={hoveredRow}
              onHoverRow={setHoveredRow}
            />
          ))}
        </div>

        <DeathList pokemonList={board.death} onRemove={handleRemovePokemon} />

        <DragOverlay>
          {activePokemon ? (
            <img
              src={activePokemon.img}
              className="w-20 h-20 object-contain"
            />
          ) : null}
        </DragOverlay>

          <div className="absolute right-15 mt-45 z-50">
            <PokemonRoutes id={id} routes={routes} />
          </div>

      </div>
    </DndContext>
  )
}