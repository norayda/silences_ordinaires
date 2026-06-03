'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Phase = 'idle' | 'open' | 'entering'

// Layout
const PILLAR_W = 32
const PANEL_W = 102
const GATE_H = 258
const TOTAL_W = PILLAR_W * 2 + PANEL_W * 2 // 268

// Gate SVG geometry
const TP = 26     // arch top-padding at center (min space above rail)
const AR = 52     // arch drop: how much lower the pillar side sits vs center
const TH = 24     // lance tip height above the arch rail
const BRY = 218   // y of bottom rail
const RH = 7      // rail height
const BW = 9      // bar width

const iron = '#1c1917'
const rail = '#28221c'

// Bar x-positions (even spacing in a 102px panel)
const RAW_BARS = [13, 35, 58, 80]

// Arch height at bar-center cx, using a parabola symmetric around gate center.
// Left panel  : pillar at x=0  → high archY ; center at x=w → low archY
// Right panel : center at x=0  → low archY  ; pillar at x=w → high archY
function archY(cx: number, w: number, side: 'left' | 'right'): number {
  const t = side === 'left' ? 1 - cx / w : cx / w
  return TP + AR * t * t
}

// Bezier path approximating the parabola for the arch rail stroke
function archPath(w: number, side: 'left' | 'right'): string {
  if (side === 'left') {
    // starts high (pillar), drops to center
    return `M 0,${TP + AR} C ${w * 0.33},${TP + AR * 0.38} ${w * 0.67},${TP} ${w},${TP}`
  } else {
    // starts at center (low), rises toward pillar
    return `M 0,${TP} C ${w * 0.33},${TP} ${w * 0.67},${TP + AR * 0.38} ${w},${TP + AR}`
  }
}

function GatePanel({ side, w, h }: { side: 'left' | 'right'; w: number; h: number }) {
  // Right panel mirrors left: same numeric positions, different archY formula
  const barXs = side === 'left'
    ? RAW_BARS
    : RAW_BARS.map((x) => w - x - BW).reverse()

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {/* Bar shafts — drawn first, arch rail will overlay their tops */}
      {barXs.map((bx) => {
        const cx = bx + BW / 2
        const ay = archY(cx, w, side)
        return <rect key={bx} x={bx} y={ay} width={BW} height={BRY - ay} fill={iron} />
      })}

      {/* Arch rail — thick bezier stroke over bar shafts */}
      <path
        d={archPath(w, side)}
        fill="none"
        stroke={rail}
        strokeWidth="10"
        strokeLinecap="square"
      />

      {/* Lance tips — drawn over arch rail so they emerge from it */}
      {barXs.map((bx) => {
        const cx = bx + BW / 2
        const ay = archY(cx, w, side)
        return (
          <polygon
            key={`t${bx}`}
            points={`${cx},${ay - TH}  ${bx + BW + 3},${ay}  ${bx - 3},${ay}`}
            fill={iron}
          />
        )
      })}

      {/* Bottom rail */}
      <rect x={0} y={BRY} width={w} height={RH} fill={rail} />

      {/* Kick plate */}
      <rect x={0} y={BRY + RH} width={w} height={h - BRY - RH} fill={rail} />
    </svg>
  )
}

