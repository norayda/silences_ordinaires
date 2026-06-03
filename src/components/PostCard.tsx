import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/types'

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3] mb-5 bg-faint">
          {post.cover_url ? (
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-faint flex items-center justify-center">
              <span className="font-serif text-3xl text-muted/40">S</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <time className="text-xs font-mono text-muted">
              {formatDate(post.created_at)}
            </time>
            {post.category && (
              <>
                <span className="text-muted/30 text-xs">·</span>
                <span className="text-xs font-mono text-muted/70">
                  {post.category}
                </span>
              </>
            )}
          </div>

          <h2 className="font-serif text-xl text-ink leading-snug mb-3 group-hover:text-accent transition-colors duration-300">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1">
              {post.excerpt}
            </p>
          )}

          <span className="mt-4 text-xs font-mono text-accent group-hover:translate-x-1 transition-transform duration-300 inline-block">
            Lire →
          </span>
        </div>
      </article>
    </Link>
  )
}
