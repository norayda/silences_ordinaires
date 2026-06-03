'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const NAV = [
  { href: '/', label: 'Journal' },
  { href: '/categories', label: 'Catégories' },
  { href: '/appartements', label: 'Appartements' },
  { href: '/a-propos', label: 'À propos' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Fermer le menu sur changement de page
  useEffect(() => { setOpen(false) }, [pathname])

  // Bloquer le scroll body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="border-b border-faint bg-paper sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <span className="font-serif text-xl text-ink tracking-tight group-hover:text-accent transition-colors duration-300">
              Silences Ordinaires
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-xs font-mono tracking-widest uppercase transition-colors ${
                  pathname === href ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Burger mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span
              className={`block w-5 h-px bg-ink transition-all duration-300 origin-center ${
                open ? 'rotate-45 translate-y-[4px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink transition-all duration-300 ${
                open ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-ink transition-all duration-300 origin-center ${
                open ? '-rotate-45 -translate-y-[8px]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Menu mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-paper flex flex-col pt-20 px-8 transition-all duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-0 divide-y divide-faint">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-5 font-serif text-2xl transition-colors ${
                pathname === href ? 'text-accent' : 'text-ink hover:text-accent'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="mt-auto mb-10 text-xs font-mono text-muted">
          2 rue Théophile Obenga
        </p>
      </div>
    </>
  )
}
