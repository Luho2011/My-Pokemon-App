"use client"
import React, { useState } from 'react'

export default function PokemonStrength() {
    const [showTable, setShowTable] = useState(false)

  return (
    <div>
        <button
        onClick={() => setShowTable(!showTable)}
        className='px-4 py-3 rounded-3xl border-4 border-white/70 shadow-2xl
                   bg-linear-to-b from-blue-700/90 to-blue-900/90 shadow-blue-900/40 hover:bg-blue-900 text-white font-bold cursor-pointer'
        >
          <span>Strength / Weakness</span>
          <span> ▼ </span>
        </button>
            { showTable && (
            <img
            src="/types_table.jpeg"
            alt="table"
            className='w-150 h-150 border-4 rounded-3xl'
            />
            )}
    </div>
  )
}
