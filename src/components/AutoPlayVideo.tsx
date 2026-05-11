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
  const [blocked, setBlocked] = useState(false)

  const posterSrc = poster ?? src.replace(/\.(mp4|webm|mov)$/i, ".jpg")

  useEffect(() => {
    const video = ref.current
    if (!video) return

    let cancelled = false

    const tryPlay = () => {
      video.play().then(
        () => {
          if (cancelled) return
          setPlaying(true)
          setBlocked(false)
        },
        () => {
          if (cancelled) return
          setPlaying(false)
          setBlocked(true)
        }
      )
    }

    const onCanPlay = () => tryPlay()
    video.addEventListener("canplay", onCanPlay)

    if (video.readyState >= 3) tryPlay()

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
      },
      { threshold: 0.1 }
    )
    observer.observe(video)

    return () => {
      cancelled = true
      video.removeEventListener("canplay", onCanPlay)
      document.removeEventListener("visibilitychange", onVisibility)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={className} style={{ background: "#1a0f0a" }}>
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      />
      {!blocked && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
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
          style={{ opacity: playing ? 1 : 0, transition: "opacity 0.5s ease", pointerEvents: "none" }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
