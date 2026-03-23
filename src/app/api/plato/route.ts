import { NextRequest, NextResponse } from "next/server"

type Plato = { nombre: string; precio: number }

let plato: Plato = { nombre: "", precio: 0 }

export async function GET() {
  return NextResponse.json(plato)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  plato = { nombre: body.nombre ?? "", precio: Number(body.precio) ?? 0 }
  return NextResponse.json({ success: true, plato })
}
