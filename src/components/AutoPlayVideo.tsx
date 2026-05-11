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
  const [playing, setPlaying] = useState(false)

  const posterSrc = poster ?? src.replace(/\.(mp4|webm|mov)$/i, ".jpg")

  useEffect(() => {
    const video = ref.current
    if (!video) return

    let cancelled = false

    const tryPlay = () => {
      const p = video.play()
      if (p && typeof p.then === "function") {
        p.catch(() => {})
      }
    }

    const onPlaying = () => { if (!cancelled) setPlaying(true) }
    const onPause = () => { if (!cancelled) setPlaying(false) }
    const onCanPlay = () => tryPlay()

    video.addEventListener("playing", onPlaying)
    video.addEventListener("pause", onPause)
    video.addEventListener("canplay", onCanPlay)

    if (video.readyState >= 3) tryPlay()

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const onUserGesture = () => tryPlay()
    document.addEventListener("touchstart", onUserGesture, { passive: true })
    document.addEventListener("scroll", onUserGesture, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
      },
      { threshold: 0.1 }
    )
    observer.observe(video)

    return () => {
      cancelled = true
      video.removeEventListener("playing", onPlaying)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("canplay", onCanPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      document.removeEventListener("touchstart", onUserGesture)
      document.removeEventListener("scroll", onUserGesture)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={className} style={{ background: "#1a0f0a" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none", zIndex: 0 }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          pointerEvents: "none",
          zIndex: 1,
          opacity: playing ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      />
    </div>
  )
}