function Pillar({ h }: { h: number }) {
  return (
    <div style={{ width: PILLAR_W, height: h, position: 'relative' }}>
      {/* Body */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, #9e9588 0%, #cac2b2 38%, #b8b0a0 65%, #9e9588 100%)',
      }} />
      {/* Wide cornice */}
      <div style={{
        position: 'absolute', top: 8, left: -5, right: -5, height: 12,
        background: 'linear-gradient(180deg, #c8c0b0 0%, #aaa298 100%)',
        boxShadow: '0 3px 5px rgba(0,0,0,0.22)',
      }} />
      {/* Narrow abacus on top */}
      <div style={{
        position: 'absolute', top: 0, left: -2, right: -2, height: 9,
        background: 'linear-gradient(180deg, #dcd4c4 0%, #beb6a6 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      }} />
      {/* Stone joints */}
      {[68, 136, 204].map((y) => (
        <div key={y} style={{
          position: 'absolute', top: y, left: 0, right: 0,
          height: 1, background: 'rgba(0,0,0,0.12)',
        }} />
      ))}
    </div>
  )
}

export default function DoorAnimation({
  destination = '/appartements/trouver-votre-etage',
}: {
  destination?: string
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const router = useRouter()

  const handleClick = () => {
    if (phase === 'idle') {
      setPhase('open')
    } else if (phase === 'open') {
      setPhase('entering')
      router.push(destination)
    }
  }

  const isOpen = phase === 'open' || phase === 'entering'

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Invitation — fades when gate opens */}
      <p
        className="text-sm font-serif italic text-muted transition-opacity duration-500"
        style={{ opacity: phase === 'idle' ? 1 : 0 }}
      >
        Poussez les grilles et entrez.
      </p>

      {/* Gate scene */}
      <div
        onClick={handleClick}
        role="button"
        aria-label={
          phase === 'idle'
            ? 'Ouvrir le portail de la Résidence'
            : 'Entrer dans la Résidence'
        }
        className="relative cursor-pointer"
        style={{ perspective: '1400px', width: TOTAL_W, height: GATE_H }}
      >
        {/* Backdrop — revealed when gate opens */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            backgroundColor: '#0f0d0b',
            backgroundImage:
              'radial-gradient(ellipse at 50% 80%, rgba(196,168,130,0.2) 0%, transparent 60%)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <span
            className="font-serif italic text-accent"
            style={{
              fontSize: 15,
              letterSpacing: '0.15em',
              opacity: phase === 'open' ? 1 : 0,
              transition: 'opacity 0.5s ease 0.5s',
            }}
          >
            Entrez.
          </span>
          <span
            className="font-mono text-muted/50"
            style={{
              fontSize: 9,
              letterSpacing: '0.18em',
              opacity: phase === 'open' ? 0.8 : 0,
              transition: 'opacity 0.5s ease 0.9s',
            }}
          >
            ↑ CLIQUEZ POUR ENTRER
          </span>
        </div>

        {/* Left panel */}
        <div
          className="absolute"
          style={{
            left: PILLAR_W, top: 0,
            width: PANEL_W, height: GATE_H,
            transformOrigin: 'left center',
            transform: isOpen ? 'rotateY(-78deg)' : 'rotateY(0deg)',
            transition: 'transform 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backfaceVisibility: 'hidden',
            zIndex: 5,
          }}
        >
          <GatePanel side="left" w={PANEL_W} h={GATE_H} />
        </div>

        {/* Right panel */}
        <div
          className="absolute"
          style={{
            left: PILLAR_W + PANEL_W, top: 0,
            width: PANEL_W, height: GATE_H,
            transformOrigin: 'right center',
            transform: isOpen ? 'rotateY(78deg)' : 'rotateY(0deg)',
            transition: 'transform 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            backfaceVisibility: 'hidden',
            zIndex: 5,
          }}
        >
          <GatePanel side="right" w={PANEL_W} h={GATE_H} />
        </div>

        {/* Left pillar — static, on top */}
        <div className="absolute" style={{ left: 0, top: 0, zIndex: 10 }}>
          <Pillar h={GATE_H} />
        </div>

        {/* Right pillar — static, on top */}
        <div className="absolute" style={{ right: 0, top: 0, zIndex: 10 }}>
          <Pillar h={GATE_H} />
        </div>
      </div>

      {/* Label — fades when gate opens */}
      <p
        className="text-xs font-mono text-muted tracking-widest uppercase transition-opacity duration-300"
        style={{ opacity: phase === 'idle' ? 1 : 0 }}
      >
        Résidence Massamba-Débat
      </p>
    </div>
  )
}
