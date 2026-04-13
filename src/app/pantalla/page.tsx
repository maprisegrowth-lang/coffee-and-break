"use client"

import { useEffect, useState } from "react"
import { menu, formatPrice } from "@/data/menu"

const CATEGORY_PHOTOS: Record<string, string> = {
  cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1920&auto=format&fit=crop",
  dulces: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1920&auto=format&fit=crop",
  salados: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?q=80&w=1920&auto=format&fit=crop",
  desayunos: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=1920&auto=format&fit=crop",
  bebidasfrias: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1920&auto=format&fit=crop",
  jugos: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=1920&auto=format&fit=crop",
  infusiones: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=1920&auto=format&fit=crop",
  extras: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1920&auto=format&fit=crop",
}

export default function PantallaPage() {
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [activeCategory, setActiveCategory] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }))
      setDate(now.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" }))
    }
    update()
    const i = setInterval(update, 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const i = setInterval(() => {
      setFade(false)
      setTimeout(() => { setActiveCategory((p) => (p + 1) % menu.length); setFade(true) }, 500)
    }, 8000)
    return () => clearInterval(i)
  }, [])

  const currentCat = menu[activeCategory]
  const bgPhoto = CATEGORY_PHOTOS[currentCat.id] ?? CATEGORY_PHOTOS.cafe

  return (
    <div className="h-screen w-screen overflow-hidden relative font-[family-name:var(--font-inter)]">

      {/* BACKGROUND PHOTO */}
      <div
        key={currentCat.id}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: `url(${bgPhoto})`, opacity: fade ? 1 : 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60" />

      <div className="relative h-full flex flex-col">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-12 pt-8 pb-5">
          <div>
            <h1 className="text-4xl text-white font-[family-name:var(--font-playfair)]">
              Coffee <span className="italic text-[#c4a882]">and Break</span>
            </h1>
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase mt-1">
              Café · Desayunos · Salados
            </p>
          </div>
          <div className="text-right">
            <p className="text-6xl text-[#c4a882] font-[family-name:var(--font-playfair)] font-light" style={{ letterSpacing: "-0.02em" }}>
              {time}
            </p>
            <p className="text-white/40 text-xs capitalize mt-1">{date}</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* MAIN */}
        <div className="flex flex-1 overflow-hidden px-12 py-8 gap-12">

          {/* LEFT — MENÚ ROTATIVO */}
          <div className="flex-1 flex flex-col" style={{ opacity: fade ? 1 : 0, transition: "opacity 0.5s ease" }}>
            <div className="mb-8">
              <h2 className="text-5xl font-[family-name:var(--font-playfair)] text-white" style={{ letterSpacing: "-0.01em" }}>
                {currentCat.name}
              </h2>
            </div>

            <div className="flex-1">
              {currentCat.items.slice(0, 7).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/10">
                  <div>
                    <p className="text-white/90 text-xl">{item.name}</p>
                    {item.description && <p className="text-white/40 text-sm mt-0.5">{item.description}</p>}
                    {item.unit && <p className="text-white/40 text-xs">{item.unit}</p>}
                  </div>
                  <div className="text-right ml-8">
                    <p className="text-[#c4a882] text-2xl font-[family-name:var(--font-playfair)]">
                      {formatPrice(item.price)}
                    </p>
                    {item.priceDouble && (
                      <p className="text-white/30 text-xs">Doble {formatPrice(item.priceDouble)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              {menu.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setFade(false); setTimeout(() => { setActiveCategory(i); setFade(true) }, 400) }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === activeCategory ? "24px" : "8px",
                    height: "8px",
                    background: i === activeCategory ? "#c4a882" : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="w-px bg-white/10" />

          {/* RIGHT */}
          <div className="w-72 flex flex-col gap-5">

            {/* QR PEDIDO ANTICIPADO */}
            <div
              className="flex-1 rounded-3xl p-7 flex flex-col items-center justify-center text-center"
              style={{
                background: "linear-gradient(145deg, rgba(250,247,242,0.15) 0%, rgba(196,168,130,0.1) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(196,168,130,0.3)",
              }}
            >
              <p className="text-[#c4a882] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
                Pedido anticipado
              </p>
              <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center mb-4">
                <div className="text-[#2c1810] text-center px-3">
                  <p className="text-xs font-semibold">QR</p>
                  <p className="text-[10px] text-[#8b5e3c] mt-1">Próximamente</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Escanea y pide antes de bajar.
              </p>
              <p className="text-white/30 text-xs mt-1">
                Lo tenemos listo cuando llegues.
              </p>
            </div>

            {/* INSTAGRAM */}
            <div
              className="rounded-3xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Síguenos</p>
              <p className="text-[#c4a882] text-sm font-semibold">@coffee_and_break_cl</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex items-center justify-center gap-8 px-12 py-4 border-t border-white/10">
          {menu.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => { setFade(false); setTimeout(() => { setActiveCategory(i); setFade(true) }, 400) }}
              className="transition-all text-sm"
              style={{ color: i === activeCategory ? "#c4a882" : "rgba(255,255,255,0.25)" }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
