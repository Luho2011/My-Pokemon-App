export type Pokemon = {
  instanceId: string
  name: string
  img: string
  slot?: string
  position?: number | null
}

export type Route = {
  id: string
  name: string
}

export type PokeApiEntry = {
  name: string
  url: string
}

export type Board = Record<string, Pokemon[]>
