import type { Metadata, Viewport } from 'next'
import { clashGrotesk } from './fonts'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: {
    default: 'Park Safe',
    template: '%s | Park Safe',
  },
  description: 'Your mobile-first parking solution',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Park Safe',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${clashGrotesk.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
