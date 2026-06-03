export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_url: string | null
  category: string | null
  audio_url: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_name: string
  content: string
  approved: boolean
  created_at: string
}

export interface AppartementResult {
  appartement: string
  chapitre: string
  titre: string
  message: string
}
