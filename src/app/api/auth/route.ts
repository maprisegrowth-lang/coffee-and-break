import { NextRequest, NextResponse } from "next/server"

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "coffeeandbreak2026"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === DASHBOARD_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set("cb_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    })
    return response
  }

  return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 })
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("cb_auth")
  return NextResponse.json({ authenticated: cookie?.value === "true" })
}
