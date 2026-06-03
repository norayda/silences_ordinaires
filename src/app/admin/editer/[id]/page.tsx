'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TiptapEditor from '@/components/TiptapEditor'
import Image from 'next/image'
import type { Post } from '@/types'

export default function EditerArticle() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      setError('Article introuvable.')
    } else {
      setPost(data)
      setTitle(data.title)
      setExcerpt(data.excerpt ?? '')
      setCategory(data.category ?? '')
      setContent(data.content)
      setCoverPreview(data.cover_url)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return post?.cover_url ?? null
    const ext = coverFile.name.split('.').pop() ?? 'jpg'
    const fileName = `cover-${Date.now()}.${ext}`
    const { data, error } = await supabase.storage
      .from('covers')
      .upload(fileName, coverFile, { upsert: true })
    if (error) throw new Error(`Erreur upload : ${error.message}`)
    const {
      data: { publicUrl },
    } = supabase.storage.from('covers').getPublicUrl(data.path)
    return publicUrl
  }

  const save = async (published: boolean) => {
    if (!title.trim()) {
      setError('Le titre est requis.')
      return
    }
    setSaving(true)
    setError(null)

    try {
      const cover_url = await uploadCover()

      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          excerpt: excerpt.trim() || null,
          category: category.trim() || null,
          content,
          cover_url,
          published,
        })
        .eq('id', id)

      if (error) throw new Error(error.message)
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-sm text-muted">Chargement de l'article...</p>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-serif text-xl text-muted mb-4">{error}</p>
        <button
          onClick={() => router.push('/admin')}
          className="text-xs font-mono text-muted hover:text-ink transition-colors"
        >
          ← Retour au dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl text-ink">Modifier l'article</h1>
          <p className="text-xs font-mono text-muted mt-1">
            {post?.published ? '● Publié' : '○ Brouillon'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="px-4 py-2.5 text-xs font-mono text-muted border border-faint rounded hover:border-muted disabled:opacity-50 transition-colors"
          >
            Enregistrer brouillon
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="px-4 py-2.5 text-xs font-mono bg-ink text-paper rounded hover:bg-ink/80 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Enregistrement...' : 'Publier'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Titre */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-faint/30 border border-faint rounded font-serif text-2xl text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Extrait */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Extrait
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            maxLength={400}
            className="w-full px-4 py-3 bg-faint/30 border border-faint rounded text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none"
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Catégorie
          </label>
          <input
            type="text"
            list="categories-list"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-faint/30 border border-faint rounded text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
            placeholder="Chroniques, Réflexions, Solitudes..."
          />
          <datalist id="categories-list">
            <option value="Chroniques" />
            <option value="Réflexions" />
            <option value="Solitudes" />
            <option value="Résidence" />
          </datalist>
        </div>

        {/* Image de couverture */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Image de couverture
          </label>
          <div className="flex items-start gap-5">
            <label className="cursor-pointer">
              <div className="px-4 py-2.5 bg-faint border border-faint rounded text-xs font-mono text-muted hover:border-muted hover:text-ink transition-colors">
                {coverPreview ? "Changer l'image" : 'Choisir une image'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
            {coverPreview && (
              <div className="relative w-36 h-24 rounded overflow-hidden">
                <Image
                  src={coverPreview}
                  alt="Aperçu couverture"
                  fill
                  className="object-cover grayscale"
                  unoptimized={coverPreview.startsWith('blob:')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Contenu
          </label>
          {content !== '' || !loading ? (
            <TiptapEditor content={content} onChange={setContent} />
          ) : null}
        </div>

        {/* Boutons bas */}
        <div className="flex items-center justify-between pt-4 border-t border-faint">
          <button
            onClick={() => router.push('/admin')}
            className="text-xs font-mono text-muted hover:text-ink transition-colors"
          >
            ← Retour
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="px-4 py-2.5 text-xs font-mono text-muted border border-faint rounded hover:border-muted disabled:opacity-50 transition-colors"
            >
              Enregistrer brouillon
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="px-4 py-2.5 text-xs font-mono bg-ink text-paper rounded hover:bg-ink/80 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Enregistrement...' : 'Publier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
