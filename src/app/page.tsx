import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf7f2] font-[family-name:var(--font-inter)]">

      {/* NAV */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <div>
          <p className="text-white/60 text-xs tracking-[0.3em] uppercase">Santiago, Chile</p>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-white">Coffee and Break</h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/menu" className="text-white/70 hover:text-white transition-colors">Carta</Link>
          <a
            href="/chatbot"
            className="bg-white text-[#2c1810] px-5 py-2 rounded-full font-semibold hover:bg-[#faf7f2] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative h-screen flex items-end">
        <Image
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920&auto=format&fit=crop"
          alt="Coffee and Break interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative px-10 pb-20 max-w-3xl">
          <p className="text-[#c4a882] text-xs tracking-[0.4em] uppercase mb-4">Café · Desayunos · Salados</p>
          <h2 className="text-7xl md:text-8xl font-[family-name:var(--font-playfair)] text-white leading-none mb-6">
            Coffee<br />
            <span className="italic text-[#c4a882]">and Break</span>
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Tu pausa perfecta. Café de especialidad, desayunos y salados con alma.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/menu"
              className="bg-[#c4a882] text-[#2c1810] px-8 py-3.5 rounded-full font-semibold hover:bg-white transition-colors"
            >
              Ver Carta
            </Link>
            <a
              href="/chatbot?text=Hola!%20Quiero%20hacer%20un%20pedido"
              className="border border-white/40 text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 border-b border-[#e2d4c0]">
        {[
          { icon: "☕", title: "Café de Especialidad", desc: "Granos seleccionados, preparados por baristas apasionados." },
          { icon: "🥐", title: "Desayunos y Salados", desc: "Desde un croissant hasta un brunch completo." },
          { icon: "📱", title: "Pedido Anticipado", desc: "Pide por WhatsApp antes de bajar. Lo tenemos listo." },
        ].map((f, i) => (
          <div key={i} className="p-10 border-r last:border-r-0 border-[#e2d4c0] text-center">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-[family-name:var(--font-playfair)] text-[#2c1810] mb-2">{f.title}</h3>
            <p className="text-[#8b5e3c] text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* FOTO GRID */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {[
          { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop", alt: "Café espresso" },
          { src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop", alt: "Pasteles" },
          { src: "https://images.unsplash.com/photo-1484723091739-30990b8e9dc4?q=80&w=800&auto=format&fit=crop", alt: "Desayuno" },
          { src: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop", alt: "Brunch" },
        ].map((img) => (
          <div key={img.alt} className="relative h-64 overflow-hidden group">
            <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </section>

      {/* MENU PREVIEW */}
      <section className="px-8 py-20 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase text-[#8b5e3c] mb-2">Lo que ofrecemos</p>
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] text-[#2c1810] mb-12">Nuestra Carta</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { emoji: "☕", name: "Cafés", desde: 2500 },
            { emoji: "🍰", name: "Dulces", desde: 1500 },
            { emoji: "🥐", name: "Salados", desde: 4000 },
            { emoji: "🍳", name: "Desayunos", desde: 5900 },
            { emoji: "🧃", name: "Bebidas Frías", desde: 1000 },
            { emoji: "🍊", name: "Jugos Naturales", desde: 2000 },
          ].map((cat) => (
            <Link
              key={cat.name}
              href="/menu"
              className="bg-white border border-[#e2d4c0] rounded-2xl p-6 hover:border-[#6b4423] hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="font-[family-name:var(--font-playfair)] text-[#2c1810] font-semibold">{cat.name}</div>
              <div className="text-xs text-[#8b5e3c] mt-1">Desde ${cat.desde.toLocaleString("es-CL")}</div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/menu"
            className="inline-block bg-[#2c1810] text-[#faf7f2] px-10 py-4 rounded-full text-sm hover:bg-[#4a2c1a] transition-colors"
          >
            Ver carta completa
          </Link>
        </div>
      </section>

      {/* AMBIENT PHOTO + INFO */}
      <section className="relative h-96 flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop"
          alt="Café ambiente"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#2c1810]/80" />
        <div className="relative max-w-4xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "Horarios", lines: ["Lunes a Viernes", "8:00 – 19:00 hrs", "", "Sábado", "9:00 – 15:00 hrs"] },
            { title: "Ubicación", lines: ["Santiago Centro", "Chile", "", "Bajo las oficinas", "Estacionamiento disponible"] },
            { title: "Contacto", lines: ["WhatsApp: +56 9 1234 5678", "Instagram: @coffeeandbreak", "", "Pedidos anticipados", "bienvenidos"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl mb-3 text-[#c4a882]">{col.title}</h3>
              <div className="text-white/50 text-sm leading-relaxed">
                {col.lines.map((line, i) => line ? <p key={i}>{line}</p> : <br key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-[#8b5e3c] text-xs border-t border-[#e2d4c0]">
        © 2026 Coffee and Break · Santiago, Chile
      </footer>
    </main>
  )
}
