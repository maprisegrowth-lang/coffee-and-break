import Link from "next/link"
import ScrollReveal from "@/components/ScrollReveal"
import AutoPlayVideo from "@/components/AutoPlayVideo"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f2] font-[family-name:var(--font-inter)] overflow-x-hidden">
      <ScrollReveal />

      {/* NAV */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6">
        <div>
          <p className="text-white/60 text-xs tracking-[0.3em] uppercase">Av. La Dehesa 1844, Local 116</p>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-white">Coffee and Break</h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/menu" className="text-white/70 hover:text-white transition-colors">Carta</Link>
          <a
            href="/chatbot"
            className="bg-white text-[#2c1810] px-5 py-2 rounded-full font-semibold hover:bg-[#faf7f2] transition-colors"
          >
            Pedir
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <AutoPlayVideo src="/videos/hero-web.mp4" className="video-bg" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-[1]" />

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-24 max-w-3xl">
          <p className="hero-text-1 text-[#c4a882] text-xs tracking-[0.4em] uppercase mb-4">
            Café · Desayunos · Salados
          </p>
          <h2 className="hero-text-2 text-6xl sm:text-7xl md:text-8xl font-[family-name:var(--font-playfair)] text-white leading-[0.95] mb-6">
            Coffee<br />
            <span className="italic text-[#c4a882]">and Break</span>
          </h2>
          <p className="hero-text-3 text-white/60 text-lg mb-10 max-w-md">
            Tu pausa perfecta. Café de especialidad, desayunos y salados con alma.
          </p>
          <div className="hero-text-4 flex gap-4 flex-wrap">
            <Link
              href="/menu"
              className="bg-[#c4a882] text-[#2c1810] px-8 py-3.5 rounded-full font-semibold hover:bg-white transition-colors duration-300"
            >
              Ver Carta
            </Link>
            <a
              href="/chatbot?text=Hola!%20Quiero%20hacer%20un%20pedido"
              className="border border-white/40 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 text-center backdrop-blur-sm"
            >
              <span className="block">Pedir ahora</span>
              <span className="block text-xs text-white/50 mt-0.5">Te lo tenemos listo cuando llegues</span>
            </a>
          </div>
        </div>

      </section>

      {/* ═══ EDITORIAL: STATEMENT ═══ */}
      <section className="px-8 md:px-16 py-24 md:py-32 max-w-5xl mx-auto reveal">
        <p className="text-[#c4a882] text-xs tracking-[0.4em] uppercase mb-6">Nuestra filosofía</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] text-[#2c1810] leading-[1.1] max-w-4xl">
          Cada taza es un ritual.<br />
          <span className="italic text-[#8b5e3c]">Cada visita, una pausa que mereces.</span>
        </h2>
      </section>

      {/* ═══ EDITORIAL: VIDEO GRID ASIMÉTRICO ═══ */}
      <section className="px-4 md:px-8">
        {/* Row 1: Café grande + Comida */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-7 relative h-[28rem] md:h-[32rem] overflow-hidden group reveal">
            <AutoPlayVideo
              src="/videos/steam-cup-web.mp4"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
            <div className="absolute bottom-8 left-8 z-[2]">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">El ritual</p>
              <p className="text-white font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">Café humeante</p>
            </div>
          </div>
          <div className="md:col-span-5 relative h-[28rem] md:h-[32rem] overflow-hidden group reveal reveal-delay-2">
            <AutoPlayVideo
              src="/videos/croissant-web.mp4"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
            <div className="absolute bottom-8 left-8 z-[2]">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">Artesanal</p>
              <p className="text-white font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">Croissant & Café</p>
            </div>
          </div>
        </div>

        {/* Row 2: Comida + Café (invertido) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-5 relative h-[28rem] md:h-[32rem] overflow-hidden group reveal">
            <AutoPlayVideo
              src="/videos/yogurt-plate-web.mp4"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
            <div className="absolute bottom-8 left-8 z-[2]">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">Fresco</p>
              <p className="text-white font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">Yogurt & Berries</p>
            </div>
          </div>
          <div className="md:col-span-7 relative h-[28rem] md:h-[32rem] overflow-hidden group reveal reveal-delay-2">
            <AutoPlayVideo
              src="/videos/espresso-web.mp4"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
            <div className="absolute bottom-8 left-8 z-[2]">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">Clásico</p>
              <p className="text-white font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">Espresso</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL: CARTA ═══ */}
      <section className="py-24 md:py-32">
        <div className="px-8 md:px-16 max-w-5xl mx-auto mb-16 reveal">
          <p className="text-[#c4a882] text-xs tracking-[0.4em] uppercase mb-6">La carta</p>
          <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] text-[#2c1810] mb-4">
            Lo que ofrecemos
          </h2>
          <p className="text-[#8b5e3c] text-lg max-w-lg">
            Desde un espresso corto hasta un brunch completo. Todo preparado al momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#e2d4c0]">
          {[
            { title: "Cafés e Infusiones", items: ["Espresso", "Americano", "Cappuccino", "Latte", "Mocaccino"], desde: "2.500" },
            { title: "Desayunos y Salados", items: ["Brunch Completo", "Tostadas", "Croissants", "Paninis", "Sandwiches"], desde: "4.000" },
            { title: "Dulces y Jugos", items: ["Kuchen del día", "Media Lunas", "Muffins", "Jugos Naturales", "Donuts"], desde: "1.500" },
          ].map((col, i) => (
            <div
              key={col.title}
              className={`reveal reveal-delay-${i + 1} px-8 md:px-10 py-12 ${i < 2 ? "border-b md:border-b-0 md:border-r border-[#e2d4c0]" : ""}`}
            >
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-[#2c1810] mb-1">{col.title}</h3>
              <p className="text-[#c4a882] text-xs tracking-wider uppercase mb-6">Desde ${col.desde}</p>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item} className="text-[#6b4423] text-sm flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#c4a882] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-8 md:px-16 mt-12 text-center reveal">
          <Link
            href="/menu"
            className="inline-block bg-[#2c1810] text-[#faf7f2] px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#4a2c1a] transition-all duration-300"
          >
            Ver carta completa
          </Link>
        </div>
      </section>

      {/* ═══ EDITORIAL: VIDEO AMBIENT + INFO ═══ */}
      <section className="relative min-h-[28rem] md:h-[34rem] flex items-center overflow-hidden">
        <AutoPlayVideo src="/videos/process-web.mp4" className="video-bg" />
        <div className="absolute inset-0 bg-[#1a0f0a]/85 z-[1]" />

        <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-16 w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 py-16 md:py-0">
          {[
            { title: "Horarios", lines: ["Lunes a Viernes", "9:00 – 18:00 hrs", "", "Sábado", "10:00 – 13:00 hrs"] },
            { title: "Ubicación", lines: ["Av. La Dehesa 1844", "Local 116", "", "", ""] },
            { title: "Contacto", lines: ["Instagram: @coffee_and_break_cl", "", "Pedidos anticipados", "desde la web"] },
          ].map((col, i) => (
            <div key={col.title} className={`reveal reveal-delay-${i + 1}`}>
              <h3 className="font-[family-name:var(--font-playfair)] text-2xl mb-4 text-[#c4a882]">{col.title}</h3>
              <div className="text-white/45 text-sm leading-relaxed">
                {col.lines.map((line, j) => line ? <p key={j}>{line}</p> : <br key={j} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="flex items-center justify-between px-8 md:px-16 py-8 text-[#8b5e3c] text-xs border-t border-[#e2d4c0]">
        <p>© 2026 Coffee and Break</p>
        <p className="tracking-[0.2em] uppercase">Av. La Dehesa 1844, Local 116</p>
      </footer>
    </main>
  )
}
