import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amazon Ads Optimizer',
  description: 'Automatische Kampagnen-Optimierung für Amazon Advertising',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}
