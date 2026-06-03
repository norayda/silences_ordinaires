'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { AppartementResult } from '@/types'

const APPARTEMENTS_INFO: Record<string, { etage: string }> = {
  'Apt RDC': { etage: 'Rez-de-chaussée' },
  'Apt 1A': { etage: '1er étage — gauche' },
  'Apt 1B': { etage: '1er étage — droite' },
  'Apt 2A': { etage: '2e étage — gauche' },
  'Apt 2B': { etage: '2e étage — droite' },
  'Apt 3A': { etage: '3e étage — gauche' },
  'Apt 3B': { etage: '3e étage — droite' },
}

export default function TrouverVotreEtagePage() {
  const [prenom, setPrenom] = useState('')
  const [result, setResult] = useState<AppartementResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prenom.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/appartements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom: prenom.trim() }),
      })
      if (!res.ok) throw new Error()
      const data: AppartementResult = await res.json()
      setResult(data)
    } catch {
      setError(
        'Le gardien ne répond pas pour le moment. Veuillez réessayer.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    const text = `Résidence Massamba-Débat — ${result.appartement}\n${result.chapitre} : ${result.titre}\n\n${result.message}\n\nsilencesordinaires.fr`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const aptInfo = result ? APPARTEMENTS_INFO[result.appartement] : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      {/* Navigation retour */}
      <div className="mb-10">
        <Link
          href="/appartements"
          className="text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          ← La Résidence
        </Link>
      </div>

      {/* En-tête */}
      <div className="max-w-xl mb-14">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-5">
          Résidence Massamba-Débat
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-5">
          Quel étage
          <br />
          vous attend ?
        </h1>
        <p className="text-muted leading-relaxed">
          Chaque prénom a sa porte. Le gardien de la résidence vous associe à
          l'un des appartements — et au silence qui l'habite.
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="max-w-md mb-14">
        <div className="flex gap-3">
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Votre prénom"
            maxLength={50}
            className="flex-1 px-5 py-3 bg-faint/50 border border-faint rounded font-serif text-lg text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !prenom.trim()}
            className="px-6 py-3 bg-ink text-paper text-xs font-mono tracking-widest uppercase rounded hover:bg-ink/80 disabled:opacity-40 transition-all"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
            ) : (
              'Entrer'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-md mb-8 p-4 border border-faint rounded bg-faint/30">
          <p className="text-sm text-muted italic font-serif">{error}</p>
        </div>
      )}

      {/* Résultat + En savoir plus côte à côte */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        {/* Résultat */}
        {result ? (
          <div className="flex-1 border-l-4 border-accent pl-8 py-2 animate-fadeIn">
            <div className="mb-6">
              <p className="text-xs font-mono text-muted tracking-widest uppercase mb-1">
                {aptInfo?.etage ?? result.appartement}
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">
                {result.appartement}
              </h2>
              <p className="text-xs font-mono text-muted">
                {result.chapitre} — {result.titre}
              </p>
            </div>

            <div className="border-t border-faint pt-6 mb-8">
              <p className="font-serif text-ink text-lg leading-relaxed italic">
                {result.message}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCopy}
                className="text-xs font-mono text-muted hover:text-ink transition-colors"
              >
                {copied ? '✓ Copié' : '↗ Partager'}
              </button>
              <button
                onClick={() => {
                  setResult(null)
                  setPrenom('')
                }}
                className="text-xs font-mono text-muted hover:text-ink transition-colors"
              >
                Recommencer
              </button>
            </div>

            {/* Lien 3114 */}
            <div className="mt-10 pt-6 border-t border-faint max-w-sm">
              <p className="text-xs text-muted leading-relaxed">
                Si ce message a résonné, des professionnels sont disponibles
                24h/24 au{' '}
                <a
                  href="tel:3114"
                  className="text-ink font-semibold hover:text-accent transition-colors"
                >
                  3114
                </a>{' '}
                — numéro national de prévention du suicide, gratuit et
                confidentiel.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:block" />
        )}

        {/* Colonne droite — En savoir plus */}
        <div className="md:w-64 flex-shrink-0">
          <div className="border border-faint rounded p-6">
            <p className="text-xs font-mono text-muted tracking-widest uppercase mb-3">
              Le roman
            </p>
            <p className="font-serif text-ink text-lg leading-snug mb-4">
              Silences Ordinaires
            </p>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Découvrez l'histoire derrière la résidence, les personnages et la
              structure du roman.
            </p>
            <Link
              href="/appartements/a-propos"
              className="text-xs font-mono text-muted border border-faint px-4 py-2.5 rounded hover:border-muted hover:text-ink transition-colors inline-block"
            >
              En savoir plus →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
