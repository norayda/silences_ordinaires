// Passez NEXT_PUBLIC_BOOK_PUBLISHED=true dans .env.local pour activer la porte
export const BOOK_PUBLISHED =
  process.env.NEXT_PUBLIC_BOOK_PUBLISHED === 'true'

// URL de la photo de l'auteure (upload dans Supabase Storage ou URL externe)
export const AUTHOR_IMAGE_URL =
  process.env.NEXT_PUBLIC_AUTHOR_IMAGE_URL ?? ''
