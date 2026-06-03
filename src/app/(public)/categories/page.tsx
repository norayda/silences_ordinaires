import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégories',
  description: 'Explorer les articles par catégorie.',
}

export const revalidate = 60

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data } = await supabase.from('posts').select('category')
    .eq('published', true).not('category', 'is', null)

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    if (row.category) counts[row.category] = (counts[row.category] ?? 0) + 1
  }
  const categories = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-20">
      <div className="mb-10 md:mb-12 border-b border-faint pb-6 md:pb-8">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-2 md:mb-3">Index</p>
        <h1 className="font-serif text-3xl md:text-5xl text-ink">Catégories</h1>
      </div>

      {categories.length === 0 ? (
        <p className="font-serif text-xl text-muted italic">Aucun article publié pour le moment.</p>
      ) : (
        <div className="divide-y divide-faint">
          {categories.map(([cat, count]) => (
            <Link key={cat} href={`/categories/${encodeURIComponent(cat)}`}
              className="group flex items-baseline justify-between py-5 md:py-7 hover:pl-2 transition-all duration-300">
              <span className="font-serif text-xl md:text-3xl text-ink group-hover:text-accent transition-colors duration-300">
                {cat}
              </span>
              <span className="text-xs font-mono text-muted group-hover:text-ink transition-colors flex-shrink-0 ml-4">
                {count} article{count > 1 ? 's' : ''} →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
