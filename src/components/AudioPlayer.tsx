'use client'

import { useState, useRef, useEffect } from 'react'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

function formatTime(s: number) {
  if (!s || !isFinite(s) || isNaN(s)) return '--:--'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const speed = SPEEDS[speedIdx]
  const progress = duration > 0 && isFinite(duration) ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)

    const trySetDuration = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
        setLoaded(true)
        if (audio.currentTime > audio.duration - 0.5 && !playingRef.current) {
          audio.currentTime = 0
          setCurrentTime(0)
        }
      }
    }

    const onLoadedMetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
        setLoaded(true)
      }
    }

    const onEnded = () => { setPlaying(false); playingRef.current = false }
    const onError = () => { setLoaded(false); setError(true) }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('durationchange', trySetDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('durationchange', trySetDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      playingRef.current = false
    } else {
      if (audio.currentTime > (isFinite(duration) ? duration : 0)) audio.currentTime = 0
      try {
        await audio.play()
        setPlaying(true)
        playingRef.current = true
      } catch {
        setPlaying(false)
        playingRef.current = false
      }
    }
  }

  const seek = (delta: number) => {
    const audio = audioRef.current
    if (!audio) return
    const target = Math.max(0, Math.min(isFinite(duration) ? duration : 0, audio.currentTime + delta))
    audio.currentTime = target
    setCurrentTime(target)
  }

  const handleSeekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration || !isFinite(duration)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const target = ratio * duration
    audio.currentTime = target
    setCurrentTime(target)
  }

  const cycleSpeed = () => {
    const audio = audioRef.current
    const next = (speedIdx + 1) % SPEEDS.length
    setSpeedIdx(next)
    if (audio) audio.playbackRate = SPEEDS[next]
  }

  if (error) {
    return (
      <div className="border border-faint rounded-lg px-4 py-4 mb-10 bg-faint/20 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-muted/40 flex-shrink-0" />
        <span className="text-xs font-mono text-muted/60 tracking-widest uppercase">
          Format audio non supporté par ce navigateur
        </span>
      </div>
    )
  }

  return (
    <div className="border border-faint rounded-lg px-4 py-4 mb-10 bg-faint/20">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
        <span className="text-xs font-mono text-muted tracking-widest uppercase">
          Écouter cet article
        </span>
      </div>

      {/* Barre de progression */}
      <div
        className="relative h-1.5 bg-faint rounded-full cursor-pointer mb-4 group"
        onClick={handleSeekBar}
      >
        <div
          className="absolute left-0 top-0 h-full bg-accent rounded-full"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-paper shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Contrôles — compact sur mobile */}
      <div className="flex items-center justify-between gap-2">
        {/* Temps */}
        <span className="text-xs font-mono text-muted tabular-nums flex-shrink-0">
          {formatTime(currentTime)}
          <span className="text-muted/40 mx-0.5">/</span>
          {loaded ? formatTime(duration) : '…'}
        </span>

        {/* Boutons centraux */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button type="button" onClick={() => seek(-10)}
            className="flex flex-col items-center gap-0.5 text-muted hover:text-ink transition-colors"
            title="Reculer 10s">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
            </svg>
            <span className="font-mono" style={{ fontSize: 9 }}>10</span>
          </button>

          <button type="button" onClick={togglePlay} disabled={!loaded}
            className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-ink/80 disabled:opacity-30 transition-colors flex-shrink-0"
            aria-label={playing ? 'Pause' : 'Lecture'}>
            {playing ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 1 }}>
                <path d="M6 4l14 8-14 8V4z" />
              </svg>
            )}
          </button>

          <button type="button" onClick={() => seek(10)}
            className="flex flex-col items-center gap-0.5 text-muted hover:text-ink transition-colors"
            title="Avancer 10s">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
            </svg>
            <span className="font-mono" style={{ fontSize: 9 }}>10</span>
          </button>
        </div>

        {/* Vitesse */}
        <button type="button" onClick={cycleSpeed}
          className="text-xs font-mono text-muted hover:text-ink border border-faint rounded px-2 py-1 transition-colors flex-shrink-0"
          title="Vitesse de lecture">
          {speed === 1 ? '1×' : `${speed}×`}
        </button>
      </div>
    </div>
  )
}
