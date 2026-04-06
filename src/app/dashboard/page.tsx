"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

type Pedido = {
  id: string
  nombre: string
  items: { name: string; price: number; qty: number }[]
  total: number
  estado: "pendiente" | "listo" | "entregado"
  created_at: string
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatItems(raw: unknown): string {
  let items = raw
  if (typeof items === "string") {
    try {
      items = JSON.parse(items)
    } catch {
      return items as string
    }
  }
  if (!Array.isArray(items)) return String(items)
  return items.map((i: { qty: number; name: string }) => `${i.qty}x ${i.name}`).join(" + ")
}

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

// Audio context persistente para no ser bloqueado por el navegador
let audioCtx: AudioContext | null = null

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  // Resumir en caso de que esté suspendido
  if (audioCtx.state === "suspended") {
    audioCtx.resume()
  }
}

async function playNotification() {
  // Intento 1: AudioContext
  if (audioCtx) {
    try {
      if (audioCtx.state === "suspended") {
        await audioCtx.resume()
      }
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = "sine"
      gain.gain.value = 0.5
      const t = audioCtx.currentTime
      // Ding-dong x3 para que sea bien notorio
      osc.frequency.setValueAtTime(880, t)
      osc.frequency.setValueAtTime(1100, t + 0.15)
      osc.frequency.setValueAtTime(880, t + 0.30)
      osc.frequency.setValueAtTime(1100, t + 0.45)
      osc.frequency.setValueAtTime(880, t + 0.60)
      osc.frequency.setValueAtTime(1100, t + 0.75)
      gain.gain.setValueAtTime(0.5, t)
      gain.gain.setValueAtTime(0.5, t + 0.8)
      gain.gain.linearRampToValueAtTime(0, t + 1.0)
      osc.start(t)
      osc.stop(t + 1.0)
      return
    } catch {
      // Si falla AudioContext, caer al fallback
    }
  }

  // Intento 2: Recrear AudioContext si murió
  try {
    audioCtx = new AudioContext()
    await audioCtx.resume()
    playNotification()
  } catch {
    // Sin audio disponible
  }
}

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [audioReady, setAudioReady] = useState(false)
  const lastCountRef = useRef(0)
  const initialLoadDone = useRef(false)

  // Verificar si ya está autenticado
  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthenticated(d.authenticated))
      .catch(() => setAuthenticated(false))
  }, [])

  const handleLogin = async () => {
    setLoginError("")
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setAuthenticated(true)
    } else {
      setLoginError("Clave incorrecta")
      setPassword("")
    }
  }

  const fetchPedidos = useCallback(async () => {
    const { data } = await supabase
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      const hoy = (data as Pedido[]).filter((p) => isToday(p.created_at))
      const pendientesNuevos = hoy.filter((p) => p.estado === "pendiente").length

      // Si hay más pendientes que antes, sonar
      if (initialLoadDone.current && pendientesNuevos > lastCountRef.current) {
        playNotification()
      }
      lastCountRef.current = pendientesNuevos

      setPedidos(hoy)
    }
    setLoading(false)
  }, [])

  const activarAlertas = () => {
    initAudio()
    setAudioReady(true)
    playNotification()
  }

  useEffect(() => {
    if (!authenticated) return

    fetchPedidos()

    const channel = supabase
      .channel("pedidos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pedidos" },
        () => {
          fetchPedidos()
        }
      )
      .subscribe()

    const interval = setInterval(fetchPedidos, 5000)

    // Mantener AudioContext vivo
    const keepAlive = setInterval(() => {
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume()
      }
    }, 10000)

    setTimeout(() => {
      initialLoadDone.current = true
    }, 2000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
      clearInterval(keepAlive)
    }
  }, [fetchPedidos, authenticated])

  const updateEstado = async (id: string, estado: string) => {
    await supabase.from("pedidos").update({ estado }).eq("id", id)
  }

  const pendientes = pedidos.filter((p) => p.estado === "pendiente")
  const listos = pedidos.filter((p) => p.estado === "listo")
  const entregados = pedidos.filter((p) => p.estado === "entregado")

  // Pantalla de carga inicial
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-[#8b5e3c]">Cargando...</p>
      </div>
    )
  }

  // Pantalla de login
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#2c1810] flex items-center justify-center px-6">
        <div className="w-full max-w-xs text-center">
          <p className="text-[#c4a882] text-xs tracking-[0.3em] uppercase mb-2">Panel del local</p>
          <h1 className="text-3xl font-[family-name:var(--font-playfair)] text-[#faf7f2] mb-8">
            Coffee and Break
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Ingresa la clave"
            className="w-full bg-[#1a0f0a] border border-[#6b4423] rounded-2xl px-5 py-4 text-[#faf7f2] text-center text-lg outline-none focus:border-[#c4a882] transition-colors placeholder:text-[#6b4423]"
            autoFocus
          />
          {loginError && (
            <p className="text-red-400 text-sm mt-3">{loginError}</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-[#c4a882] text-[#2c1810] py-4 rounded-2xl font-semibold text-base active:scale-95 transition-transform"
          >
            Entrar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <p className="text-[#8b5e3c]">Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] font-[family-name:var(--font-inter)]">
      {/* BANNER ACTIVAR ALERTAS */}
      {!audioReady && (
        <button
          onClick={activarAlertas}
          className="w-full bg-[#c4a882] text-[#2c1810] py-3 px-5 flex items-center justify-center gap-2 font-semibold text-sm active:scale-95 transition-transform"
        >
          <span className="text-lg">🔔</span>
          Toca aquí para activar alertas de pedidos
        </button>
      )}

      {/* HEADER */}
      <div className="bg-[#2c1810] px-5 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#a67c5b] text-xs tracking-widest uppercase">
              Panel del local · En vivo
            </p>
            <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-[#faf7f2] mt-1">
              Coffee and Break
            </h1>
          </div>
          {audioReady && (
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Alertas activas
            </span>
          )}
        </div>
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
      <div className="px-5 py-6 space-y-3 pb-12">
        {/* PENDIENTES */}
        {pendientes.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">
              🔴 Pendientes
            </p>
            <div className="space-y-2">
              {pendientes.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border-l-4 border-yellow-400 shadow-sm animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1810]">{p.nombre}</p>
                      <p className="text-[#6b4423] text-sm mt-0.5">
                        {formatItems(p.items)}
                      </p>
                      <p className="text-[#a67c5b] text-xs mt-1">
                        {formatTime(p.created_at)} hrs
                      </p>
                    </div>
                    <button
                      onClick={() => updateEstado(p.id, "listo")}
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
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">
              🟢 Listos para entregar
            </p>
            <div className="space-y-2">
              {listos.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 border-l-4 border-green-400 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-[#2c1810]">{p.nombre}</p>
                      <p className="text-[#6b4423] text-sm mt-0.5">
                        {formatItems(p.items)}
                      </p>
                      <p className="text-[#a67c5b] text-xs mt-1">
                        {formatTime(p.created_at)} hrs
                      </p>
                    </div>
                    <button
                      onClick={() => updateEstado(p.id, "entregado")}
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
            <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">
              ✅ Entregados hoy
            </p>
            <div className="space-y-2">
              {entregados.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 opacity-50"
                >
                  <p className="font-semibold text-[#2c1810] text-sm line-through">
                    {p.nombre}
                  </p>
                  <p className="text-[#8b5e3c] text-xs">{formatItems(p.items)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIN PEDIDOS */}
        {pedidos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">☕</p>
            <p className="text-[#8b5e3c] text-lg font-[family-name:var(--font-playfair)]">
              Sin pedidos aún
            </p>
            <p className="text-[#a67c5b] text-sm mt-1">
              Los pedidos aparecerán aquí automáticamente
            </p>
          </div>
        )}

        {/* LINKS */}
        <div className="pt-4">
          <p className="text-xs uppercase tracking-widest text-[#8b5e3c] mb-2">
            Accesos rápidos
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Ver pantalla", href: "/pantalla", emoji: "🖥️" },
              { label: "Ver carta", href: "/menu", emoji: "📋" },
              { label: "Chatbot", href: "/chatbot", emoji: "🤖" },
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
