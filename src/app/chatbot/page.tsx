"use client"

import { useState, useRef, useEffect } from "react"

type Message = {
  id: number
  text: string
  from: "user" | "bot"
  time: string
}

function formatWhatsApp(text: string) {
  return text
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
}

function getTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

const INITIAL_MSG: Message = {
  id: 0,
  text: "Hola 👋 Bienvenido a *Coffee and Break*\n\n¿En qué te puedo ayudar?",
  from: "bot",
  time: "",
}

const INITIAL_QUICK = ["1️⃣ Hacer un pedido", "2️⃣ Ver la carta", "3️⃣ Horarios", "4️⃣ Ubicación"]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [botState, setBotState] = useState("main")
  const [quickReplies, setQuickReplies] = useState<string[]>(INITIAL_QUICK)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([{ ...INITIAL_MSG, time: getTime() }])
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  const send = async (text: string) => {
    if (!text.trim() || typing) return

    const now = getTime()
    setMessages((prev) => [...prev, { id: Date.now(), text, from: "user", time: now }])
    setInput("")
    setQuickReplies([])
    setTyping(true)

    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500))

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, state: botState }),
    })
    const data = await res.json()
    setTyping(false)
    setBotState(data.state)
    setQuickReplies(data.quickReplies ?? [])
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: data.response,
        from: "bot",
        time: getTime(),
      },
    ])
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  // Extract just the number/label from quick reply for display, send the number
  const handleQuickReply = (q: string) => {
    const numEmoji = q.match(/^(\d+)️⃣/)
    const numPlain = q.match(/^(\d+)\s/)
    // Si empieza con número lo manda como número, sino manda el texto completo
    const label = numEmoji ? numEmoji[1] : numPlain ? numPlain[1] : q
    send(label)
  }

  // Label shown on button (strip number prefix for cleanliness)
  const quickLabel = (q: string) => {
    return q.replace(/^\d+️⃣\s*/, "").replace(/^\d+\s/, "")
  }

  return (
    <div className="min-h-screen bg-[#111b21] flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm flex flex-col rounded-3xl overflow-hidden shadow-2xl"
        style={{ height: "780px", background: "#0b141a" }}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#202c33" }}>
          <div className="flex-1">
            <p className="text-[#e9edef] font-semibold text-sm">Coffee and Break</p>
            <p className="text-[#8696a0] text-xs">Bot · responde al instante</p>
          </div>
          <button
            onClick={() => {
              setMessages([INITIAL_MSG])
              setBotState("main")
              setQuickReplies(INITIAL_QUICK)
            }}
            className="text-[#8696a0] text-xs hover:text-[#e9edef] transition-colors px-2 py-1 rounded border border-[#2a3942]"
          >
            Reiniciar
          </button>
        </div>

        {/* CHAT */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
          style={{ background: "#0b141a" }}
        >
          <div className="flex justify-center mb-4">
            <span className="text-xs px-3 py-1 rounded-full text-[#8696a0]" style={{ background: "#1f2c34" }}>
              HOY
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-2`}>
              <div
                className="max-w-[82%] px-3 py-2"
                style={{
                  background: msg.from === "user" ? "#005c4b" : "#202c33",
                  borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                }}
              >
                <p
                  className="text-[#e9edef] text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatWhatsApp(msg.text) }}
                />
                <p className="text-[#8696a0] text-xs mt-1 text-right flex items-center justify-end gap-1">
                  {msg.time}
                  {msg.from === "user" && (
                    <svg className="w-4 h-4 text-[#53bdeb]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                    </svg>
                  )}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start mb-2">
              <div className="px-4 py-3 flex items-center gap-1" style={{ background: "#202c33", borderRadius: "18px 18px 18px 4px" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#8696a0]"
                    style={{ animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* QUICK REPLIES DINÁMICOS */}
        {quickReplies.length > 0 && (
          <div className="px-3 py-2 flex flex-wrap gap-2" style={{ background: "#111b21" }}>
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => handleQuickReply(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#00a884] text-[#00a884] hover:bg-[#00a884] hover:text-white transition-colors font-medium"
              >
                {quickLabel(q)}
              </button>
            ))}
          </div>
        )}

        {/* INPUT */}
        <div className="flex items-center gap-2 px-3 py-3" style={{ background: "#111b21" }}>
          <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "#2a3942" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe un mensaje o toca un botón"
              className="flex-1 bg-transparent text-[#e9edef] text-sm outline-none placeholder:text-[#8696a0]"
            />
          </div>
          <button
            onClick={() => send(input)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: input.trim() ? "#00a884" : "#2a3942" }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
