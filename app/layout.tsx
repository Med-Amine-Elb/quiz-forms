import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'SBM Enquête de satisfaction 2024',
  description: 'Votre avis compte pour 2025 - Enquête de satisfaction IT',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        {/* DNS prefetch for Power Automate */}
        {process.env.POWER_AUTOMATE_QUESTIONS_URL && (
          <link rel="dns-prefetch" href={new URL(process.env.POWER_AUTOMATE_QUESTIONS_URL).origin} />
        )}
        {process.env.POWER_AUTOMATE_SUBMIT_URL && (
          <link rel="dns-prefetch" href={new URL(process.env.POWER_AUTOMATE_SUBMIT_URL).origin} />
        )}
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
