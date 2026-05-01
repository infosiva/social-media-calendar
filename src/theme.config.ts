/**
 * theme.config.ts — swap to restyle SocialScribe
 * 2026 Design: Neon Creator Studio — dark, vivid gradients, platform-native colours
 */

export const theme = {
  name:    'SocialScribe',
  tagline: '30 days of content, written in seconds.',
  sub:     'AI builds your full content calendar — platform-optimised posts, hashtags & engagement tips',

  style: 'neon' as const,

  bg:          '#0a0a0f',
  bgCard:      'rgba(255,255,255,0.025)',
  bgCardHover: 'rgba(255,255,255,0.05)',
  border:      'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.14)',

  accent1:    '#ec4899',           // hot pink — creator energy
  accent2:    '#a855f7',           // purple
  accent3:    '#f59e0b',           // amber
  accentText: '#f9a8d4',
  accentGlow: 'rgba(236,72,153,0.18)',

  blobs: [
    { x: '60%',  y: '-15%', w: '700px', h: '600px', color: 'rgba(139,92,246,0.18)', blur: '150px' },
    { x: '-5%',  y: '40%',  w: '450px', h: '450px', color: 'rgba(236,72,153,0.12)', blur: '120px' },
    { x: '40%',  y: '70%',  w: '350px', h: '350px', color: 'rgba(245,158,11,0.08)', blur: '100px' },
  ],

  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",

  badges: [
    '✓ 5 platforms',
    '✓ Up to 4 weeks',
    '✓ Trending hashtags',
    '✓ Engagement tips',
    '✓ Best post times',
    '✓ 1-click copy',
  ],

  platforms: [
    { name: 'Twitter/X',  color: 'from-sky-500 to-sky-600',       icon: '𝕏' },
    { name: 'LinkedIn',   color: 'from-blue-600 to-blue-700',      icon: 'in' },
    { name: 'Instagram',  color: 'from-pink-500 to-purple-600',    icon: '◉' },
    { name: 'TikTok',     color: 'from-red-500 to-pink-600',       icon: '♪' },
    { name: 'Facebook',   color: 'from-indigo-500 to-indigo-600',  icon: 'f' },
  ],

  pricing: [
    {
      name: 'Free', price: '$0', sub: 'forever', highlight: false,
      features: ['3 calendars / day', '5 platforms', 'Up to 4 weeks', 'Hashtags + tips', 'Filter + copy', '1-click export'],
      cta: 'Start free',
    },
    {
      name: 'Pro', price: '$9', sub: '/month', highlight: true,
      features: ['Unlimited calendars', 'Schedule to socials', 'Brand voice memory', 'Analytics preview', 'Bulk CSV export', 'Priority AI speed'],
      cta: 'Go Pro ✦',
    },
  ],

  metaTitle:       'SocialScribe — AI Social Media Content Calendar',
  metaDescription: 'Describe your brand, get a full month of social posts — platform-optimised, with hashtags and engagement tips. Free to start.',
}

export type Theme = typeof theme
export default theme
