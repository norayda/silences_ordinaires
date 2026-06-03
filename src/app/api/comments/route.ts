import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const post_id = typeof body.post_id === 'string' ? body.post_id.trim() : ''
    const author_name =
      typeof body.author_name === 'string' ? body.author_name.trim() : ''
    const content =
      typeof body.content === 'string' ? body.content.trim() : ''

    if (!post_id || !author_name || !content) {
      return NextResponse.json(
        { error: 'post_id, author_name et content sont requis.' },
        { status: 400 }
      )
    }

    if (author_name.length > 100) {
      return NextResponse.json({ error: 'Prénom trop long.' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Commentaire trop long (max 2000 caractères).' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Vérifier que l'article existe et est publié
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .eq('published', true)
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Article introuvable.' },
        { status: 404 }
      )
    }

    const { error } = await supabase.from('comments').insert({
      post_id,
      author_name,
      content,
      approved: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Comments API error:', err)
    return NextResponse.json(
      { error: 'Une erreur est survenue.' },
      { status: 500 }
    )
  }
}
