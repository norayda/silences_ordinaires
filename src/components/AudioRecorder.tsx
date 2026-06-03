'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type RecorderState = 'idle' | 'requesting' | 'recording' | 'recorded' | 'uploading'

interface AudioRecorderProps {
  existingAudioUrl?: string | null
  onSave: (url: string | null) => void
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function AudioRecorder({ existingAudioUrl, onSave }: AudioRecorderProps) {
  const supabase = createClient()

  const [state, setState] = useState<RecorderState>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [savedUrl, setSavedUrl] = useState<string | null>(existingAudioUrl ?? null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const blobRef = useRef<Blob | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Import fichier ────────────────────────────────────────
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    blobRef.current = file
    setPreviewUrl(URL.createObjectURL(file))
    setState('recorded')
    setError(null)
  }

  // ── Enregistrement micro ──────────────────────────────────
  const startRecording = async () => {
    setError(null)
    setState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        blobRef.current = blob
        setPreviewUrl(URL.createObjectURL(blob))
        setState('recorded')
        stream.getTracks().forEach((t) => t.stop())
        if (timerRef.current) clearInterval(timerRef.current)
      }

      recorder.start(250)
      setState('recording')
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000)
    } catch {
      setError("Impossible d'accéder au microphone. Vérifiez les permissions de votre navigateur.")
      setState('idle')
    }
  }

  const stopRecording = () => mediaRecorderRef.current?.stop()

  // ── Upload ────────────────────────────────────────────────
  const uploadAudio = async () => {
    if (!blobRef.current) return
    setState('uploading')

    const blob = blobRef.current
    const isFile = blob instanceof File
    const ext = isFile
      ? (blob as File).name.split('.').pop() ?? 'mp3'
      : blob.type.includes('webm')
      ? 'webm'
      : 'mp4'

    const fileName = `lecture-${Date.now()}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, blob, { upsert: true, contentType: blob.type || 'audio/mpeg' })

    if (uploadError) {
      setError("Erreur lors de l'upload. Réessayez.")
      setState('recorded')
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(data.path)

    setSavedUrl(publicUrl)
    setPreviewUrl(null)
    blobRef.current = null
    onSave(publicUrl)
    setState('idle')
  }

  const resetRecording = () => {
    setPreviewUrl(null)
    blobRef.current = null
    setState('idle')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAudio = () => {
    setSavedUrl(null)
    onSave(null)
  }

  return (
    <div className="border border-faint rounded-lg p-5">
      <div className="mb-4">
        <p className="text-xs font-mono text-muted tracking-widest uppercase mb-1">
          Lecture audio
        </p>
        <p className="text-sm text-muted">
          Enregistrez votre voix ou importez un fichier — les lecteurs pourront l'écouter en haut du post.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {/* Audio existant enregistré */}
      {savedUrl && state === 'idle' && (
        <div className="space-y-3">
          <div className="p-3 bg-faint/40 rounded border border-faint">
            <p className="text-xs font-mono text-muted mb-2">Enregistrement actuel</p>
            <audio src={savedUrl} controls className="w-full" style={{ height: 36 }} />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick={startRecording}
              className="text-xs font-mono text-muted hover:text-ink transition-colors">
              Réenregistrer
            </button>
            <label className="cursor-pointer text-xs font-mono text-muted hover:text-ink transition-colors">
              Importer un autre fichier
              <input ref={fileInputRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
                onChange={handleFileImport} className="hidden" />
            </label>
            <button type="button" onClick={removeAudio}
              className="text-xs font-mono text-red-400 hover:text-red-600 transition-colors">
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Aucun audio — choix enregistrer ou importer */}
      {!savedUrl && state === 'idle' && (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={startRecording}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-faint border border-faint rounded text-xs font-mono text-muted hover:border-muted hover:text-ink transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            Enregistrer
          </button>

          <span className="text-xs font-mono text-muted/40">ou</span>

          <label className="cursor-pointer flex items-center gap-2.5 px-4 py-2.5 bg-faint border border-faint rounded text-xs font-mono text-muted hover:border-muted hover:text-ink transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Importer un fichier audio
            <input ref={fileInputRef} type="file" accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm"
              onChange={handleFileImport} className="hidden" />
          </label>
          <span className="text-xs font-mono text-muted/50">MP3, WAV, M4A, OGG…</span>
        </div>
      )}

      {/* Demande de permission micro */}
      {state === 'requesting' && (
        <p className="text-xs font-mono text-muted animate-pulse">Accès au microphone...</p>
      )}

      {/* En cours d'enregistrement */}
      {state === 'recording' && (
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs font-mono text-red-500">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            {formatDuration(recordingTime)}
          </span>
          <button type="button" onClick={stopRecording}
            className="px-4 py-2 bg-ink text-paper text-xs font-mono rounded hover:bg-ink/80 transition-colors">
            Arrêter
          </button>
        </div>
      )}

      {/* Preview (après enregistrement ou import) */}
      {state === 'recorded' && previewUrl && (
        <div className="space-y-4">
          <div className="p-3 bg-faint/40 rounded border border-faint">
            <p className="text-xs font-mono text-muted mb-2">Aperçu</p>
            <audio src={previewUrl} controls className="w-full" style={{ height: 36 }} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={uploadAudio}
              className="px-4 py-2.5 bg-ink text-paper text-xs font-mono rounded hover:bg-ink/80 transition-colors">
              Utiliser cet audio
            </button>
            <button type="button" onClick={resetRecording}
              className="px-4 py-2.5 text-xs font-mono text-muted border border-faint rounded hover:border-muted transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Upload en cours */}
      {state === 'uploading' && (
        <p className="text-xs font-mono text-muted animate-pulse">Upload en cours...</p>
      )}
    </div>
  )
}
