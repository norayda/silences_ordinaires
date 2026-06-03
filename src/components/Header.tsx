import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-faint bg-paper sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="font-serif text-xl text-ink tracking-tight group-hover:text-accent transition-colors duration-300">
            Silences Ordinaires
          </span>
        </Link>

        <nav className="flex items-center gap-7">
          <Link
            href="/"
            className="text-xs font-mono text-muted hover:text-ink transition-colors tracking-widest uppercase"
          >
            Journal
          </Link>
          <Link
            href="/categories"
            className="text-xs font-mono text-muted hover:text-ink transition-colors tracking-widest uppercase"
          >
            Catégories
          </Link>
          <Link
            href="/appartements"
            className="text-xs font-mono text-muted hover:text-ink transition-colors tracking-widest uppercase"
          >
            Appartements
          </Link>
          <Link
            href="/a-propos"
            className="text-xs font-mono text-muted hover:text-ink transition-colors tracking-widest uppercase"
          >
            À propos
          </Link>
        </nav>
      </div>
    </header>
  )
}
