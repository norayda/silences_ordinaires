'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import { createClient } from '@/lib/supabase/client'
import { useRef, useEffect } from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm transition-colors ${
        active
          ? 'bg-ink text-paper'
          : 'text-muted hover:text-ink hover:bg-faint'
      }`}
    >
      {children}
    </button>
  )
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const supabase = createClient()
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        HTMLAttributes: { class: 'max-w-full rounded' },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content && editor.isEmpty) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `content-${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('covers')
      .upload(fileName, file, { upsert: true })

    if (error) {
      console.error('Erreur upload image:', error)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('covers').getPublicUrl(data.path)

    editor.chain().focus().setImage({ src: publicUrl }).run()

    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  if (!editor) return null

  return (
    <div className="border border-faint rounded-lg overflow-hidden bg-paper">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-faint bg-faint/40">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Gras"
        >
          <strong>G</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italique"
        >
          <em>I</em>
        </ToolbarButton>

        <div className="w-px h-5 bg-faint mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive('heading', { level: 2 })}
          title="Titre H2"
        >
          <span className="font-mono text-xs">H2</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive('heading', { level: 3 })}
          title="Titre H3"
        >
          <span className="font-mono text-xs">H3</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-faint mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Citation"
        >
          <span className="font-serif text-base leading-none">"</span>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Séparateur"
        >
          <span className="font-mono text-xs">——</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-faint mx-1" />

        <ToolbarButton
          onClick={() => imageInputRef.current?.click()}
          title="Insérer une image"
        >
          <span className="font-mono text-xs">Image</span>
        </ToolbarButton>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Zone de texte */}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  )
}
