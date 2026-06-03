'use client'

import { useState } from 'react'

export default function CommentForm({ postId }: { postId: string }) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, author_name: name, content }),
      })

      if (!res.ok) throw new Error()
      setStatus('sent')
      setName('')
      setContent('')
    } catch {
      setStatus('error')
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="p-6 border border-faint rounded bg-faint/30 text-center">
        <p className="font-serif text-ink text-lg mb-1">Merci pour votre commentaire.</p>
        <p className="text-sm text-muted">
          Il sera visible après modération.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider uppercase">
          Votre prénom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="w-full px-4 py-2.5 bg-faint/40 border border-faint rounded text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors"
          placeholder="Marie, Kofi, Amara..."
        />
      </div>

      <div>
        <label className="block text-xs font-mono text-muted mb-1.5 tracking-wider uppercase">
          Votre commentaire
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={5}
          className="w-full px-4 py-2.5 bg-faint/40 border border-faint rounded text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-accent transition-colors resize-none"
          placeholder="Partagez votre ressenti..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-2.5 bg-ink text-paper text-xs font-mono tracking-wider uppercase rounded hover:bg-ink/80 disabled:opacity-50 transition-colors"
      >
        {status === 'sending' ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  )
}
