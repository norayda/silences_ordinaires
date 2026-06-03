'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Post, Comment } from '@/types'

interface CommentWithPost extends Comment {
  posts: { title: string; slug: string } | null
}

export default function AdminDashboard() {
  const supabase = createClient()

  const [posts, setPosts] = useState<Post[]>([])
  const [pendingComments, setPendingComments] = useState<CommentWithPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoadingPosts(false)
  }

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, posts(title, slug)')
      .eq('approved', false)
      .order('created_at', { ascending: true })
    setPendingComments(data ?? [])
    setLoadingComments(false)
  }

  useEffect(() => {
    fetchPosts()
    fetchComments()
  }, [])

  const togglePublished = async (post: Post) => {
    await supabase
      .from('posts')
      .update({ published: !post.published })
      .eq('id', post.id)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, published: !p.published } : p
      )
    )
  }

  const deletePost = async (id: string) => {
    if (!confirm('Supprimer cet article définitivement ?')) return
    await supabase.from('posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const approveComment = async (id: string) => {
    await supabase.from('comments').update({ approved: true }).eq('id', id)
    setPendingComments((prev) => prev.filter((c) => c.id !== id))
  }

  const rejectComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setPendingComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-16">
      {/* Section articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-ink">Articles</h1>
          <Link
            href="/admin/nouveau"
            className="px-4 py-2 bg-ink text-paper text-xs font-mono tracking-widest uppercase rounded hover:bg-ink/80 transition-colors"
          >
            + Nouvel article
          </Link>
        </div>

        {loadingPosts ? (
          <p className="text-sm text-muted font-mono">Chargement...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted font-serif italic">
            Aucun article pour le moment.
          </p>
        ) : (
          <div className="border border-faint rounded overflow-hidden divide-y divide-faint">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-5 py-4 bg-paper hover:bg-faint/30 transition-colors"
              >
                {/* Statut */}
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    post.published ? 'bg-emerald-500' : 'bg-muted/40'
                  }`}
                />

                {/* Titre */}
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-ink truncate">{post.title}</p>
                  <p className="text-xs font-mono text-muted mt-0.5">
                    {formatDate(post.created_at)} —{' '}
                    {post.published ? 'Publié' : 'Brouillon'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    Voir
                  </Link>
                  <Link
                    href={`/admin/editer/${post.id}`}
                    className="text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => togglePublished(post)}
                    className="text-xs font-mono text-muted hover:text-ink transition-colors"
                  >
                    {post.published ? 'Dépublier' : 'Publier'}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs font-mono text-red-400 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section commentaires en attente */}
      <section>
        <h2 className="font-serif text-2xl text-ink mb-6">
          Commentaires en attente
          {pendingComments.length > 0 && (
            <span className="ml-3 text-sm font-mono text-muted">
              ({pendingComments.length})
            </span>
          )}
        </h2>

        {loadingComments ? (
          <p className="text-sm text-muted font-mono">Chargement...</p>
        ) : pendingComments.length === 0 ? (
          <p className="text-sm text-muted font-serif italic">
            Aucun commentaire en attente.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingComments.map((comment) => (
              <div
                key={comment.id}
                className="border border-faint rounded p-5 bg-paper"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="font-serif text-ink text-sm">
                      {comment.author_name}
                    </span>
                    {comment.posts && (
                      <span className="text-xs font-mono text-muted ml-3">
                        sur «{' '}
                        <Link
                          href={`/blog/${comment.posts.slug}`}
                          target="_blank"
                          className="hover:text-ink transition-colors"
                        >
                          {comment.posts.title}
                        </Link>{' '}
                        »
                      </span>
                    )}
                    <p className="text-xs font-mono text-muted/60 mt-0.5">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => approveComment(comment.id)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-mono rounded hover:bg-emerald-100 transition-colors border border-emerald-200"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => rejectComment(comment.id)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-mono rounded hover:bg-red-100 transition-colors border border-red-200"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>

                <p className="text-sm text-ink/80 leading-relaxed border-l-2 border-faint pl-4">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
