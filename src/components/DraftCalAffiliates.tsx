'use client';

/**
 * Contextual affiliate component for DraftCal.
 * Promotes scheduling + design tools that complement content creation.
 * Replace AFFILIATE_LINKS with your actual tracking URLs.
 */

const AFFILIATE_LINKS = [
  {
    name: 'Buffer',
    tagline: 'Schedule these posts automatically across all platforms',
    cta: 'Try Buffer Free →',
    url: 'https://buffer.com/?affiliate=siva', // TODO: replace with real affiliate link
    color: '#2d5be3',
    icon: '📅',
  },
  {
    name: 'Canva',
    tagline: 'Create scroll-stopping visuals for your posts',
    cta: 'Design Free →',
    url: 'https://canva.com/?affiliate=siva', // TODO: replace with real affiliate link
    color: '#7c3aed',
    icon: '🎨',
  },
  {
    name: 'Later',
    tagline: 'Visual Instagram scheduler + analytics',
    cta: 'Start Free →',
    url: 'https://later.com/?affiliate=siva', // TODO: replace with real affiliate link
    color: '#e91e63',
    icon: '📸',
  },
];

export default function DraftCalAffiliates() {
  return (
    <section className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-gray-400">
        Level up your content
      </h3>
      <p className="mb-5 text-xs text-gray-500">
        Tools that pair perfectly with your content calendar
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {AFFILIATE_LINKS.map((a) => (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener sponsored"
            className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10"
          >
            <div className="mb-2 text-xl">{a.icon}</div>
            <div className="mb-1 text-sm font-semibold text-white group-hover:text-white/90">
              {a.name}
            </div>
            <div className="mb-3 text-xs text-gray-400">{a.tagline}</div>
            <div
              className="mt-auto inline-block rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: a.color }}
            >
              {a.cta}
            </div>
          </a>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-gray-500">
        Sponsored · We may earn a commission at no cost to you
      </p>
    </section>
  );
}
