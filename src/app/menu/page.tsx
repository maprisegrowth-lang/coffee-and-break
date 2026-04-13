import { menu, formatPrice } from "@/data/menu"
import Link from "next/link"

export const metadata = {
  title: "Carta | Coffee and Break",
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#faf7f2]/95 backdrop-blur-sm border-b border-[#e2d4c0]">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <Link
            href="/"
            className="text-[#8b5e3c] text-sm tracking-wide hover:text-[#2c1810] transition-colors"
          >
            ← Inicio
          </Link>
          <h1 className="text-xl font-[family-name:var(--font-playfair)] text-[#2c1810]">
            Coffee and Break
          </h1>
          <span className="text-xs text-[#c4a882] tracking-[0.3em] uppercase">
            Carta
          </span>
        </div>

        {/* CATEGORY NAV */}
        <div className="flex gap-1 px-6 md:px-10 pb-3 overflow-x-auto no-scrollbar">
          {menu.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex-shrink-0 text-xs px-4 py-1.5 rounded-full border border-[#e2d4c0] text-[#6b4423] hover:bg-[#2c1810] hover:text-[#faf7f2] hover:border-[#2c1810] transition-all duration-200"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="bg-[#2c1810] py-14 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#c4a882] text-xs tracking-[0.4em] uppercase mb-4">
            Carta Digital
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-playfair)] text-[#faf7f2] leading-tight">
            Nuestra Carta
          </h2>
          <div className="w-12 h-px bg-[#c4a882] mx-auto mt-6" />
        </div>
      </div>

      {/* PRE-ORDER BANNER */}
      <a
        href="/chatbot"
        className="group flex items-center justify-between bg-[#f5f0e8] border-b border-[#e2d4c0] px-6 md:px-10 py-4 max-w-2xl mx-auto md:my-8 md:rounded-xl md:border hover:bg-[#ebe3d5] transition-colors"
      >
        <div>
          <p className="text-xs text-[#8b5e3c]">¿Vienes desde las oficinas?</p>
          <p className="text-sm font-semibold text-[#2c1810]">Pide anticipado · Lo tenemos listo</p>
        </div>
        <span className="text-[#c4a882] group-hover:translate-x-1 transition-transform">→</span>
      </a>

      {/* CATEGORIES */}
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-10 space-y-14">
        {menu.map((cat) => (
          <section key={cat.id} id={cat.id}>
            {/* Category header */}
            <div className="mb-6">
              <p className="text-[#c4a882] text-xs tracking-[0.3em] uppercase mb-1">{cat.emoji}</p>
              <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] text-[#2c1810]">
                {cat.name}
              </h2>
              <div className="w-8 h-px bg-[#c4a882] mt-3" />
            </div>

            {/* Items */}
            <div className="space-y-0">
              {cat.items.map((item, i) => (
                <div
                  key={i}
                  className="group py-4 border-b border-[#e2d4c0]/60 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-[#2c1810] font-medium text-[15px] font-[family-name:var(--font-inter)]">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dotted border-[#d4c4ab] min-w-[2rem] translate-y-[-3px]" />
                        <div className="flex-shrink-0 text-right">
                          <span className="text-[#2c1810] font-semibold text-[15px] font-[family-name:var(--font-inter)]">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(item.description || item.unit || item.priceDouble) && (
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-xs text-[#8b5e3c] max-w-[75%]">
                        {item.description || item.unit}
                      </p>
                      {item.priceDouble && (
                        <p className="text-xs text-[#a67c5b]">
                          Doble · {formatPrice(item.priceDouble)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* FLOATING CTA */}
      <a
        href="/chatbot"
        className="fixed bottom-6 right-6 bg-[#2c1810] text-[#faf7f2] rounded-full px-6 py-3.5 shadow-lg flex items-center gap-2 font-semibold text-sm hover:bg-[#4a2c1a] transition-all duration-200 hover:shadow-xl"
      >
        Pedir ahora
      </a>

      <div className="h-24" />

      <footer className="text-center py-6 text-[#8b5e3c] text-xs border-t border-[#e2d4c0]">
        Coffee and Break · Av. La Dehesa 1844, Local 116
      </footer>
    </main>
  )
}
