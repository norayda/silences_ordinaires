import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import CommentForm from '@/components/CommentForm'
import AudioPlayer from '@/components/AudioPlayer'
import { formatDate } from '@/lib/utils'
import { MENTAL_HEALTH_CATEGORIES } from '@/lib/config'
import type { Comment } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single()

  if (!post) return {}
  return { title: post.title, description: post.excerpt ?? undefined }
}

export const revalidate = 60

export default async function BlogPost({ params }: Props) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = user
    ? await supabase.from('posts').select('*').eq('slug', params.slug).single()
    : await supabase.from('posts').select('*').eq('slug', params.slug).eq('published', true).single()

  if (!post) notFound()

  const { data: comments } = await supabase
    .from('comments').select('*')
    .eq('post_id', post.id).eq('approved', true)
    .order('created_at', { ascending: true })

  const showMentalHealthBanner = MENTAL_HEALTH_CATEGORIES.includes(post.category ?? '')

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-20">
      {/* Navigation */}
      <div className="mb-8 md:mb-10">
        <Link href="/" className="text-xs font-mono text-muted hover:text-ink transition-colors">
          ← Retour aux articles
        </Link>
      </div>

      {/* Bandeau brouillon */}
      {!post.published && user && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded text-xs font-mono text-amber-700 text-center tracking-wide">
          BROUILLON — non visible par le public
        </div>
      )}

      {/* En-tête */}
      <header className="max-w-reading mx-auto mb-10 md:mb-12">
        <div className="flex items-center gap-3 mb-3 md:mb-4 flex-wrap">
          <time className="text-xs font-mono text-muted">{formatDate(post.created_at)}</time>
          {post.category && (
            <>
              <span className="text-muted/30 text-xs">·</span>
              <Link href={`/categories/${encodeURIComponent(post.category)}`}
                className="text-xs font-mono text-muted hover:text-ink transition-colors">
                {post.category}
              </Link>
            </>
          )}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl text-ink leading-tight mb-4 md:mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-base md:text-lg text-muted font-serif italic leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </header>

      {/* Image de couverture */}
      {post.cover_url && (
        <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] mb-10 md:mb-14 overflow-hidden bg-faint">
          <Image src={post.cover_url} alt={post.title} fill
            className="object-cover grayscale" priority sizes="100vw" />
        </div>
      )}

      {/* Player audio */}
      {post.audio_url && (
        <div className="max-w-reading mx-auto">
          <AudioPlayer src={post.audio_url} />
        </div>
      )}

      {/* Contenu */}
      <div className="prose max-w-reading mx-auto mb-16 md:mb-20"
        dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="max-w-reading mx-auto mb-12 md:mb-16">
        <hr className="border-none border-t border-faint" />
      </div>

      {/* Lien 3114 */}
      {showMentalHealthBanner && (
        <div className="max-w-reading mx-auto mb-12 md:mb-16 p-4 md:p-5 border border-faint rounded bg-faint/30">
          <p className="text-sm text-muted leading-relaxed">
            Si ce texte a résonné en vous ou en quelqu'un que vous connaissez,
            des professionnels sont disponibles 24h/24 au{' '}
            <a href="tel:3114" className="text-ink font-semibold hover:text-accent transition-colors">3114</a>{' '}
            — numéro national de prévention du suicide, gratuit et confidentiel.
          </p>
        </div>
      )}

      {/* Commentaires */}
      <section className="max-w-reading mx-auto">
        <h2 className="font-serif text-xl md:text-2xl text-ink mb-6 md:mb-8">Vos mots</h2>

        {comments && comments.length > 0 ? (
          <div className="space-y-5 md:space-y-6 mb-10 md:mb-12">
            {(comments as Comment[]).map((comment) => (
              <div key={comment.id} className="border-l-2 border-faint pl-4 md:pl-6 py-1">
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="font-serif text-ink">{comment.author_name}</span>
                  <time className="text-xs font-mono text-muted">{formatDate(comment.created_at)}</time>
                </div>
                <p className="text-sm text-ink/80 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted mb-8 italic font-serif">
            Soyez le premier à laisser un mot.
          </p>
        )}

        <div className="border-t border-faint pt-6 md:pt-8">
          <h3 className="font-mono text-xs text-muted tracking-widest uppercase mb-5 md:mb-6">
            Laisser un commentaire
          </h3>
          <CommentForm postId={post.id} />
        </div>
      </section>
    </article>
  )
}
