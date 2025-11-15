export const metadata = {
  title: 'Amazon Ads Optimizer',
  description: 'Automatische Kampagnen-Optimierung',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
