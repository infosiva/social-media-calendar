import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import AnimatedBackground from '@/components/AnimatedBackground'
import ChatBot from '@/components/ChatBot'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../../components/CookieConsent";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Calistoga&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --theme-primary: #e11d48;
            --theme-secondary: #fb7185;
            --theme-base: #0f0308;
            --background: #0f0308;
            --surface-1: #1a0510;
            --surface-2: #260818;
            --foreground: #fff1f2;
            --text-2: #fda4af;
            --border-default: rgba(225,29,72,0.15);
            --border-strong: rgba(225,29,72,0.3);
            --radius: 0.75rem;
            --radius-lg: 1.25rem;
            --radius-xl: 2rem;
          }
          body { font-family: 'Inter', system-ui, sans-serif !important; }
          h1, h2, h3, .display { font-family: 'Calistoga', serif !important; letter-spacing: -0.02em; }
          .glass {
            background: rgba(15,3,8,0.65) !important;
            border-color: rgba(225,29,72,0.12) !important;
          }
          /* Platform tag accent colours */
          .platform-twitter  { color: #38bdf8; background: rgba(56,189,248,0.08); border-color: rgba(56,189,248,0.2); }
          .platform-linkedin { color: #818cf8; background: rgba(129,140,248,0.08); border-color: rgba(129,140,248,0.2); }
          .platform-instagram{ color: #f472b6; background: rgba(244,114,182,0.08); border-color: rgba(244,114,182,0.2); }
        `}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer siteName="DraftCal" />
        <ChatBot />
      <CookieConsent />
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script src="http://31.97.56.148:3098/t.js" data-site="draftcal.app" defer></script>
            <Script async src="http://31.97.56.148:3100/script.js" data-website-id="4d705d06-cb56-450e-ad4a-249bb6cd138b" strategy="afterInteractive" />
      </body>
    </html>
  )
}
