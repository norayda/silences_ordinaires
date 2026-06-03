import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({
      status: 'ERREUR',
      problème: 'Variables .env.local manquantes',
      NEXT_PUBLIC_SUPABASE_URL: url ? '✓ présente' : '✗ MANQUANTE',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? '✓ présente' : '✗ MANQUANTE',
    })
  }

  try {
    const supabase = createClient()

    const { data, error, count } = await supabase
      .from('posts')
      .select('id, title, published', { count: 'exact' })
      .limit(5)

    if (error) {
      return NextResponse.json({
        status: 'ERREUR SUPABASE',
        message: error.message,
        code: error.code,
        hint: error.hint,
        url: url.slice(0, 40) + '...',
        clé: key.slice(0, 20) + '...',
      })
    }

    return NextResponse.json({
      status: 'OK',
      url: url.slice(0, 40) + '...',
      clé_format: key.startsWith('eyJ') ? 'JWT (ancien format)' : key.startsWith('sb_') ? 'Publishable (nouveau format)' : 'Inconnu',
      total_posts: count,
      posts_trouvés: data,
    })
  } catch (err) {
    return NextResponse.json({
      status: 'EXCEPTION',
      message: err instanceof Error ? err.message : String(err),
    })
  }
}
