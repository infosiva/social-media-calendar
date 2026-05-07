import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import SharedFooter from '@/components/SharedFooter'
import type { BrandConfig } from '@/components/SharedNavbar'

const brand: BrandConfig = {
  name: 'SocialAI',
  tagline: 'Generate weeks of social media content in seconds with AI.',
  icon: '📅',
  color: '#ec4899',
  url: 'https://social-media-calendar.vercel.app',
  navLinks: [{ label: 'Generate content', href: '/' }],
  cta: { label: 'Create calendar →', href: '/' },
}

export const metadata: Metadata = {
  title: 'SocialAI — AI Social Media Content Calendar',
  description: 'Generate weeks of social media posts, captions and hashtags in seconds. AI content calendar for creators and brands.',
  keywords: ['social media calendar', 'AI content', 'content calendar', 'social media posts', 'Instagram captions'],
  openGraph: { title: 'SocialAI — AI Content Calendar', description: 'Weeks of social media content in seconds.', type: 'website', locale: 'en_GB', siteName: 'SocialAI' },
  twitter: { card: 'summary_large_image', title: 'SocialAI', description: 'AI social media content calendar.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "SoftwareApplication",
          "name": "SocialAI", "url": brand.url, "description": brand.tagline,
          "applicationCategory": "BusinessApplication", "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
        })}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <SharedFooter brand={brand} />
        <script src="http://31.97.56.148:3098/t.js" data-site="social-media-calendar.vercel.app" defer></script>
      </body>
    </html>
  )
}
