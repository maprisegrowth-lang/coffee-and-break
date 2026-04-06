import { menu, formatPrice } from "@/data/menu"
import Link from "next/link"

export const metadata = {
  title: "Carta | Coffee and Break",
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#faf7f2] border-b border-[#e2d4c0]">
        <div className="flex items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-[#6b4423] text-sm font-[family-name:var(--font-inter)]"
          >
            ← Inicio
          </Link>
          <h1 className="text-xl font-[family-name:var(--font-playfair)] text-[#2c1810]">
            Coffee and Break
          </h1>
          <span className="text-sm text-[#8b5e3c] font-[family-name:var(--font-inter)]">
            Carta
          </span>
        </div>

        {/* CATEGORY NAV */}
        <div className="flex gap-3 px-5 pb-3 overflow-x-auto no-scrollbar">
          {menu.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-[#2c1810] text-[#faf7f2] font-[family-name:var(--font-inter)] hover:bg-[#6b4423] transition-colors"
            >
              {cat.emoji} {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="bg-[#2c1810] text-center py-8 px-5">
        <p className="text-[#c4a882] text-xs tracking-widest uppercase font-[family-name:var(--font-inter)] mb-1">
          Carta Digital
        </p>
        <h2 className="text-3xl font-[family-name:var(--font-playfair)] text-[#faf7f2]">
          ¿Qué te apetece hoy?
        </h2>
      </div>

      {/* PRE-ORDER BANNER */}
      <a
        href="/chatbot"
        className="flex items-center justify-between bg-[#6b4423] text-white px-5 py-3"
      >
        <div className="font-[family-name:var(--font-inter)]">
          <p className="text-xs opacity-80">¿Vienes desde las oficinas?</p>
          <p className="text-sm font-semibold">Pide anticipado · Lo tenemos listo</p>
        </div>
        <span className="text-2xl">📱</span>
      </a>

      {/* CATEGORIES */}
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-10">
        {menu.map((cat) => (
          <section key={cat.id} id={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.emoji}</span>
              <h2 className="text-2xl font-[family-name:var(--font-playfair)] text-[#2c1810]">
                {cat.name}
              </h2>
            </div>

            <div className="space-y-2">
              {cat.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between bg-white rounded-xl px-4 py-3 border border-[#e2d4c0]"
                >
                  <div className="flex-1 pr-4">
                    <p className="font-[family-name:var(--font-inter)] text-[#2c1810] font-medium text-sm">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-[#8b5e3c] mt-0.5 font-[family-name:var(--font-inter)]">
                        {item.description}
                      </p>
                    )}
                    {item.unit && (
                      <p className="text-xs text-[#a67c5b] mt-0.5 font-[family-name:var(--font-inter)]">
                        {item.unit}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#2c1810] font-semibold text-sm font-[family-name:var(--font-inter)]">
                      {formatPrice(item.price)}
                    </p>
                    {item.priceDouble && (
                      <p className="text-xs text-[#8b5e3c] font-[family-name:var(--font-inter)]">
                        Doble {formatPrice(item.priceDouble)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* WHATSAPP FLOAT */}
      <a
        href="/chatbot"
        className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2 font-[family-name:var(--font-inter)] font-semibold text-sm hover:bg-green-600 transition-colors"
      >
        <span>💬</span> Pedir ahora
      </a>

      <div className="h-24" />

      <footer className="text-center py-4 text-[#8b5e3c] text-xs font-[family-name:var(--font-inter)]">
        Coffee and Break · Santiago, Chile
      </footer>
    </main>
  )
}
