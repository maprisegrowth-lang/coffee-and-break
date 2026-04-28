"use client"

import { useEffect, useState } from "react"
import { menu as fullMenu, formatPrice } from "@/data/menu"

const menu = fullMenu

const CATEGORY_PHOTOS: Record<string, string> = {
  cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1920&auto=format&fit=crop",
  dulces: "/dulces.jpg",
  salados: "/salados.jpg",
  desayunos: "/desayunos.jpg",
  bebidasfrias: "/bebidas-frias.jpg",
  jugos: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=1920&auto=format&fit=crop",
  infusiones: "/infusiones.jpg",
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
      setTime(now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false }))
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
        <div className="flex items-center justify-between px-12 pt-5 pb-3">
          <div>
            <h1 className="text-3xl text-white font-[family-name:var(--font-playfair)]">
              Coffee <span className="italic text-[#c4a882]">and Break</span>
            </h1>
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase mt-1">
              Café · Desayunos · Salados
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl text-[#c4a882] font-[family-name:var(--font-playfair)] font-light" style={{ letterSpacing: "-0.02em" }}>
              {time}
            </p>
            <p className="text-white/40 text-xs capitalize mt-1">{date}</p>
          </div>
        </div>

        <div className="w-full h-px bg-white/10" />

        {/* MAIN */}
        <div className="flex flex-1 overflow-hidden px-12 py-4 gap-12">

          {/* LEFT — MENÚ ROTATIVO */}
          <div className="flex-1 flex flex-col" style={{ opacity: fade ? 1 : 0, transition: "opacity 0.5s ease" }}>
            <div className="mb-4">
              <h2 className="text-4xl font-[family-name:var(--font-playfair)] text-white" style={{ letterSpacing: "-0.01em" }}>
                {currentCat.name}
              </h2>
            </div>

            <div className="flex-1 flex flex-col justify-evenly">
              {currentCat.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/20">
                  <div>
                    <p className="text-white text-lg font-medium">{item.name}</p>
                    {item.description && <p className="text-white/60 text-xs mt-0.5">{item.description}</p>}
                    {item.unit && <p className="text-white/60 text-xs">{item.unit}</p>}
                  </div>
                  <div className="text-right ml-8">
                    <p className="text-[#d4b992] text-xl font-semibold font-[family-name:var(--font-playfair)]">
                      {formatPrice(item.price)}
                    </p>
                    {item.priceDouble && (
                      <p className="text-white/50 text-xs">Doble {formatPrice(item.priceDouble)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex items-center justify-center gap-8 px-12 py-2 border-t border-white/10">
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
