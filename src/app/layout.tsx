import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import DesignEffects from '@/components/DesignEffects'
import AnimatedBackground from '@/components/AnimatedBackground'
import ChatBot from '@/components/ChatBot'
import type { BrandConfig } from '@/components/SharedNavbar'

const brand: BrandConfig = {
  name: 'DraftCal',
  tagline: 'Generate weeks of social media content in seconds with AI.',
  icon: '📅',
  color: '#ec4899',
  url: 'https://draftcal.app',
  navLinks: [{ label: 'Generate content', href: '/' }],
  cta: { label: 'Create calendar →', href: '/' },
}

export const metadata: Metadata = {
  title: 'DraftCal — AI Social Media Content Calendar',
  description: 'Generate weeks of social media posts, captions and hashtags in seconds. AI content calendar for creators and brands.',
  keywords: ['social media calendar', 'AI content', 'content calendar', 'social media posts', 'Instagram captions'],
  openGraph: { title: 'DraftCal — AI Content Calendar', description: 'Weeks of social media content in seconds.', type: 'website', locale: 'en_GB', siteName: 'DraftCal' },
  twitter: { card: 'summary_large_image', title: 'DraftCal', description: 'AI social media content calendar.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareApplication",
          "name": "DraftCal", "url": brand.url, "description": brand.tagline,
          "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
        })}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <ChatBot />
      </body>
    </html>
  )
}
