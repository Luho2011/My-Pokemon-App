import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { instanceId, slot } = await req.json()

const updated = await prisma.pokemon.updateMany({
  where: { instanceId },
  data: { slot },
})

  return Response.json(updated)
}