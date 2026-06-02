import React, { useEffect, useState } from 'react'

type Routes = {
  id: string
  name: string
}

type PokemonRoutesProps = {
  id: string
  routes: Routes[]
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
     <>
       <div className='flex'> 
        <input
            type="text"
            value={routeInput}
            onChange={(e) => setRouteInput(e.target.value)}
            placeholder="Add Route..."
            className="rounded-xl border-2 border-white/90 bg-black/90 px-3 py-2 text-white outline-none"
        />
        <button onClick={addRoute}
                className=" rounded-xl bg-red-600 px-4 py-2 text-white font-bold cursor-pointer"
        >
            Add
        </button>
       </div> 

         <div className="mt-1 flex flex-col gap-1">
            {routes1.map((route) => (
                <div key={route.id}
                     className=" rounded-xl bg-black/90 px-3 py-2 text-white"
                >
                 {route.name}
                </div>
            ))}
         </div>
     </>
    )}
    </div>
  )
}

