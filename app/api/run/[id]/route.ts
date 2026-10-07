import { prisma } from "@/lib/prisma"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const run = await prisma.run.findUnique({
    where: { id },
    include: { 
      pokemon: true,
      routes: true, 
    },
  })

  return Response.json(run)
}