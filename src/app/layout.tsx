import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://coffeeandbreakld.cl"),
  title: "Coffee and Break",
  description: "Café · Desayunos · Salados · Santiago, Chile",
  openGraph: {
    title: "Coffee and Break",
    description: "Café · Desayunos · Salados · Santiago, Chile",
    url: "https://coffeeandbreakld.cl",
    siteName: "Coffee and Break",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Coffee and Break" }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffee and Break",
    description: "Café · Desayunos · Salados · Santiago, Chile",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
