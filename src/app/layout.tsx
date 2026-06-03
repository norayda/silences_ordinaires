import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Silences Ordinaires',
    template: '%s — Silences Ordinaires',
  },
  description:
    'Un blog littéraire sur les solitudes invisibles. Résidence Massamba-Débat, 2 rue Théophile Obenga.',
  openGraph: {
    title: 'Silences Ordinaires',
    description: 'Un blog littéraire sur les solitudes invisibles.',
    url: 'https://silencesordinaires.fr',
    siteName: 'Silences Ordinaires',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Silences Ordinaires',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    title: 'Silences Ordinaires',
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
