import { NextRequest, NextResponse } from "next/server"
import { menu, formatPrice } from "@/data/menu"

export type BotState =
  | "idle"
  | "main"
  | "ordering_category"
  | `ordering_items_${number}`
  | `waiting_name_${number}_${number}`

type BotResponse = {
  response: string
  state: BotState
  quickReplies: string[]
}

const MAIN_MENU_TEXT = `Hola 👋 Bienvenido a *Coffee and Break*\n\n¿En qué te puedo ayudar?`
const MAIN_QUICK = ["1️⃣ Hacer un pedido", "2️⃣ Ver la carta", "3️⃣ Horarios", "4️⃣ Ubicación", "5️⃣ WiFi"]

function buildCategoryList() {
  return (
    `🛍️ *¿Qué quieres pedir?*\n\nElige una categoría:\n\n` +
    menu.map((cat, i) => `${i + 1}️⃣ ${cat.emoji} ${cat.name}`).join("\n")
  )
}

function buildItemList(catIndex: number) {
  const cat = menu[catIndex]
  const items = cat.items
    .map((item, i) => {
      const precio = formatPrice(item.price)
      const doble = item.priceDouble ? ` / Doble ${formatPrice(item.priceDouble)}` : ""
      const unit = item.unit ? ` _(${item.unit})_` : ""
      return `${i + 1}️⃣ ${item.name}${unit} — ${precio}${doble}`
    })
    .join("\n")
  return `${cat.emoji} *${cat.name}*\n\n${items}`
}

