import { prisma } from "@/lib/prisma"
import { PLAYER_SLOTS, isPlayerSlot } from "@/lib/links"

export async function POST(req: Request) {
  const { instanceId, slot, position } = await req.json()

  // Link-Tod: stirbt ein gelinktes Pokémon, wandert die ganze Zeile in die Todesliste
  if (slot === "death") {
    const pokemon = await prisma.pokemon.findUnique({ where: { instanceId } })
    if (!pokemon) return Response.json({ moved: [] })

    if (isPlayerSlot(pokemon.slot) && pokemon.position != null) {
      const where = {
        runId: pokemon.runId,
        slot: { in: PLAYER_SLOTS },
        position: pokemon.position,
      }
      const linked = await prisma.pokemon.findMany({ where, select: { instanceId: true } })
      await prisma.pokemon.updateMany({ where, data: { slot: "death", position: null } })
      return Response.json({ moved: linked.map((p) => p.instanceId) })
    }
  }

  await prisma.pokemon.updateMany({
    where: { instanceId },
    data: { slot, position: isPlayerSlot(slot) ? position ?? null : null },
  })

  return Response.json({ moved: [instanceId] })
}
