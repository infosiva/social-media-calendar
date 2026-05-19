import type { Metadata } from "next"
import { siteConfig } from "@/site.config"

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description: `About ${siteConfig.name} — ${siteConfig.seo.description}`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteConfig.url}/about` },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen text-white relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12" style={{ animation: 'fadeSlideUp 0.6s ease-out both' }}>
          <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: '#f472b6' }}>
            About {siteConfig.name}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Built for creators who want to{' '}
            <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ship content, not wrestle with it
            </span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed">
            {siteConfig.description}
          </p>
        </div>

        {/* Mission */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 mb-8" style={{ animation: 'fadeSlideUp 0.6s 0.1s ease-out both' }}>
          <h2 className="text-xl font-bold mb-3">Our mission</h2>
          <p className="text-white/55 leading-relaxed">
            Content creation should be about creativity, not scheduling drudgery. {siteConfig.name} uses AI to handle the heavy lifting — drafting posts, optimising for each platform, and suggesting the best times to publish — so you can focus on building your brand.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8" style={{ animation: 'fadeSlideUp 0.6s 0.2s ease-out both' }}>
          {[
            { value: siteConfig.stats.posts, label: 'Posts generated' },
            { value: siteConfig.stats.creators, label: 'Creators trust us' },
            { value: siteConfig.stats.platforms, label: 'Platforms supported' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5 text-center">
              <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-8" style={{ animation: 'fadeSlideUp 0.6s 0.3s ease-out both' }}>
          <h2 className="text-xl font-bold mb-5">How it works</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Describe your brand', desc: 'Tell DraftCal your niche, tone, and target audience in a sentence.' },
              { step: '2', title: 'Choose platforms & tone', desc: 'Select which platforms to optimise for — Twitter/X, LinkedIn, Instagram, TikTok, or Facebook.' },
              { step: '3', title: 'Generate your calendar', desc: 'AI writes 30 days of posts instantly — hooks, hashtags, engagement tips, and best post times included.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.015]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white' }}>
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 mb-8" style={{ animation: 'fadeSlideUp 0.6s 0.35s ease-out both' }}>
          <h2 className="text-xl font-bold mb-3">Get in touch</h2>
          <p className="text-white/55 leading-relaxed mb-2">
            Feedback, bug reports, or partnership enquiries are all welcome.
          </p>
          <a href="mailto:info.siva@gmail.com" className="text-pink-400 hover:text-pink-300 transition-colors text-sm">
            info.siva@gmail.com
          </a>
          {' '}<span className="text-white/30 text-sm">·</span>{' '}
          <a href="/contact" className="text-pink-400 hover:text-pink-300 transition-colors text-sm">Contact page</a>
        </div>

        {/* CTA */}
        <div className="text-center" style={{ animation: 'fadeSlideUp 0.6s 0.4s ease-out both' }}>
          <a href="/#generator"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: '0 0 40px rgba(236,72,153,0.3)' }}>
            Generate your calendar free →
          </a>
          <p className="text-white/25 text-xs mt-3">No account required · 3 free per day</p>
        </div>
      </div>
    </main>
  )
}
