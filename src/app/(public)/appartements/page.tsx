import DoorAnimation from '@/components/DoorAnimation'
import { BOOK_PUBLISHED } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Résidence',
  description: 'Entrez dans la Résidence Massamba-Débat — sept appartements, sept solitudes.',
}

export default function AppartementsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-20">

      {/* Portail + citation — toujours affiché en premier */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-6 md:mb-8">
          Extrait du roman
        </p>
        <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-ink leading-snug max-w-2xl mb-10 md:mb-14 px-2">
          "Un immeuble, sept solitudes, et au dernier étage,
          <br className="hidden sm:block" /> celle que personne n'a vue venir."
        </blockquote>

        {BOOK_PUBLISHED ? (
          <DoorAnimation />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div
              className="rounded-sm border border-faint/60"
              style={{
                width: 288,
                height: 252,
                background: 'linear-gradient(180deg, #ede8de 0%, #e8e0d3 100%)',
                boxShadow: 'inset 0 0 0 5px #d6cfc3',
                opacity: 0.35,
              }}
            />
            <p className="font-serif text-lg md:text-xl text-muted mt-3 md:mt-4">
              Les portes sont encore fermées.
            </p>
            <p className="text-sm font-mono text-muted/60 tracking-wide">
              Les premiers récits arrivent bientôt.
            </p>
          </div>
        )}
      </div>


    </div>
  )
}
