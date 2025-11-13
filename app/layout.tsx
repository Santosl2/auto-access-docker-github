import type { Metadata, Viewport } from 'next'
import { Geist, } from 'next/font/google'
import type React from 'react'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GitHub Access Request',
  description:
    'Request access to private repository, Docker image and get credentials',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>{children}</body>
    </html>
  )
}
