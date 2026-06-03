'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Phase = 'idle' | 'opening' | 'entered'

export default function DoorAnimation({
  destination = '/appartements/trouver-votre-etage',
}: {
  destination?: string
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const router = useRouter()

  const handleClick = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    setTimeout(() => {
      setPhase('entered')
      router.push(destination)
    }, 1100)
  }

  const isOpen = phase === 'opening' || phase === 'entered'

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Texte d'invitation */}
      <p
        className="text-sm font-serif italic text-muted transition-opacity duration-500"
        style={{ opacity: phase === 'idle' ? 1 : 0 }}
      >
        Frappez et entrez.
      </p>

      {/* Scène de la porte */}
      <div
        onClick={handleClick}
        role="button"
        aria-label="Ouvrir la porte de la Résidence Massamba-Débat"
        className="relative cursor-pointer"
        style={{ perspective: '1100px', width: 168, height: 272 }}
      >
        {/* ── Encadrement (statique) ── */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: '#d6cfc3',
            boxShadow:
              'inset 0 0 0 6px #c8c0b2, 0 12px 40px rgba(26,23,20,0.25)',
          }}
        />

        {/* ── Pièce derrière la porte ── */}
        <div
          className="absolute transition-opacity duration-600"
          style={{
            inset: 6,
            backgroundColor: '#0f0d0b',
            backgroundImage:
              'radial-gradient(ellipse at 50% 85%, rgba(196,168,130,0.3) 0%, transparent 60%)',
            opacity: isOpen ? 1 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="font-mono text-accent tracking-widest transition-opacity duration-300"
            style={{
              fontSize: 10,
              letterSpacing: '0.2em',
              opacity: phase === 'entered' ? 0.7 : 0,
            }}
          >
            ENTREZ
          </span>
        </div>

        {/* ── Panneau de porte (pivote) ── */}
        <div
          className="absolute"
          style={{
            inset: 6,
            transformOrigin: 'left center',
            transform: isOpen ? 'rotateY(-82deg)' : 'rotateY(0deg)',
            transition: 'transform 0.95s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backgroundColor: '#1a1714',
            boxShadow: isOpen
              ? '10px 0 48px rgba(0,0,0,0.7)'
              : '2px 0 6px rgba(0,0,0,0.2)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Moulure haute */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 14,
              right: 14,
              height: 74,
              border: '1.5px solid rgba(196,168,130,0.18)',
            }}
          />
          {/* Moulure basse */}
          <div
            style={{
              position: 'absolute',
              top: 106,
              left: 14,
              right: 14,
              bottom: 36,
              border: '1.5px solid rgba(196,168,130,0.18)',
            }}
          />

          {/* Poignée */}
          <div
            style={{
              position: 'absolute',
              right: 16,
              top: '52%',
              transform: 'translateY(-50%)',
              width: 11,
              height: 11,
              borderRadius: '50%',
              backgroundColor: '#c4a882',
              boxShadow:
                '0 0 0 2px rgba(196,168,130,0.25), inset 0 1px 2px rgba(255,255,255,0.15)',
            }}
          />

          {/* Plaque de numéro */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '2px 8px',
              border: '1px solid rgba(196,168,130,0.15)',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 9,
                letterSpacing: '0.15em',
                color: 'rgba(196,168,130,0.38)',
              }}
            >
              RMD — N°2
            </span>
          </div>
        </div>
      </div>

      {/* Label sous la porte */}
      <p
        className="text-xs font-mono text-muted tracking-widest uppercase transition-opacity duration-300"
        style={{ opacity: phase === 'idle' ? 1 : 0 }}
      >
        Résidence Massamba-Débat
      </p>
    </div>
  )
}
