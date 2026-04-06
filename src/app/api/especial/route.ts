import { NextRequest, NextResponse } from "next/server"

export type EspecialSlot = {
  tipo: "desayuno" | "almuerzo" | "bebida" | "postre"
  emoji: string
  label: string
  nombre: string
  descripcion: string
  precio: number
}

// In-memory store
const especiales: EspecialSlot[] = [
  {
    tipo: "desayuno",
    emoji: "🍳",
    label: "Desayuno del día",
    nombre: "Desayuno Full",
    descripcion: "Café o té + Jugo de naranja + Paila de huevos + Palta",
    precio: 9000,
  },
  {
    tipo: "almuerzo",
    emoji: "🥗",
    label: "Almuerzo del día",
    nombre: "Sandwich Miga Ave Palta",
    descripcion: "Pan de miga con ave, palta, tomate y mayonesa",
    precio: 4700,
  },
  {
    tipo: "bebida",
    emoji: "☕",
    label: "Bebida del día",
    nombre: "Latte de temporada",
    descripcion: "Latte con leche de avena y syrup de vainilla",
    precio: 4200,
  },
  {
    tipo: "postre",
    emoji: "🍰",
    label: "Postre del día",
    nombre: "Tarta del día",
    descripcion: "Consulta disponibilidad en caja",
    precio: 4500,
  },
]

export async function GET() {
  return NextResponse.json(especiales)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Actualizar un slot específico
  const index = especiales.findIndex((e) => e.tipo === body.tipo)
  if (index === -1) {
    return NextResponse.json({ error: "tipo inválido" }, { status: 400 })
  }

  especiales[index] = {
    ...especiales[index],
    nombre: body.nombre ?? especiales[index].nombre,
    descripcion: body.descripcion ?? especiales[index].descripcion,
    precio: body.precio ? Number(body.precio) : especiales[index].precio,
  }

  return NextResponse.json({ success: true, especiales })
}
