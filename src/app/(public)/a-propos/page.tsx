import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Le blog Silences Ordinaires — une voix littéraire sur les solitudes invisibles.',
}

export const revalidate = 60

export default async function APropos() {
  const supabase = createClient()
  const { data: rows } = await supabase.from('settings').select('key, value')
  const settings: Record<string, string> = {}
  for (const row of rows ?? []) settings[row.key] = row.value

  const authorName = settings.author_name || ''
  const authorBio = settings.author_bio || ''
  const authorImageUrl = settings.author_image_url || ''
  const instagramUrl = settings.instagram_url || ''
  const tiktokUrl = settings.tiktok_url || ''
  const bioParagraphs = authorBio.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-20">
      {/* Section Blog */}
      <section className="max-w-reading mx-auto mb-14 md:mb-20">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-6 md:mb-8">Le blog</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight mb-8 md:mb-10">
          Silences Ordinaires
        </h1>
        <div className="w-10 h-px bg-accent mb-8 md:mb-12" />
        <div className="prose">
          <p><em>Silences Ordinaires</em> est un espace d'écriture sur ce que nous taisons — les petites et grandes solitudes du quotidien, celles que personne ne nomme parce qu'elles ne semblent pas mériter d'être nommées.</p>
          <p>Ce blog paraît chaque semaine. Il prend la forme de chroniques, d'observations, de réflexions. Parfois courtes, parfois longues. Toujours honnêtes.</p>
          <p>L'écriture y est pensée comme un acte de soin — pour soi, pour celles et ceux qui se reconnaîtront dans ces mots. Il n'y a pas de réponse ici, pas de solution. Juste des mots posés sur des choses que l'on préférerait souvent laisser dans l'ombre.</p>
          <p>Le blog accompagne un roman en cours d'écriture : <em>Silences Ordinaires</em>, dont vous pouvez découvrir un aperçu dans la section <a href="/appartements">La Résidence</a>.</p>
        </div>
      </section>

      {/* Section Auteure */}
      <section className="border-t border-faint pt-12 md:pt-16">
        <div className="max-w-reading mx-auto">
          <p className="text-xs font-mono text-muted tracking-widest uppercase mb-8 md:mb-10">L'auteure</p>
          <div className="flex flex-col sm:flex-row gap-8 md:gap-14 items-start">
            {/* Photo */}
            <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
              {authorImageUrl ? (
                <div className="relative w-36 h-44 sm:w-48 sm:h-60 overflow-hidden rounded-sm">
                  <Image src={authorImageUrl} alt={authorName || "Photo de l'auteure"}
                    fill className="object-cover grayscale" sizes="(max-width: 640px) 144px, 192px" />
                </div>
              ) : (
                <div className="w-36 h-44 sm:w-48 sm:h-60 rounded-sm bg-faint border border-faint/80 flex items-center justify-center">
                  <span className="font-serif text-4xl md:text-5xl text-muted/30">S</span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="flex-1">
              {authorName && (
                <h2 className="font-serif text-xl md:text-2xl text-ink mb-4 md:mb-6">{authorName}</h2>
              )}
              {bioParagraphs.length > 0 ? (
                <div className="prose">
                  {bioParagraphs.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              ) : (
                <p className="text-muted font-serif italic text-sm">La biographie sera disponible prochainement.</p>
              )}

              {/* Liens réseaux sociaux */}
              {(instagramUrl || tiktokUrl) && (
                <div className="flex items-center gap-4 mt-6">
                  {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                      className="text-muted hover:text-ink transition-colors"
                      aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {tiktokUrl && (
                    <a href={tiktokUrl} target="_blank" rel="noopener noreferrer"
                      className="text-muted hover:text-ink transition-colors"
                      aria-label="TikTok">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.84 1.56V6.82a4.85 4.85 0 01-1.07-.13z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lien 3114 */}
      <section className="mt-14 md:mt-20 border-t border-faint pt-8 md:pt-10 max-w-reading mx-auto">
        <p className="text-sm text-muted leading-relaxed">
          Ce blog aborde des thèmes sensibles. Si vous traversez une période difficile, des professionnels sont disponibles 24h/24 au{' '}
          <a href="tel:3114" className="text-ink font-semibold hover:text-accent transition-colors">3114</a>{' '}
          — numéro national de prévention du suicide, gratuit et confidentiel.
        </p>
      </section>
    </div>
  )
}
