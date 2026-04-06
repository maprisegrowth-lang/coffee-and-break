import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ pedidos: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.nombre || !body.items) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: nombre, items" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("pedidos")
    .insert({
      nombre: body.nombre,
      items: body.items,
      total: body.total || 0,
      estado: "pendiente",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    { success: true, pedido: data },
    { status: 201 }
  )
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()

  if (!body.id || !body.estado) {
    return NextResponse.json(
      { error: "Faltan campos: id, estado" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from("pedidos")
    .update({ estado: body.estado })
    .eq("id", body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, pedido: data })
}
