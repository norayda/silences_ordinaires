import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import type { Post } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = decodeURIComponent(params.category)
  return {
    title: cat,
    description: `Articles dans la catégorie ${cat} — Silences Ordinaires.`,
  }
}

export const revalidate = 60

export default async function CategoryPage({ params }: Props) {
  const category = decodeURIComponent(params.category)
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (!posts || posts.length === 0) notFound()

  return (
    <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
      {/* Navigation retour */}
      <div className="mb-10">
        <Link
          href="/categories"
          className="text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          ← Toutes les catégories
        </Link>
      </div>

      {/* En-tête */}
      <div className="mb-12 border-b border-faint pb-8">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-3">
          Catégorie
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink">{category}</h1>
        <p className="text-sm font-mono text-muted mt-3">
          {posts.length} article{posts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        {(posts as Post[]).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
