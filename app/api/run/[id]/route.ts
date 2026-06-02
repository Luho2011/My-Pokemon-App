import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: any) {
  const run = await prisma.run.findUnique({
    where: { id: params.id },
    include: { 
      pokemon: true,
      routes: true, 
    },
  })

  return Response.json(run)
}