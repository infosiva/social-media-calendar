import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import SharedNavbar from '@/components/SharedNavbar'
import Footer from '../../components/Footer'
import DesignEffects from '@/components/DesignEffects'
import AnimatedBackground from '@/components/AnimatedBackground'
import ChatBot from '@/components/ChatBot'
import type { BrandConfig } from '@/components/SharedNavbar'
import CookieConsent from "../../components/CookieConsent"
import StickyFooterCTA from "../../components/StickyFooterCTA"
import { siteConfig } from '@/site.config'

const brand: BrandConfig = {
  name: siteConfig.name,
  tagline: siteConfig.description,
  icon: siteConfig.icon,
  color: siteConfig.accentColor,
  url: siteConfig.url,
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Calendar', href: '/#generator' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'About', href: '/about' },
  ],
  cta: { label: 'Generate free →', href: '/#generator' },
}

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  keywords: ['social media calendar', 'AI content calendar', 'AI social media', 'content scheduler', 'Instagram captions', 'LinkedIn posts', 'TikTok content'],
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [{ url: `${siteConfig.url}/og.png`, width: 1200, height: 630, alt: `${siteConfig.name} — AI Social Media Calendar` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteConfig.url },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "description": siteConfig.description,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "What is DraftCal?", "acceptedAnswer": { "@type": "Answer", "text": "DraftCal is an AI-powered social media content calendar. Enter your brand or topic, select platforms, and AI generates a full month of posts with hooks, hashtags, and engagement tips." } },
    { "@type": "Question", "name": "Is DraftCal free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. DraftCal is free to use with 3 calendar generations per day. Pro plan ($10/mo) removes all limits." } },
    { "@type": "Question", "name": "Which platforms does DraftCal support?", "acceptedAnswer": { "@type": "Answer", "text": "DraftCal supports Twitter/X, LinkedIn, Instagram, TikTok, and Facebook — with platform-specific optimisation for each." } },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}} />
      </head>
      <body className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <DesignEffects />
        <SharedNavbar brand={brand} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer siteName={siteConfig.name} />
        <ChatBot />
        <CookieConsent />
        <StickyFooterCTA />
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script src="http://31.97.56.148:3098/t.js" data-site="draftcal.app" defer></script>
        <Script async src="http://31.97.56.148:3100/script.js" data-website-id="4d705d06-cb56-450e-ad4a-249bb6cd138b" strategy="afterInteractive" />
      </body>
    </html>
  )
}
