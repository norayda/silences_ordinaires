import Image from 'next/image'
import { AUTHOR_IMAGE_URL } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Le blog Silences Ordinaires — une voix littéraire sur les solitudes invisibles.',
}

export default function APropos() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      {/* ── Section Blog ── */}
      <section className="max-w-reading mx-auto mb-20">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-8">
          Le blog
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-10">
          Silences Ordinaires
        </h1>
        <div className="w-10 h-px bg-accent mb-12" />

        <div className="prose">
          <p>
            <em>Silences Ordinaires</em> est un espace d'écriture sur ce que
            nous taisons — les petites et grandes solitudes du quotidien, celles
            que personne ne nomme parce qu'elles ne semblent pas mériter d'être
            nommées.
          </p>
          <p>
            Ce blog paraît chaque semaine. Il prend la forme de chroniques,
            d'observations, de réflexions. Parfois courtes, parfois longues.
            Toujours honnêtes.
          </p>
          <p>
            L'écriture y est pensée comme un acte de soin — pour soi, pour
            celles et ceux qui se reconnaîtront dans ces mots. Il n'y a pas de
            réponse ici, pas de solution. Juste des mots posés sur des choses
            que l'on préférerait souvent laisser dans l'ombre.
          </p>
          <p>
            Le blog accompagne un roman en cours d'écriture :{' '}
            <em>Silences Ordinaires</em>, dont vous pouvez découvrir la
            structure et les appartements fictifs dans la section{' '}
            <a href="/appartements">La Résidence</a>.
          </p>
        </div>
      </section>

      {/* ── Section Auteure ── */}
      <section className="border-t border-faint pt-16">
        <div className="max-w-reading mx-auto">
          <p className="text-xs font-mono text-muted tracking-widest uppercase mb-10">
            L'auteure
          </p>

          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            {/* Photo */}
            <div className="flex-shrink-0">
              {AUTHOR_IMAGE_URL ? (
                <div className="relative w-48 h-60 overflow-hidden rounded-sm">
                  <Image
                    src={AUTHOR_IMAGE_URL}
                    alt="Photo de l'auteure"
                    fill
                    className="object-cover grayscale"
                    sizes="192px"
                  />
                </div>
              ) : (
                <div
                  className="w-48 h-60 rounded-sm bg-faint border border-faint/80 flex items-center justify-center"
                  title="Ajoutez NEXT_PUBLIC_AUTHOR_IMAGE_URL dans .env.local"
                >
                  <span className="font-serif text-5xl text-muted/30">
                    S
                  </span>
                </div>
              )}
              {!AUTHOR_IMAGE_URL && (
                <p className="text-xs font-mono text-muted/50 mt-2 max-w-[12rem] leading-relaxed">
                  Ajoutez votre photo via{' '}
                  <code className="text-muted">
                    NEXT_PUBLIC_AUTHOR_IMAGE_URL
                  </code>{' '}
                  dans <code className="text-muted">.env.local</code>
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="flex-1 prose">
              {/*
               * ─── À personnaliser ───────────────────────────────────────
               * Remplacez ce contenu par votre biographie.
               * ───────────────────────────────────────────────────────────
               */}
              <h2 className="font-serif text-2xl text-ink mt-0">
                Votre nom ici
              </h2>
              <p>
                [Présentez-vous ici — quelques lignes sur qui vous êtes, votre
                rapport à l'écriture, ce qui vous a amené·e à créer ce blog.]
              </p>
              <p>
                [Vous pouvez évoquer votre parcours, vos influences littéraires,
                les raisons pour lesquelles les thèmes des solitudes invisibles
                résonnent pour vous.]
              </p>
              <p>
                Pour toute demande :{' '}
                <a href="mailto:contact@silencesordinaires.fr">
                  contact@silencesordinaires.fr
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lien 3114 ── */}
      <section className="mt-20 border-t border-faint pt-10 max-w-reading mx-auto">
        <p className="text-sm text-muted leading-relaxed">
          Ce blog aborde des thèmes sensibles. Si vous traversez une période
          difficile, des professionnels sont disponibles 24h/24 au{' '}
          <a
            href="tel:3114"
            className="text-ink font-semibold hover:text-accent transition-colors"
          >
            3114
          </a>{' '}
          — numéro national de prévention du suicide, gratuit et confidentiel.
        </p>
      </section>
    </div>
  )
}
