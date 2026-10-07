import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { instanceId } = await req.json()

  const deleted = await prisma.pokemon.deleteMany({
    where: { instanceId },
  })

  return Response.json(deleted)
}
