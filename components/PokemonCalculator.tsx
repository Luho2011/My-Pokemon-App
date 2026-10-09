"use client"
import React, { useEffect, useState } from 'react'
import PokemonSearch from '@/components/PokemonSearch'
import { getPokemonId } from '@/lib/pokemon'
import type { PokeApiEntry } from '@/lib/types'

type Ball = "poke" | "great" | "ultra" | "safari" | "master"
type Status = "none" | "sleep" | "freeze" | "paralysis" | "poison" | "burn"

const BALLS: { value: Ball, label: string }[] = [
  { value: "poke", label: "Pokéball" },
  { value: "great", label: "Superball" },
  { value: "ultra", label: "Hyperball" },
  { value: "safari", label: "Safariball" },
  { value: "master", label: "Meisterball" },
]

const STATUSES: { value: Status, label: string }[] = [
  { value: "none", label: "Keiner" },
  { value: "sleep", label: "Schlaf" },
  { value: "freeze", label: "Gefroren" },
  { value: "paralysis", label: "Paralyse" },
  { value: "poison", label: "Vergiftet" },
  { value: "burn", label: "Verbrannt" },
]

const BALL_BONUS: Record<Ball, number> = { poke: 1, great: 1.5, ultra: 2, safari: 1.5, master: 1 }

// Gen-3-Fangformel (Feuerrot), gleiche Rechnung wie dragonflycave.com
function catchChanceForHp(maxHp: number, curHp: number, catchRate: number, ball: Ball, status: Status) {
  const statusBonus = status === "sleep" || status === "freeze" ? 2 : status === "none" ? 1 : 1.5
  const x = Math.max(1, Math.floor(Math.floor((3 * maxHp - 2 * curHp) * Math.floor(catchRate * BALL_BONUS[ball]) / (3 * maxHp)) * statusBonus))
  if (x >= 255) return 1

  // vier Wackel-Checks, jeder gelingt mit Chance y / 65536
  const y = Math.floor(1048560 / Math.floor(Math.sqrt(Math.floor(Math.sqrt(16711680 / x)))))
  return Math.min(1, y / 65536) ** 4
}

function catchChance(baseHp: number, catchRate: number, level: number, hpPercent: number, ball: Ball, status: Status) {
  if (ball === "master") return 1

  // Max-KP hängt vom unbekannten KP-IV (0–31) ab, daher Durchschnitt über alle IVs; wilde Pokémon haben 0 EVs
  let sum = 0
  for (let iv = 0; iv <= 31; iv++) {
    const maxHp = Math.floor((2 * baseHp + iv) * level / 100) + level + 10
    const curHp = Math.max(1, Math.round(maxHp * hpPercent / 100))
    sum += catchChanceForHp(maxHp, curHp, catchRate, ball, status)
  }
  return sum / 32
}

export default function PokemonCalculator() {
  const [showCalculator, setShowCalculator] = useState(false)
  const [pokemon, setPokemon] = useState<PokeApiEntry | null>(null)
  const [loadedStats, setLoadedStats] = useState<{ id: string, baseHp: number, catchRate: number } | null>(null)
  const [level, setLevel] = useState(5)
  const [hpPercent, setHpPercent] = useState(100)
  const [ball, setBall] = useState<Ball>("poke")
  const [status, setStatus] = useState<Status>("none")

  const id = pokemon ? getPokemonId(pokemon.url) : null

  useEffect(() => {
    if (!id) return
    const pokemonId = id
    async function load() {
      const [pokemonRes, speciesRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ])
      const pokemonData = await pokemonRes.json()
      const speciesData = await speciesRes.json()
      const baseHp = pokemonData.stats.find((s: { stat: { name: string } }) => s.stat.name === "hp").base_stat
      setLoadedStats({ id: pokemonId, baseHp, catchRate: speciesData.capture_rate })
    }
    load()
  }, [id])

  // nur Daten des aktuell gewählten Pokémon verwenden
  const stats = loadedStats?.id === id ? loadedStats : null

  const chance = stats ? catchChance(stats.baseHp, stats.catchRate, level, hpPercent, ball, status) : null
  const percent = chance !== null ? chance * 100 : 0
  const barColor = percent < 20 ? "bg-red-500" : percent < 50 ? "bg-yellow-400" : "bg-green-500"

  return (
    <div className='mt-2'>
        <button
        onClick={() => setShowCalculator(!showCalculator)}
        className='px-4 py-3 rounded-3xl border-4 border-white/70 shadow-2xl
                   bg-linear-to-b from-blue-700/90 to-blue-900/90 shadow-blue-900/40 hover:bg-blue-900 text-white font-bold cursor-pointer'
        >
          <span>Calculator</span>
          <span> ▼ </span>
        </button>
            { showCalculator && (
            <div className='mt-2 w-100 p-4 flex flex-col gap-3 bg-blue-900/90 border-4 border-white/70 rounded-3xl text-white'>
              <PokemonSearch setSelectedPokemon={setPokemon} />

              {pokemon && (
                <div className='flex items-center gap-2'>
                  <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                  />
                  <span className='capitalize font-bold'>{pokemon.name}</span>
                  {stats && <span className='text-sm text-blue-200'>Fangrate {stats.catchRate}</span>}
                </div>
              )}

              <label className='flex justify-between items-center'>
                Level
                <input
                type="number"
                min={1}
                max={100}
                value={level}
                onChange={(e) => setLevel(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                className='w-20 border-2 border-blue-300 p-1 rounded'
                />
              </label>

              <label className='flex justify-between items-center gap-2'>
                KP
                <input
                type="range"
                min={1}
                max={100}
                value={hpPercent}
                onChange={(e) => setHpPercent(Number(e.target.value))}
                className='flex-1'
                />
                <span className='w-12 text-right'>{hpPercent} %</span>
              </label>

              <label className='flex justify-between items-center'>
                Ball
                <select
                value={ball}
                onChange={(e) => setBall(e.target.value as Ball)}
                className='border-2 border-blue-300 p-1 rounded bg-blue-950'
                >
                  {BALLS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>

              <label className='flex justify-between items-center'>
                Status
                <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className='border-2 border-blue-300 p-1 rounded bg-blue-950'
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>

              {chance === null ? (
                <p className='text-sm text-blue-200'>{pokemon ? "Lade..." : "Wähle ein Pokémon aus."}</p>
              ) : (
                <div>
                  <div className='h-6 w-full bg-blue-950 border-2 border-white/70 rounded-full overflow-hidden'>
                    <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }} />
                  </div>
                  <p className='mt-1 text-center font-bold'>
                    {percent.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %
                  </p>
                </div>
              )}
            </div>
            )}
    </div>
  )
}
