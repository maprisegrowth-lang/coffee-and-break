"use client"

import { useState, useEffect } from "react"
import type { EspecialSlot } from "@/app/api/especial/route"

export default function ManagerPage() {
  const [especiales, setEspeciales] = useState<EspecialSlot[]>([])
  const [editing, setEditing] = useState<EspecialSlot | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/especial")
      .then((r) => r.json())
      .then((data) => { setEspeciales(data); setLoading(false) })
  }, [])

  const handleEdit = (slot: EspecialSlot) => setEditing({ ...slot })

  const handleSave = async () => {
    if (!editing) return
    await fetch("/api/especial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    })
    setEspeciales((prev) => prev.map((e) => e.tipo === editing.tipo ? editing : e))
    setSaved(true)
    setTimeout(() => { setSaved(false); setEditing(null) }, 1800)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center font-[family-name:var(--font-inter)]">
        <p className="text-[#8b5e3c]">Cargando...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] font-[family-name:var(--font-inter)]">

      {/* HEADER */}
      <div className="bg-[#2c1810] px-6 pt-12 pb-8 text-center">
        <p className="text-[#a67c5b] text-xs tracking-[0.3em] uppercase mb-2">Panel del encargado</p>
        <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[#faf7f2]">
          Menú del día
        </h1>
        <p className="text-[#6b4423] text-sm mt-2">
          Toca cualquier sección para editar
        </p>
      </div>

      {/* SLOTS */}
      <div className="px-5 py-6 space-y-3 max-w-lg mx-auto">
        {especiales.map((slot) => (
          <button
            key={slot.tipo}
            onClick={() => handleEdit(slot)}
            className="w-full bg-white border-2 border-[#e2d4c0] rounded-2xl p-5 text-left hover:border-[#6b4423] transition-colors active:scale-95"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{slot.emoji}</span>
                <span className="text-xs uppercase tracking-widest text-[#8b5e3c] font-medium">
                  {slot.label}
                </span>
              </div>
              <span className="text-xs text-[#c4a882] border border-[#e2d4c0] px-2 py-1 rounded-full">
                Editar →
              </span>
            </div>
            <p className="font-[family-name:var(--font-playfair)] text-[#2c1810] text-lg">
              {slot.nombre}
            </p>
            <p className="text-[#8b5e3c] text-sm mt-0.5 line-clamp-1">{slot.descripcion}</p>
            <p className="text-[#6b4423] font-semibold mt-2">
              ${slot.precio.toLocaleString("es-CL")}
            </p>
          </button>
        ))}
      </div>

      {/* MODAL EDICIÓN */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setEditing(null)}>
          <div
            className="bg-white w-full rounded-t-3xl p-6 pb-10 max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[#e2d4c0] rounded-full mx-auto mb-6" />

            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">{editing.emoji}</span>
              <h2 className="text-xl font-[family-name:var(--font-playfair)] text-[#2c1810]">
                {editing.label}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#8b5e3c] block mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editing.nombre}
                  onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
                  className="w-full border-2 border-[#e2d4c0] rounded-2xl px-4 py-4 text-[#2c1810] text-lg focus:outline-none focus:border-[#6b4423] bg-[#faf7f2]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#8b5e3c] block mb-2">
                  Descripción
                </label>
                <textarea
                  value={editing.descripcion}
                  onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
                  rows={2}
                  className="w-full border-2 border-[#e2d4c0] rounded-2xl px-4 py-3 text-[#2c1810] focus:outline-none focus:border-[#6b4423] resize-none bg-[#faf7f2]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-[#8b5e3c] block mb-2">
                  Precio
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b5e3c]">$</span>
                  <input
                    type="number"
                    value={editing.precio}
                    onChange={(e) => setEditing({ ...editing, precio: Number(e.target.value) })}
                    className="w-full border-2 border-[#e2d4c0] rounded-2xl pl-8 pr-4 py-4 text-[#2c1810] text-lg focus:outline-none focus:border-[#6b4423] bg-[#faf7f2]"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`w-full py-5 rounded-2xl text-lg font-semibold transition-all ${
                  saved ? "bg-green-500 text-white" : "bg-[#2c1810] text-[#faf7f2]"
                }`}
              >
                {saved ? "¡Actualizado en pantalla! ✓" : "Guardar y publicar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
