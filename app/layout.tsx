import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// Optimize font loading with display swap for better performance
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

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
    <html lang="fr" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Power Automate */}
        {process.env.POWER_AUTOMATE_QUESTIONS_URL && (
          <link rel="dns-prefetch" href={new URL(process.env.POWER_AUTOMATE_QUESTIONS_URL).origin} />
        )}
        {process.env.POWER_AUTOMATE_SUBMIT_URL && (
          <link rel="dns-prefetch" href={new URL(process.env.POWER_AUTOMATE_SUBMIT_URL).origin} />
        )}
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
