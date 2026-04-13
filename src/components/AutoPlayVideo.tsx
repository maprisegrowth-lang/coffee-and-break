"use client"

import { useRef, useEffect } from "react"

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

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // Play on mount
    video.play().catch(() => {})

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
      document.removeEventListener("visibilitychange", onVisibility)
      observer.disconnect()
    }
  }, [])

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
