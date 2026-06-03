// Passez NEXT_PUBLIC_BOOK_PUBLISHED=true dans .env.local pour activer la porte
export const BOOK_PUBLISHED =
  process.env.NEXT_PUBLIC_BOOK_PUBLISHED === 'true'

// Catégories pour lesquelles le lien 3114 s'affiche en bas d'article
export const MENTAL_HEALTH_CATEGORIES = ['Appartements']
