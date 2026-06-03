'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TiptapEditor from '@/components/TiptapEditor'
import AudioRecorder from '@/components/AudioRecorder'
import { generateSlug } from '@/lib/utils'
import Image from 'next/image'

export default function NouvelArticle() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null
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
      const slug = generateSlug(title)

      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim() || null,
        category: category.trim() || null,
        content,
        cover_url,
        audio_url: audioUrl,
        published,
      })

      if (error) throw new Error(error.message)
      router.push('/admin')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl text-ink">Nouvel article</h1>
          <p className="text-xs font-mono text-muted mt-1">
            Résidence Massamba-Débat
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
            {saving ? 'Publication...' : 'Publier'}
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
            placeholder="Le titre de l'article..."
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
            placeholder="Bref résumé affiché sur la page d'accueil..."
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
                Choisir une image
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
                />
              </div>
            )}
          </div>
          <p className="text-xs font-mono text-muted/60 mt-2">
            Formats acceptés : JPG, PNG, WebP. Recommandé : 1600×900px minimum.
          </p>
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Contenu
          </label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Audio */}
        <AudioRecorder
          existingAudioUrl={audioUrl}
          onSave={(url) => setAudioUrl(url)}
        />

        {/* Boutons bas de page */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-faint">
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2.5 text-xs font-mono text-muted hover:text-ink transition-colors"
          >
            Annuler
          </button>
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
            {saving ? 'Publication...' : 'Publier'}
          </button>
        </div>
      </div>
    </div>
  )
}
