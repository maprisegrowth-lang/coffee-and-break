import { NextRequest, NextResponse } from "next/server"

type Pedido = {
  id: string
  nombre: string
  telefono: string
  items: string
  nota?: string
  timestamp: string
  status: "pendiente" | "listo" | "entregado"
}

// In-memory store for demo
const pedidos: Pedido[] = []

export async function GET() {
  return NextResponse.json({ pedidos })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.nombre || !body.telefono || !body.items) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: nombre, telefono, items" },
      { status: 400 }
    )
  }

  const nuevoPedido: Pedido = {
    id: `PED-${Date.now()}`,
    nombre: body.nombre,
    telefono: body.telefono,
    items: body.items,
    nota: body.nota,
    timestamp: new Date().toISOString(),
    status: "pendiente",
  }

  pedidos.push(nuevoPedido)

  // In production: send WhatsApp confirmation via Twilio/Meta API
  // await sendWhatsAppConfirmation(nuevoPedido)

  return NextResponse.json(
    {
      success: true,
      pedido: nuevoPedido,
      mensaje: `Pedido confirmado para ${nuevoPedido.nombre}. Lo tendremos listo pronto.`,
    },
    { status: 201 }
  )
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const pedido = pedidos.find((p) => p.id === body.id)

  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
  }

  pedido.status = body.status

  // In production: notify customer via WhatsApp when status = "listo"
  // if (body.status === "listo") await notifyCustomer(pedido)

  return NextResponse.json({ success: true, pedido })
}
