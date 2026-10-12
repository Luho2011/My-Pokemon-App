import React, { useEffect, useState } from 'react'
import type { Route } from '@/lib/types'

type PokemonRoutesProps = {
  id: string
  routes: Route[]
}


export default function PokemonRoutes({ routes, id }: PokemonRoutesProps) {
    const [showRoutes, setShowRoutes] = useState(false)
    const [routes1, setRoutes1] = useState(routes)
    const [routeInput, setRouteInput] = useState("")

    useEffect(() => {
      setRoutes1(routes)
    }, [routes])

    const addRoute = async () => {
  if (!routeInput.trim()) return

    const res = await fetch("/api/routes/create", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        runId: id,
        name: routeInput,
        }),
    })

  const newRoute = await res.json()

  setRoutes1((prev) => [...prev, newRoute])

  setRouteInput("")
}

  return (
    <div className='flex flex-col'>
        <button
            onClick={() => setShowRoutes(!showRoutes)}
            className='px-4 py-3 rounded-3xl border-4 border-white/70 shadow-2xl
                    bg-linear-to-b from-blue-700/90 to-blue-900/90 shadow-blue-900/40 hover:bg-blue-900 text-white font-bold cursor-pointer'
            >
            <span>Routes</span>
            <span> ▼ </span>
        </button>

    { showRoutes && (
     <div className='mt-2 w-100 p-4 flex flex-col gap-3 bg-blue-900/90 border-4 border-white/70 rounded-3xl text-white'>
       <div className='flex gap-2'>
        <input
            type="text"
            value={routeInput}
            onChange={(e) => setRouteInput(e.target.value)}
            placeholder="Add Route..."
            className="flex-1 border-2 border-blue-300 p-2 rounded bg-transparent text-white placeholder:text-blue-200 outline-none"
        />
        <button onClick={addRoute}
                className="px-4 py-2 rounded-2xl border-2 border-white/70 bg-linear-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold cursor-pointer"
        >
            Add
        </button>
       </div>

       {routes1.length === 0 ? (
         <p className="text-sm text-blue-200">Noch keine Routen.</p>
       ) : (
         <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {routes1.map((route) => (
                <div key={route.id}
                     className="rounded-2xl bg-blue-950 border-2 border-blue-400 px-3 py-2"
                >
                 {route.name}
                </div>
            ))}
         </div>
       )}
     </div>
    )}
    </div>
  )
}

