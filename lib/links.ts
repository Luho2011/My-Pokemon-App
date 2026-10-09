import type { Board, Pokemon } from "./types"

export const PLAYER_SLOTS = ["player1", "player2", "player3", "player4"]

export function isPlayerSlot(slot?: string | null) {
  return !!slot && PLAYER_SLOTS.includes(slot)
}

// kleinste Zeile, die in der Spalte noch frei ist
export function firstFreeRow(list: Pokemon[]) {
  const used = new Set(list.map((p) => p.position))
  let row = 0
  while (used.has(row)) row++
  return row
}

// höchste belegte Zeile + 1 über alle Spieler-Spalten
export function rowCount(board: Board) {
  let max = -1
  for (const slot of PLAYER_SLOTS) {
    for (const p of board[slot] ?? []) {
      if (p.position != null && p.position > max) max = p.position
    }
  }
  return max + 1
}

// Klassen statisch ausgeschrieben, damit Tailwind sie erzeugt
const linkColors = [
  { bg: "from-green-300 to-emerald-400", border: "border-green-500", badge: "bg-green-600", ring: "ring-green-300" },
  { bg: "from-sky-300 to-blue-400", border: "border-blue-500", badge: "bg-blue-600", ring: "ring-sky-300" },
  { bg: "from-orange-300 to-red-400", border: "border-red-500", badge: "bg-red-600", ring: "ring-orange-300" },
  { bg: "from-pink-300 to-fuchsia-400", border: "border-fuchsia-500", badge: "bg-fuchsia-600", ring: "ring-pink-300" },
  { bg: "from-yellow-200 to-amber-400", border: "border-amber-500", badge: "bg-amber-600", ring: "ring-yellow-200" },
  { bg: "from-teal-200 to-cyan-400", border: "border-cyan-500", badge: "bg-cyan-600", ring: "ring-teal-200" },
  { bg: "from-violet-300 to-indigo-400", border: "border-indigo-500", badge: "bg-indigo-600", ring: "ring-violet-300" },
  { bg: "from-stone-200 to-stone-400", border: "border-stone-500", badge: "bg-stone-600", ring: "ring-stone-200" },
]

export function linkColor(row: number) {
  return linkColors[row % linkColors.length]
}