function getBotResponse(message: string, state: BotState): BotResponse {
  const msg = message.trim().toLowerCase()
  const num = parseInt(msg)

  // ── IDLE / saludo ──────────────────────────────────────────────────────────
  if (
    state === "idle" ||
    msg.match(/^(hola|buenas|buenos|hi|hey|saludos|ola|start|inicio)/)
  ) {
    return {
      response: MAIN_MENU_TEXT,
      state: "main",
      quickReplies: MAIN_QUICK,
    }
  }

  // ── MENÚ PRINCIPAL ─────────────────────────────────────────────────────────
  if (state === "main") {
    if (num === 1 || msg.match(/pedir|pedido|orden/)) {
      return {
        response: buildCategoryList(),
        state: "ordering_category",
        quickReplies: menu.map((cat, i) => `${i + 1} ${cat.emoji} ${cat.name}`),
      }
    }
    if (num === 2 || msg.match(/carta|menu/)) {
      const carta = menu
        .map((cat) => `${cat.emoji} *${cat.name}*\n` + cat.items.map((i) => `• ${i.name} ${formatPrice(i.price)}`).join("\n"))
        .join("\n\n")
      return {
        response: `📋 *Nuestra Carta*\n\n${carta}`,
        state: "main",
        quickReplies: MAIN_QUICK,
      }
    }
    if (num === 3 || msg.match(/horario|hora|abren|cierran/)) {
      return {
        response: `🕐 *Horarios*\n\n📅 Lunes a Viernes: 8:00 — 19:00\n📅 Sábado: 9:00 — 15:00\n📅 Domingo: Cerrado`,
        state: "main",
        quickReplies: MAIN_QUICK,
      }
    }
    if (num === 4 || msg.match(/donde|ubicacion|llegar/)) {
      return {
        response: `📍 *Ubicación*\n\nSantiago Centro, nivel bajo de las oficinas.\n🅿️ Estacionamiento disponible.`,
        state: "main",
        quickReplies: MAIN_QUICK,
      }
    }
    if (num === 5 || msg.match(/wifi|clave|internet/)) {
      return {
        response: `📶 *WiFi Gratis*\n\nRed: *coffeeandbreak*\nClave: *cafebreak2026*`,
        state: "main",
        quickReplies: MAIN_QUICK,
      }
    }
  }

  // ── ELIGIENDO CATEGORÍA ────────────────────────────────────────────────────
  if (state === "ordering_category") {
    if (!isNaN(num) && num >= 1 && num <= menu.length) {
      const catIndex = num - 1
      const cat = menu[catIndex]
      return {
        response: buildItemList(catIndex),
        state: `ordering_items_${catIndex}`,
        quickReplies: cat.items.map((item, i) => `${i + 1} ${item.name}`),
      }
    }
    // Si escribe el nombre de una categoría
    const catIndex = menu.findIndex((c) =>
      msg.includes(c.name.toLowerCase()) || msg.includes(c.id)
    )
    if (catIndex >= 0) {
      return {
        response: buildItemList(catIndex),
        state: `ordering_items_${catIndex}`,
        quickReplies: menu[catIndex].items.map((item, i) => `${i + 1} ${item.name}`),
      }
    }
  }

  // ── ELIGIENDO ÍTEM ─────────────────────────────────────────────────────────
  const itemsMatch = state.match(/^ordering_items_(\d+)$/)
  if (itemsMatch) {
    const catIndex = parseInt(itemsMatch[1])
    const cat = menu[catIndex]

    if (!isNaN(num) && num >= 1 && num <= cat.items.length) {
      const itemIndex = num - 1
      const item = cat.items[itemIndex]
      return {
        response: `Elegiste *${item.name}* — ${formatPrice(item.price)} 🙌\n\n✍️ ¿Tu nombre para el pedido?`,
        state: `waiting_name_${catIndex}_${itemIndex}`,
        quickReplies: [],
      }
    }
    // Volver a categorías
    if (msg === "0" || msg.match(/volver|atras|otra/)) {
      return {
        response: buildCategoryList(),
        state: "ordering_category",
        quickReplies: menu.map((cat, i) => `${i + 1} ${cat.emoji} ${cat.name}`),
      }
    }
  }

  // ── ESPERANDO NOMBRE ───────────────────────────────────────────────────────
  const nameMatch = state.match(/^waiting_name_(\d+)_(\d+)$/)
  if (nameMatch) {
    const catIndex = parseInt(nameMatch[1])
    const itemIndex = parseInt(nameMatch[2])
    const item = menu[catIndex].items[itemIndex]
    const nombre = message.trim().charAt(0).toUpperCase() + message.trim().slice(1)

    return {
      response: `✅ *¡Pedido confirmado!*\n\n👤 ${nombre}\n🛍️ ${item.name}\n💰 ${formatPrice(item.price)}\n\n_Lo tenemos listo en 5-10 minutos. Te avisamos cuando bajes._ ☕`,
      state: "main",
      quickReplies: ["1️⃣ Pedir algo más", "👍 ¡Gracias!"],
    }
  }

  // ── GRACIAS / MENSAJES POSITIVOS ───────────────────────────────────────────
  if (msg.match(/gracias|thank|👍|excelente|perfecto|genial|ok|dale|buenísimo|buenisimo|de nada|listo/)) {
    return {
      response: `¡Un placer! 😊 Te esperamos en Coffee and Break.\n\n¿Puedo ayudarte con algo más?`,
      state: "main",
      quickReplies: ["1️⃣ Hacer otro pedido", "2️⃣ Ver la carta", "3️⃣ Horarios"],
    }
  }

  // ── FALLBACK ───────────────────────────────────────────────────────────────
  return {
    response: `¡Con gusto! 😊 ¿Puedo ayudarte con algo más?`,
    state: "main",
    quickReplies: ["1️⃣ Hacer un pedido", "2️⃣ Ver la carta", "3️⃣ Horarios"],
  }
}

export async function POST(req: NextRequest) {
  const { message, state = "idle" } = await req.json()
  if (!message) {
    return NextResponse.json({ error: "message requerido" }, { status: 400 })
  }
  const result = getBotResponse(message, state as BotState)
  return NextResponse.json(result)
}
