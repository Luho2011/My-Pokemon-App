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
    <main 
      className="flex h-screen items-center justify-center bg-cover"
      style={{
      backgroundImage: "url('/poke-bg.JPG')",
    }}>
      <form action={createRun}>
        <button className="px-6 py-3 bg-black text-white hover:bg-gray-600 rounded cursor-pointer mt-30">
          Run starten
        </button>
      </form>
    </main>
  )
}
