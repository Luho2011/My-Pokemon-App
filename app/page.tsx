import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default function Home() {

  async function createRun() {
    "use server"

    const run = await prisma.run.create({
      data: {},
    })

    redirect(`/run/${run.id}`)
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <form action={createRun}>
        <button className="px-6 py-3 bg-black text-white rounded cursor-pointer">
          Run starten
        </button>
      </form>
    </main>
  )
}
