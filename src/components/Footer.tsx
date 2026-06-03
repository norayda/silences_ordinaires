import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-faint mt-24 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
        <p>
          © {new Date().getFullYear()} Silences Ordinaires —{' '}
          <span className="italic font-serif text-sm">
            Un roman sur les solitudes invisibles
          </span>
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-ink transition-colors">
            Accueil
          </Link>
          <Link href="/appartements" className="hover:text-ink transition-colors">
            Appartements
          </Link>
          <Link href="/a-propos" className="hover:text-ink transition-colors">
            À propos
          </Link>
        </nav>
      </div>
    </footer>
  )
}
