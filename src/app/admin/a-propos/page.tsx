'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function AdminAPropos() {
  const supabase = createClient()

  const [authorName, setAuthorName] = useState('')
  const [authorBio, setAuthorBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('settings')
      .select('key, value')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const row of data ?? []) map[row.key] = row.value
        setAuthorName(map.author_name ?? '')
        setAuthorBio(map.author_bio ?? '')
        setImageUrl(map.author_image_url ?? '')
        setImagePreview(map.author_image_url ?? '')
        setLoading(false)
      })
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const save = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      let finalImageUrl = imageUrl

      if (imageFile) {
        const ext = imageFile.name.split('.').pop() ?? 'jpg'
        const { data, error: uploadError } = await supabase.storage
          .from('covers')
          .upload(`author.${ext}`, imageFile, { upsert: true })

        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('covers')
          .getPublicUrl(data.path)

        finalImageUrl = publicUrl
        setImageUrl(finalImageUrl)
      }

      const { error: upsertError } = await supabase.from('settings').upsert([
        { key: 'author_name', value: authorName },
        { key: 'author_bio', value: authorBio },
        { key: 'author_image_url', value: finalImageUrl },
      ])

      if (upsertError) throw new Error(upsertError.message)

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-sm text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-3xl text-ink">Page À propos</h1>
          <p className="text-xs font-mono text-muted mt-1">
            Présentation de l'auteure — visible sur /a-propos
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2.5 text-xs font-mono bg-ink text-paper rounded hover:bg-ink/80 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Enregistrement...' : saved ? '✓ Enregistré' : 'Enregistrer'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Photo */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Photo
          </label>
          <div className="flex items-start gap-5">
            <label className="cursor-pointer">
              <div className="px-4 py-2.5 bg-faint border border-faint rounded text-xs font-mono text-muted hover:border-muted hover:text-ink transition-colors">
                {imagePreview ? "Changer la photo" : 'Choisir une photo'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <div className="relative w-24 h-32 rounded overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Photo de l'auteure"
                  fill
                  className="object-cover grayscale"
                  unoptimized={imagePreview.startsWith('blob:')}
                />
              </div>
            )}
          </div>
          <p className="text-xs font-mono text-muted/60 mt-2">
            Format portrait recommandé. S'affiche en niveaux de gris sur le site.
          </p>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Nom
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-3 bg-faint/30 border border-faint rounded font-serif text-xl text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
            placeholder="Votre nom"
          />
        </div>

        {/* Biographie */}
        <div>
          <label className="block text-xs font-mono text-muted mb-2 tracking-wider uppercase">
            Biographie
          </label>
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 bg-faint/30 border border-faint rounded text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
            placeholder="Parlez de vous, de votre rapport à l'écriture, de ce qui vous a amené·e à créer ce blog..."
          />
          <p className="text-xs font-mono text-muted/60 mt-2">
            Vous pouvez sauter des lignes pour créer des paragraphes.
          </p>
        </div>
      </div>
    </div>
  )
}
