import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Variable Font Displayer',
  description: 'A tool to display and manipulate variable fonts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Use external URLs for the favicon and related assets */}
        <link rel="icon" href="https://freight.cargo.site/t/original/i/C1867687699294924053846570210642/logo_rev3x.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://freight.cargo.site/t/original/i/C1867687699294924053846570210642/logo_rev3x.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="https://freight.cargo.site/t/original/i/C1867687699294924053846570210642/logo_rev3x.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://freight.cargo.site/t/original/i/C1867687699294924053846570210642/logo_rev3x.png" />
        <link rel="manifest" href="https://freight.cargo.site/t/original/i/C1867687699294924053846570210642/logo_rev3x.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
