"use client"

import { useRef, useEffect, useState } from "react"

export default function AutoPlayVideo({
  src,
  className,
  poster,
}: {
  src: string
  className?: string
  poster?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // Mark ready once video can play
    const onCanPlay = () => {
      setReady(true)
      video.play().catch(() => {})
    }

    video.addEventListener("canplay", onCanPlay)

    // If already loaded (cached)
    if (video.readyState >= 3) {
      setReady(true)
      video.play().catch(() => {})
    }

    // Play when page becomes visible again (tab switch)
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        video.play().catch(() => {})
      }
    }
    document.addEventListener("visibilitychange", onVisibility)

    // Play when video enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(video)

    return () => {
      video.removeEventListener("canplay", onCanPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={className} style={{ background: "#1a0f0a" }}>
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className="w-full h-full object-cover"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  )
}
