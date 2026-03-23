"use client"

import { useState, useEffect } from "react"
import { menu, formatPrice, MenuItem } from "@/data/menu"

type OrderItem = MenuItem & { qty: number; catName: string }

type ClosedOrder = {
  id: string
  items: { name: string; qty: number; price: number }[]
  total: number
  pago: "efectivo" | "tarjeta"
  timestamp: string
}

const DEFAULT_PLATO = { nombre: "Plato del día", precio: 0 }

export default function CajaPage() {
  const [activeCat, setActiveCat] = useState(0)
  const [order, setOrder] = useState<OrderItem[]>([])
  const [confirm, setConfirm] = useState<"efectivo" | "tarjeta" | null>(null)
  const [success, setSuccess] = useState(false)
  const [history, setHistory] = useState<ClosedOrder[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [plato, setPlato] = useState(DEFAULT_PLATO)
  const [editingPlato, setEditingPlato] = useState(false)
  const [platoForm, setPlatoForm] = useState(DEFAULT_PLATO)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("cb_orders")
    if (saved) setHistory(JSON.parse(saved))
    const savedPlato = localStorage.getItem("cb_plato")
    if (savedPlato) setPlato(JSON.parse(savedPlato))
    setMounted(true)
  }, [])

  const savePlato = async () => {
    setPlato(platoForm)
    localStorage.setItem("cb_plato", JSON.stringify(platoForm))
    await fetch("/api/plato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(platoForm),
    })
    setEditingPlato(false)
  }

  const addItem = (item: MenuItem) => {
    setOrder((prev) => {
      const existing = prev.find((o) => o.name === item.name)
      if (existing) return prev.map((o) => o.name === item.name ? { ...o, qty: o.qty + 1 } : o)
      return [...prev, { ...item, qty: 1, catName: menu[activeCat].name }]
    })
  }

  const removeItem = (name: string) => {
    setOrder((prev) => {
      const existing = prev.find((o) => o.name === name)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter((o) => o.name !== name)
      return prev.map((o) => o.name === name ? { ...o, qty: o.qty - 1 } : o)
    })
  }

  const total = order.reduce((sum, o) => sum + o.price * o.qty, 0)

  const cobrar = (metodo: "efectivo" | "tarjeta") => {
    if (order.length === 0) return
    setConfirm(metodo)
  }

  const confirmarPago = () => {
    if (!confirm) return

    // Solo aquí se guarda — cuando se confirma el pago
    const newOrder: ClosedOrder = {
      id: `${Date.now()}`,
      items: order.map((o) => ({ name: o.name, qty: o.qty, price: o.price })),
      total,
      pago: confirm,
      timestamp: new Date().toISOString(),
    }

    const updated = [newOrder, ...history]
    setHistory(updated)
    localStorage.setItem("cb_orders", JSON.stringify(updated))

    setOrder([])
    setConfirm(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const totalHoy = history
    .filter((o) => new Date(o.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0)

  const pedidosHoy = history.filter(
    (o) => new Date(o.timestamp).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="h-screen w-screen bg-[#faf7f2] flex flex-col overflow-hidden font-[family-name:var(--font-inter)]">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#2c1810] flex-shrink-0">
        <h1 className="text-white font-[family-name:var(--font-playfair)] text-xl">
          Coffee <span className="italic text-[#c4a882]">and Break</span>
        </h1>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[#c4a882] font-semibold">{pedidosHoy} pedidos · {formatPrice(totalHoy)}</p>
            <p className="text-[#6b4423] text-xs">ventas de hoy</p>
          </div>
          <button
            onClick={() => setShowHistory(true)}
            className="text-[#a67c5b] text-sm border border-[#4a2c1a] rounded-xl px-3 py-1.5 hover:border-[#c4a882] transition-colors"
          >
            Historial
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — ITEMS */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* CATEGORY TABS */}
          <div className="flex gap-0 bg-white border-b border-[#e2d4c0] flex-shrink-0 overflow-x-auto">
            {menu.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(i)}
                className="flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-colors border-b-2"
                style={{
                  borderBottomColor: i === activeCat ? "#2c1810" : "transparent",
                  color: i === activeCat ? "#2c1810" : "#8b5e3c",
                  background: i === activeCat ? "#faf7f2" : "white",
                }}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* ITEMS GRID */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 gap-3">

              {/* PLATO DEL DÍA — siempre visible en primera posición */}
              {activeCat === 0 && mounted && (
                <div className="relative col-span-1">
                  <button
                    onClick={() => addItem({ name: plato.nombre, price: plato.precio })}
                    disabled={plato.precio === 0}
                    className="w-full bg-[#2c1810] border-2 border-[#2c1810] rounded-2xl p-4 text-left active:scale-95 transition-all disabled:opacity-40"
                  >
                    {order.find((o) => o.name === plato.nombre) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#c4a882] text-[#2c1810] text-xs flex items-center justify-center font-bold">
                        {order.find((o) => o.name === plato.nombre)?.qty}
                      </div>
                    )}
                    <p className="text-[#c4a882] text-xs uppercase tracking-wider mb-1">⭐ Del día</p>
                    <p className="font-medium text-white text-sm leading-tight pr-6">{plato.nombre}</p>
                    <p className="text-[#c4a882] font-semibold mt-2">
                      {plato.precio > 0 ? formatPrice(plato.precio) : "Sin precio"}
                    </p>
                  </button>
                  <button
                    onClick={() => { setPlatoForm(plato); setEditingPlato(true) }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#6b4423] text-white text-xs flex items-center justify-center"
                  >
                    ✏️
                  </button>
                </div>
              )}

              {menu[activeCat].items.map((item) => {
                const inOrder = order.find((o) => o.name === item.name)
                return (
                  <button
                    key={item.name}
                    onClick={() => addItem(item)}
                    className="relative bg-white border-2 rounded-2xl p-4 text-left transition-all active:scale-95"
                    style={{ borderColor: inOrder ? "#2c1810" : "#e2d4c0" }}
                  >
                    {inOrder && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#2c1810] text-white text-xs flex items-center justify-center font-bold">
                        {inOrder.qty}
                      </div>
                    )}
                    <p className="font-medium text-[#2c1810] text-sm leading-tight pr-6">{item.name}</p>
                    {item.unit && <p className="text-[#a67c5b] text-xs mt-0.5">{item.unit}</p>}
                    <p className="text-[#6b4423] font-semibold mt-2">{formatPrice(item.price)}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — ORDEN */}
        <div className="w-80 flex flex-col bg-white border-l border-[#e2d4c0] flex-shrink-0">

          <div className="px-5 py-4 border-b border-[#e2d4c0]">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2c1810] text-lg">Orden actual</h2>
              {order.length > 0 && (
                <button onClick={() => setOrder([])} className="text-xs text-red-400 hover:text-red-600">
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* ITEMS EN ORDEN */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {order.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-4xl mb-3">☕</p>
                <p className="text-[#c4a882] text-sm">Toca un producto para agregarlo</p>
              </div>
            ) : (
              order.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-[#f5f0e8]">
                  <div className="flex-1">
                    <p className="text-[#2c1810] text-sm font-medium">{item.name}</p>
                    <p className="text-[#8b5e3c] text-xs">{formatPrice(item.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => removeItem(item.name)}
                      className="w-6 h-6 rounded-full bg-[#f5f0e8] text-[#2c1810] text-sm flex items-center justify-center hover:bg-[#e2d4c0]"
                    >
                      −
                    </button>
                    <span className="text-[#2c1810] font-semibold w-4 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="w-6 h-6 rounded-full bg-[#2c1810] text-white text-sm flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[#2c1810] font-semibold text-sm ml-3 w-16 text-right">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* TOTAL + COBRAR */}
          <div className="px-4 py-4 border-t border-[#e2d4c0] space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[#2c1810] font-semibold">Total</span>
              <span className="text-2xl font-[family-name:var(--font-playfair)] text-[#2c1810] font-bold">
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={() => cobrar("efectivo")}
              disabled={order.length === 0}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-30"
              style={{ background: "#2c1810", color: "#faf7f2" }}
            >
              💵 Cobrar en efectivo
            </button>
            <button
              onClick={() => cobrar("tarjeta")}
              disabled={order.length === 0}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-[#2c1810] text-[#2c1810] transition-all active:scale-95 disabled:opacity-30"
            >
              💳 Cobrar con tarjeta
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CONFIRMACIÓN PAGO */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="text-5xl mb-4">{confirm === "efectivo" ? "💵" : "💳"}</div>
            <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[#2c1810] mb-1">
              {confirm === "efectivo" ? "Cobro en efectivo" : "Cobro con tarjeta"}
            </h3>
            <p className="text-[#8b5e3c] text-sm mb-6">
              {confirm === "efectivo"
                ? "Recibe el dinero del cliente y confirma."
                : "Pasa la tarjeta en la máquina Transbank y confirma."}
            </p>
            <p className="text-4xl font-[family-name:var(--font-playfair)] text-[#2c1810] font-bold mb-6">
              {formatPrice(total)}
            </p>
            <button
              onClick={confirmarPago}
              className="w-full bg-[#2c1810] text-white py-4 rounded-2xl font-semibold text-lg mb-3 active:scale-95 transition-transform"
            >
              ✓ Confirmar pago
            </button>
            <button
              onClick={() => setConfirm(null)}
              className="w-full text-[#8b5e3c] text-sm py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ÉXITO */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-green-500 text-white px-10 py-6 rounded-3xl text-center shadow-2xl">
            <p className="text-4xl mb-2">✓</p>
            <p className="text-xl font-semibold">¡Cobrado!</p>
            <p className="text-sm opacity-80 mt-1">Orden guardada</p>
          </div>
        </div>
      )}

      {/* MODAL PLATO DEL DÍA */}
      {editingPlato && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4">
            <h3 className="text-2xl font-[family-name:var(--font-playfair)] text-[#2c1810] mb-1">Plato del día</h3>
            <p className="text-[#8b5e3c] text-sm mb-6">Cámbialo cada mañana con lo que hay hoy.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[#8b5e3c] block mb-2">Nombre</label>
                <input
                  type="text"
                  value={platoForm.nombre}
                  onChange={(e) => setPlatoForm({ ...platoForm, nombre: e.target.value })}
                  placeholder="Ej: Sandwich de pavo con palta"
                  className="w-full border-2 border-[#e2d4c0] rounded-2xl px-4 py-4 text-[#2c1810] text-lg focus:outline-none focus:border-[#6b4423]"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[#8b5e3c] block mb-2">Precio</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b5e3c]">$</span>
                  <input
                    type="number"
                    value={platoForm.precio || ""}
                    onChange={(e) => setPlatoForm({ ...platoForm, precio: Number(e.target.value) })}
                    placeholder="5500"
                    className="w-full border-2 border-[#e2d4c0] rounded-2xl pl-8 pr-4 py-4 text-[#2c1810] text-lg focus:outline-none focus:border-[#6b4423]"
                  />
                </div>
              </div>
              <button
                onClick={savePlato}
                disabled={!platoForm.nombre || platoForm.precio === 0}
                className="w-full bg-[#2c1810] text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-40"
              >
                Guardar
              </button>
              <button onClick={() => setEditingPlato(false)} className="w-full text-[#8b5e3c] text-sm py-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORIAL */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={() => setShowHistory(false)}>
          <div className="bg-white w-full rounded-t-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e2d4c0] flex items-center justify-between flex-shrink-0">
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2c1810] text-xl">Historial de hoy</h2>
              <div className="text-right">
                <p className="text-[#2c1810] font-bold">{formatPrice(totalHoy)}</p>
                <p className="text-[#8b5e3c] text-xs">{pedidosHoy} cobros</p>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-[#f5f0e8]">
              {history
                .filter((o) => new Date(o.timestamp).toDateString() === new Date().toDateString())
                .map((o) => (
                  <div key={o.id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-[#a67c5b] mb-1">
                          {new Date(o.timestamp).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })} ·{" "}
                          {o.pago === "efectivo" ? "💵 Efectivo" : "💳 Tarjeta"}
                        </p>
                        {o.items.map((item, i) => (
                          <p key={i} className="text-sm text-[#2c1810]">
                            {item.qty}x {item.name}
                          </p>
                        ))}
                      </div>
                      <p className="font-semibold text-[#2c1810]">{formatPrice(o.total)}</p>
                    </div>
                  </div>
                ))}
              {history.filter((o) => new Date(o.timestamp).toDateString() === new Date().toDateString()).length === 0 && (
                <div className="px-6 py-10 text-center text-[#a67c5b] text-sm">Sin cobros hoy todavía</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
