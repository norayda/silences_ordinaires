import DoorAnimation from '@/components/DoorAnimation'
import { BOOK_PUBLISHED } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Résidence',
  description:
    'Entrez dans la Résidence Massamba-Débat — sept appartements, sept solitudes.',
}

export default function AppartementsPage() {
  return (
      <div className="border-t border-faint pt-16 flex flex-col items-center text-center">
        {/* ── Section citation + porte ── */}
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-8">
          Extrait du roman
        </p>
        <blockquote className="font-serif text-2xl md:text-3xl text-ink leading-snug max-w-2xl mb-14">
          "Un immeuble ordinaire. Des vies ordinaires.
          <br className="hidden md:block" /> Et dans chaque appartement, un silence que personne autour ne semble entendre."
        </blockquote>

        {/* Porte ou message d'attente */}
        {BOOK_PUBLISHED ? (
          <DoorAnimation />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              className="rounded-sm border border-faint/60"
              style={{
                width: 168,
                height: 272,
                background: 'linear-gradient(180deg, #ede8de 0%, #e8e0d3 100%)',
                boxShadow: 'inset 0 0 0 6px #d6cfc3',
                opacity: 0.35,
              }}
            />
            <p className="font-serif text-xl text-muted mt-4">
              Les portes sont encore fermées.
            </p>
            <p className="text-sm font-mono text-muted/60 tracking-wide">
              Les premiers récits arrivent bientôt.
            </p>
          </div>
        )}
      </div>
  )
}
