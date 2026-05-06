import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const { runId, name, img, instanceId } = body

  const pokemon = await prisma.pokemon.create({
    data: {
      runId,
      name,
      img,
      instanceId,
      slot: "bench",
    },
  })

  return Response.json(pokemon)
}