"use client"

import { useState } from "react"
import Link from "next/link"

type Order = {
  id: string
  name: string
  items: string
  time: string
  status: "pendiente" | "listo" | "entregado"
}

const mockOrders: Order[] = [
  { id: "001", name: "Diego Ramírez", items: "Latte + Croissant Jamón-Queso", time: "09:14", status: "pendiente" },
  { id: "002", name: "Valentina Torres", items: "Desayuno Full x2", time: "09:22", status: "pendiente" },
  { id: "003", name: "Martín González", items: "Americano Doble + Pie de Limón", time: "09:35", status: "listo" },
  { id: "004", name: "Camila Soto", items: "Proteico + Jugo Naranja", time: "09:41", status: "entregado" },
]

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [showMenu, setShowMenu] = useState(false)
  const [menuText, setMenuText] = useState("")
  const [sent, setSent] = useState(false)

  const markListo = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "listo" } : o)))

  const markEntregado = (id: string) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "entregado" } : o)))

  const handleSendMenu = () => {
    setSent(true)
    setTimeout(() => { setSent(false); setShowMenu(false); setMenuText("") }, 2000)
  }

  const pendientes = orders.filter((o) => o.status === "pendiente")
  const listos = orders.filter((o) => o.status === "listo")
  const entregados = orders.filter((o) => o.status === "entregado")

  return (
    <div className="min-h-screen bg-[#faf7f2] font-[family-name:var(--font-inter)]">

      {/* HEADER */}
      <div className="bg-[#2c1810] px-5 pt-10 pb-6">
        <p className="text-[#a67c5b] text-xs tracking-widest uppercase">Panel del local</p>
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-[#faf7f2] mt-1">
          Coffee and Break
        </h1>
        <div className="flex gap-4 mt-4">
          <div className="bg-[#1a0f0a] rounded-2xl px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-bold text-[#c4a882] font-[family-name:var(--font-playfair)]">
              {pendientes.length}
            </p>
            <p className="text-[#6b4423] text-xs mt-0.5">Pendientes</p>
          </div>
          <div className="bg-[#1a0f0a] rounded-2xl px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-bold text-[#c4a882] font-[family-name:var(--font-playfair)]">
              {listos.length}
            </p>
            <p className="text-[#6b4423] text-xs mt-0.5">Listos</p>
          </div>
          <div className="bg-[#1a0f0a] rounded-2xl px-4 py-3 flex-1 text-center">
            <p className="text-2xl font-bold text-[#c4a882] font-[family-name:var(--font-playfair)]">
              {entregados.length}
            </p>
            <p className="text-[#6b4423] text-xs mt-0.5">Entregados</p>
          </div>
        </div>
      </div>

      {/* PEDIDOS */}
      <div className="px-5 py-6 space-y-3 pb-32">

        {/* PENDIENTES */}
        {pendientes.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">🔴 Pendientes</p>
            <div className="space-y-2">
              {pendientes.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 border-l-4 border-yellow-400 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1810]">{o.name}</p>
                      <p className="text-[#6b4423] text-sm mt-0.5">{o.items}</p>
                      <p className="text-[#a67c5b] text-xs mt-1">{o.time} hrs</p>
                    </div>
                    <button
                      onClick={() => markListo(o.id)}
                      className="bg-[#2c1810] text-white text-sm font-semibold px-4 py-2 rounded-xl flex-shrink-0 active:scale-95 transition-transform"
                    >
                      Listo ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTOS */}
        {listos.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">🟢 Listos para entregar</p>
            <div className="space-y-2">
              {listos.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 border-l-4 border-green-400 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1810]">{o.name}</p>
                      <p className="text-[#6b4423] text-sm mt-0.5">{o.items}</p>
                      <p className="text-[#a67c5b] text-xs mt-1">{o.time} hrs</p>
                    </div>
                    <button
                      onClick={() => markEntregado(o.id)}
                      className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-xl flex-shrink-0 active:scale-95 transition-transform"
                    >
                      Entregado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ENTREGADOS */}
        {entregados.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">✅ Entregados hoy</p>
            <div className="space-y-2">
              {entregados.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl p-4 opacity-50">
                  <p className="font-semibold text-[#2c1810] text-sm line-through">{o.name}</p>
                  <p className="text-[#8b5e3c] text-xs">{o.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LINKS */}
        <div className="pt-4">
          <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">Accesos rápidos</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Ver pantalla", href: "/pantalla", emoji: "🖥️" },
              { label: "Ver carta", href: "/menu", emoji: "📋" },
              { label: "Especial del día", href: "/manager", emoji: "⭐" },
              { label: "Sitio web", href: "/", emoji: "🌐" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="bg-white border border-[#e2d4c0] rounded-2xl p-4 flex items-center gap-2 text-sm text-[#2c1810] hover:border-[#6b4423] transition-colors"
              >
                <span>{l.emoji}</span>
                <span>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTÓN FLOTANTE — MENÚ DEL DÍA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#faf7f2] to-transparent">
        <button
          onClick={() => setShowMenu(true)}
          className="w-full bg-[#2c1810] text-[#faf7f2] py-4 rounded-2xl font-semibold text-base shadow-lg active:scale-95 transition-transform"
        >
          📢 Enviar menú del día por WhatsApp
        </button>
      </div>

      {/* MODAL MENÚ DEL DÍA */}
      {showMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowMenu(false)}>
          <div
            className="bg-white w-full rounded-t-3xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-[#e2d4c0] rounded-full mx-auto mb-6" />
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-1">WhatsApp masivo</p>
            <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[#2c1810] mb-4">
              Menú del día
            </h2>
            <textarea
              value={menuText}
              onChange={(e) => setMenuText(e.target.value)}
              placeholder="Ej: Hoy tenemos Tarta de Limón, Capuccino doble y Sandwich de Ave Palta 🥑☕"
              rows={4}
              className="w-full border-2 border-[#e2d4c0] rounded-2xl p-4 text-[#2c1810] focus:outline-none focus:border-[#6b4423] resize-none text-sm"
            />
            <button
              onClick={handleSendMenu}
              className={`w-full mt-3 py-4 rounded-2xl font-semibold text-base transition-colors ${
                sent ? "bg-green-500 text-white" : "bg-[#2c1810] text-white"
              }`}
            >
              {sent ? "¡Enviado a todos! ✓" : "Enviar a toda la lista →"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
