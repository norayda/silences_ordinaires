'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (isLoginPage) return <>{children}</>

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-faint bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin" className="font-serif text-ink text-base sm:text-lg tracking-tight flex-shrink-0">
            Administration
          </Link>

          {/* Nav desktop */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <Link href="/admin/nouveau"
              className="text-xs font-mono text-muted hover:text-ink transition-colors whitespace-nowrap">
              + Nouvel article
            </Link>
            <Link href="/admin/a-propos"
              className={`text-xs font-mono transition-colors whitespace-nowrap ${pathname === '/admin/a-propos' ? 'text-ink' : 'text-muted hover:text-ink'}`}>
              À propos
            </Link>
            <Link href="/" target="_blank"
              className="text-xs font-mono text-muted hover:text-ink transition-colors whitespace-nowrap">
              Voir le site →
            </Link>
            <button onClick={handleLogout}
              className="text-xs font-mono text-muted hover:text-ink transition-colors whitespace-nowrap">
              Déconnexion
            </button>
          </div>

          {/* Burger mobile */}
          <button
            className="sm:hidden p-2 text-muted hover:text-ink transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div className="sm:hidden border-t border-faint bg-paper px-4 py-3 flex flex-col gap-4">
            <Link href="/admin/nouveau" onClick={() => setMenuOpen(false)}
              className="text-sm font-mono text-muted hover:text-ink transition-colors">
              + Nouvel article
            </Link>
            <Link href="/admin/a-propos" onClick={() => setMenuOpen(false)}
              className="text-sm font-mono text-muted hover:text-ink transition-colors">
              À propos
            </Link>
            <Link href="/" target="_blank" onClick={() => setMenuOpen(false)}
              className="text-sm font-mono text-muted hover:text-ink transition-colors">
              Voir le site →
            </Link>
            <button onClick={() => { setMenuOpen(false); handleLogout() }}
              className="text-sm font-mono text-muted hover:text-ink transition-colors text-left">
              Déconnexion
            </button>
          </div>
        )}
      </nav>
      <main>{children}</main>
    </div>
  )
}
