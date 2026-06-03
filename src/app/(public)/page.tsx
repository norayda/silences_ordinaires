import { createClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import type { Post } from '@/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('posts')
    .select('category')
    .eq('published', true)
    .not('category', 'is', null)

  const uniqueCategories = Array.from(
    new Set((categories ?? []).map((r) => r.category).filter(Boolean))
  ) as string[]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-20">
      {/* En-tête */}
      <div className="mb-10 md:mb-12 border-b border-faint pb-6 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-muted tracking-widest uppercase mb-2 md:mb-3">
              Journal
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-ink leading-tight">
              Silences Ordinaires
            </h1>
          </div>

          {/* Filtres catégories — scroll horizontal sur mobile */}
          {uniqueCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap sm:justify-end">
              {uniqueCategories.slice(0, 4).map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${encodeURIComponent(cat)}`}
                  className="flex-shrink-0 text-xs font-mono text-muted border border-faint px-3 py-1.5 rounded-full hover:border-muted hover:text-ink transition-colors"
                >
                  {cat}
                </Link>
              ))}
              {uniqueCategories.length > 4 && (
                <Link href="/categories" className="flex-shrink-0 text-xs font-mono text-accent hover:text-ink transition-colors">
                  Toutes →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grille */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {(posts as Post[]).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 md:py-24">
          <p className="font-serif text-xl md:text-2xl text-muted mb-3">
            Les premiers mots arrivent bientôt.
          </p>
          <p className="text-sm font-mono text-muted/60">Revenez prochainement.</p>
        </div>
      )}
    </div>
  )
}
