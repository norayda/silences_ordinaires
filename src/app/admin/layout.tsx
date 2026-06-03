'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

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
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-ink text-lg tracking-tight">
              Administration
            </Link>
            <Link
              href="/admin/nouveau"
              className="text-xs font-mono text-muted hover:text-ink transition-colors"
            >
              + Nouvel article
            </Link>
            <Link
              href="/admin/a-propos"
              className={`text-xs font-mono transition-colors ${
                pathname === '/admin/a-propos'
                  ? 'text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              À propos
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-mono text-muted hover:text-ink transition-colors"
            >
              Voir le site →
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-muted hover:text-ink transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
