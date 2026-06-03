import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Le Roman — Appartements',
  description:
    'Silences Ordinaires — la structure du roman, les personnages et la Résidence Massamba-Débat.',
}

export default function AppartementsAPropos() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      {/* Navigation */}
      <div className="mb-10">
        <Link
          href="/appartements/trouver-votre-etage"
          className="text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          ← Trouver votre étage
        </Link>
      </div>

      <div className="max-w-reading mx-auto">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-8">
          Le roman
        </p>

        <h1 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-10">
          Un immeuble, sept vies,
          <br />
          autant de silences.
        </h1>

        <div className="w-10 h-px bg-accent mb-12" />

        <div className="prose">
          <p>
            <em>Silences Ordinaires</em> est un roman qui explore ce que nous ne
            disons pas — les solitudes cachées derrière des façades de normalité,
            les douleurs que l'on tait pour ne pas déranger, les failles que l'on
            comble de bruits inutiles.
          </p>

          <p>
            L'histoire se déroule au sein d'un immeuble fictif, la{' '}
            <strong>Résidence Massamba-Débat</strong>, 2 rue Théophile Obenga.
            Sept appartements. Sept histoires. Sept façons d'être seul sans que
            personne ne le remarque.
          </p>

          <h2>La structure du roman</h2>

          <p>
            Chaque chapitre gravite autour d'un appartement différent et de ses
            habitants. Le rez-de-chaussée abrite la solitude du grand âge ; le
            premier étage, les blessures de l'amour et de l'exil intérieur ; le
            second, la fuite et le masque de la joie. Plus on monte, plus les
            silences se font lourds.
          </p>

          <p>
            Au dernier étage, le Penthouse — dont l'histoire ne sera révélée
            qu'à la fin du roman.
          </p>

          <h2>Le module Appartements</h2>

          <p>
            La page <em>Trouver votre étage</em> est une invitation à entrer
            dans la résidence. En saisissant votre prénom, vous découvrez à quel
            appartement vous pourriez être associé·e — et quel silence vous y
            attend peut-être.
          </p>

          <p>
            Ce n'est pas un test. C'est une porte entrouverte. Une façon de
            rappeler que derrière chaque prénom, il y a une histoire qui mérite
            d'être entendue.
          </p>
        </div>

        <div className="mt-14 pt-10 border-t border-faint">
          <blockquote className="font-serif text-xl text-muted italic leading-relaxed">
            "La solitude la plus insupportable n'est pas celle du désert —
            c'est celle du milieu des autres."
          </blockquote>
        </div>
      </div>
    </div>
  )
}
