"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { NumberTicker } from '@/components/magicui/number-ticker'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

const DRAFTCAL_TOUR: TourStep[] = [
  { target: '#hero-generate-btn', title: 'Generate your calendar free', icon: '📅', body: 'Pick a topic and platforms — AI writes 30 days of posts in one click. No account needed.', placement: 'bottom' },
  { target: '#generator', title: 'Customise everything', icon: '✏️', body: 'Choose platforms, tone, and content type. Edit any post before publishing.', placement: 'top' },
  { target: '#pricing', title: 'Go unlimited', icon: '🚀', body: 'Pro removes daily limits — generate as many calendars as you need.', placement: 'top' },
]

const PLATFORMS = ["Twitter/X", "LinkedIn", "Instagram", "Facebook", "TikTok"];
const TONES = ["Professional", "Casual", "Humorous", "Inspirational", "Educational"];
const TYPE_LABELS: Record<string, string> = {
  tip: "💡 Tip", story: "📖 Story", question: "❓ Question",
  promo: "📣 Promo", bts: "🎬 Behind scenes", poll: "📊 Poll", carousel: "🖼️ Carousel",
};
const PLATFORM_COLORS: Record<string, string> = {
  "Twitter/X": "text-sky-300 border-sky-500/30 bg-sky-500/10",
  "LinkedIn": "text-blue-300 border-blue-500/30 bg-blue-500/10",
  "Instagram": "text-pink-300 border-pink-500/30 bg-pink-500/10",
  "Facebook": "text-indigo-300 border-indigo-500/30 bg-indigo-500/10",
  "TikTok": "text-fuchsia-300 border-fuchsia-500/30 bg-fuchsia-500/10",
};

const PLATFORM_BENCHMARKS: Record<string, { reach: [number, number]; engRate: [number, number]; icon: string }> = {
  "Twitter/X":  { reach: [200, 800],   engRate: [0.5, 2.5],  icon: "𝕏" },
  "LinkedIn":   { reach: [300, 1200],  engRate: [2.0, 5.0],  icon: "in" },
  "Instagram":  { reach: [400, 1800],  engRate: [1.5, 4.0],  icon: "◉" },
  "Facebook":   { reach: [150, 600],   engRate: [0.5, 2.0],  icon: "f" },
  "TikTok":     { reach: [500, 5000],  engRate: [3.0, 8.0],  icon: "♪" },
}

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function getAnalytics(platform: string, postIndex: number) {
  const b = PLATFORM_BENCHMARKS[platform]
  if (!b) return null
  const r = seededRand(postIndex * 7)
  const r2 = seededRand(postIndex * 13)
  const reach = Math.round(b.reach[0] + r * (b.reach[1] - b.reach[0]))
  const engRate = +(b.engRate[0] + r2 * (b.engRate[1] - b.engRate[0])).toFixed(1)
  const engagements = Math.round(reach * engRate / 100)
  return { reach, engRate, engagements }
}

interface PlatformTips { best_times: string[]; max_hashtags: number; format_tip: string }
interface PostIdea {
  platform: string;
  date: string;
  time: string;
  content: string;
  hashtags: string[];
  type: string;
  hook?: string;
  engagement_tip?: string;
  platform_tips?: PlatformTips;
}

// ── Sample post cards shown in hero ──
const SAMPLE_POSTS: PostIdea[] = [
  {
    platform: "Instagram",
    date: "May 12",
    time: "9:00 AM",
    hook: "This one habit changed everything for my content game 🔥",
    content: "I used to spend 3 hours planning content. Now it takes 30 seconds. Here's the AI system I built that handles my entire month of posts — and it actually sounds like me.",
    hashtags: ["contentcreator", "socialmediatips", "AItools", "creatoreconomy"],
    type: "story",
    engagement_tip: "Post between 8–10am for 2x more morning saves.",
  },
  {
    platform: "Twitter/X",
    date: "May 13",
    time: "11:00 AM",
    hook: "Hot take: consistency beats virality every time.",
    content: "90% of creators quit before they see results. The ones who win show up every single day — even when nobody's watching. Schedule your content. Build the habit. Win the long game.",
    hashtags: ["buildinpublic", "creatoreconomy", "growthhacks"],
    type: "tip",
    engagement_tip: "Reply to your first 5 comments within 1 hour for major reach boost.",
  },
  {
    platform: "LinkedIn",
    date: "May 14",
    time: "8:00 AM",
    hook: "I generated a month of LinkedIn content in under a minute. Here's what happened.",
    content: "Dropped it into DraftCal. Selected my tone (Professional), my niche (SaaS marketing), and hit generate. 30 platform-optimized posts — hooks, hashtags, engagement tips. The future of content creation is here.",
    hashtags: ["marketing", "contentmarketing", "LinkedInTips", "productivityhacks"],
    type: "promo",
    engagement_tip: "Add a poll at the end to double your comment rate.",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={copy}
      className={`text-xs px-2 py-1 rounded-lg border transition-all ${copied ? 'border-pink-500/40 bg-pink-500/10 text-pink-300' : 'border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/20'}`}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function ProModal({ onClose, onCheckout, loading }: { onClose: () => void; onCheckout: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
      <div className="rounded-2xl border border-pink-500/20 p-8 max-w-sm w-full text-center shadow-2xl shadow-pink-500/10"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0a14 100%)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-pink-500/30"
          style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>✦</div>
        <h3 className="text-xl font-black mb-2">Go Pro — $10/mo</h3>
        <p className="text-white/50 text-sm mb-5 leading-relaxed">
          Schedule directly to all 5 platforms, unlock unlimited generations, and dominate your content game.
        </p>
        <div className="space-y-2 mb-6 text-left">
          {['Unlimited content generations', 'Schedule to all 5 platforms', 'Scheduling links included', 'Full analytics dashboard', 'Team seats'].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-pink-400">✓</span> {f}
            </div>
          ))}
        </div>
        <button onClick={onCheckout} disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm mb-3 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Redirecting...</>
          ) : 'Upgrade to Pro — $10/mo'}
        </button>
        <button onClick={onClose} className="text-xs text-white/30 hover:text-white/50 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  )
}

const CHAR_LIMITS: Record<string, number> = {
  'Twitter/X': 280,
  'LinkedIn': 3000,
  'Instagram': 2200,
  'Facebook': 63206,
  'TikTok': 2200,
};

function PostCard({ post, index, showAnalytics, onSchedule }: { post: PostIdea; index: number; showAnalytics: boolean; onSchedule: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const fullText = post.content + (post.hashtags?.length ? '\n' + post.hashtags.map(h => `#${h}`).join(' ') : '');
  const analytics = getAnalytics(post.platform, index);
  const charLimit = CHAR_LIMITS[post.platform];
  const charCount = post.content.length;
  const charPct = charLimit ? Math.min(100, Math.round((charCount / charLimit) * 100)) : null;
  const charOver = charLimit ? charCount > charLimit : false;

  return (
    <div className="reveal-3d rounded-xl border border-white/8 bg-white/[0.025] hover:border-pink-500/30 transition-all group flex flex-col">
      <div className="p-4 pb-3 flex items-center justify-between">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PLATFORM_COLORS[post.platform] || 'text-pink-300 border-pink-500/30 bg-pink-500/10'}`}>
          {post.platform}
        </span>
        <span className="text-[10px] text-white/30">{post.date} · {post.time}</span>
      </div>

      {post.hook && (
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-white/90 leading-snug">&ldquo;{post.hook}&rdquo;</p>
        </div>
      )}

      <div className="px-4 pb-3 flex-1">
        <p className={`text-xs text-white/65 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
          {post.content}
        </p>
        {post.content.length > 160 && (
          <button onClick={() => setExpanded(e => !e)} className="text-[10px] text-pink-400/70 hover:text-pink-300 mt-1">
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {post.hashtags?.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {post.hashtags.map((h, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400/80">
              #{h}
            </span>
          ))}
        </div>
      )}

      {showAnalytics && analytics && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/8">
          <div className="text-[10px] text-white/30 mb-1.5">Estimated reach</div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-bold text-white/80">{analytics.reach.toLocaleString()}</div>
              <div className="text-[9px] text-white/30">impressions</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-pink-400">{analytics.engRate}%</div>
              <div className="text-[9px] text-white/30">eng. rate</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-purple-400">{analytics.engagements}</div>
              <div className="text-[9px] text-white/30">interactions</div>
            </div>
            <div className="ml-auto">
              <div className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                analytics.engRate >= 4 ? 'border-pink-500/30 bg-pink-500/10 text-pink-300' :
                analytics.engRate >= 2 ? 'border-purple-500/30 bg-purple-500/10 text-purple-300' :
                'border-white/10 text-white/30'
              }`}>
                {analytics.engRate >= 4 ? 'High' : analytics.engRate >= 2 ? 'Medium' : 'Low'}
              </div>
            </div>
          </div>
        </div>
      )}

      {post.engagement_tip && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg border" style={{ background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.2)' }}>
          <p className="text-[10px] text-purple-300/80 leading-snug">
            <span className="font-semibold">⚡ Tip:</span> {post.engagement_tip}
          </p>
        </div>
      )}

      {charLimit && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${charOver ? 'bg-red-500' : charPct! > 80 ? 'bg-amber-400' : 'bg-pink-500/60'}`}
              style={{ width: `${charPct}%` }}
            />
          </div>
          <span className={`text-[10px] font-mono tabular-nums ${charOver ? 'text-red-400' : 'text-white/25'}`}>
            {charCount}{charLimit ? `/${charLimit}` : ''}
          </span>
        </div>
      )}
      <div className="px-4 pb-4 pt-1 border-t border-white/5 flex items-center gap-2">
        <span className="text-[10px] text-white/25">{TYPE_LABELS[post.type] || post.type}</span>
        <div className="ml-auto flex gap-1.5">
          <button onClick={onSchedule}
            className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
            📅 Schedule
          </button>
          <CopyButton text={fullText} />
        </div>
      </div>
    </div>
  );
}

function PlatformInsight({ platform, tips }: { platform: string; tips: PlatformTips }) {
  return (
    <div className={`rounded-xl border p-3 ${PLATFORM_COLORS[platform]?.replace('text-', 'border-') || 'border-white/10'} bg-white/[0.02]`}>
      <div className={`text-xs font-semibold mb-2 ${PLATFORM_COLORS[platform]?.split(' ')[0]}`}>{platform}</div>
      <div className="space-y-1.5">
        <div>
          <div className="text-[10px] text-white/40 mb-1">Best times to post</div>
          <div className="flex gap-1 flex-wrap">
            {tips.best_times.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">{t}</span>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-white/45 leading-relaxed">{tips.format_tip}</p>
      </div>
    </div>
  );
}

// Calendar mockup
const CAL_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const CAL_DOTS: Record<number, string[]> = {
  1: ['#8b5cf6'], 3: ['#ec4899', '#8b5cf6'], 5: ['#3b82f6'],
  7: ['#ec4899'], 8: ['#8b5cf6', '#3b82f6'], 10: ['#ec4899'],
  12: ['#8b5cf6'], 14: ['#ec4899', '#3b82f6'], 15: ['#8b5cf6'],
  17: ['#3b82f6', '#ec4899'], 19: ['#8b5cf6'], 21: ['#ec4899'],
  22: ['#8b5cf6', '#3b82f6', '#ec4899'], 24: ['#8b5cf6'],
  26: ['#ec4899'], 28: ['#3b82f6', '#8b5cf6'],
};
const THIS_WEEK = new Set([8, 9, 10, 11, 12, 13, 14]);
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PLATFORM_PILLS = [
  { label: 'Instagram', icon: '📸', color: 'text-pink-300 border-pink-500/30 bg-pink-500/10' },
  { label: 'TikTok', icon: '♪', color: 'text-fuchsia-300 border-fuchsia-500/30 bg-fuchsia-500/10' },
  { label: 'Twitter/X', icon: '𝕏', color: 'text-sky-300 border-sky-500/30 bg-sky-500/10' },
  { label: 'LinkedIn', icon: 'in', color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
  { label: 'Facebook', icon: 'f', color: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10' },
];

// Floating social icon silhouettes for hero bg
const FLOAT_ICONS = ['📸', '𝕏', '▶', 'in', '♪', '◉', '📣', '🎬', '📅', '✦'];

export default function Home() {
  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate, isRegistered } = useGate('socialscribe', 3)
  const remaining = Math.max(0, 3 - gateCount)
  const isLimited = !isRegistered && gateCount >= 3

  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter/X", "LinkedIn"]);
  const [tone, setTone] = useState("Professional");
  const [weeks, setWeeks] = useState(2);
  const [posts, setPosts] = useState<PostIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showInsights, setShowInsights] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Check upgraded param + localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('draftcal-pro')
    if (stored === '1') setIsPro(true)
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === '1') {
      setIsPro(true)
      localStorage.setItem('draftcal-pro', '1')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const handleUpgrade = useCallback(async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setCheckoutLoading(false)
    }
  }, [])

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  async function generate() {
    const allowed = await gateIncrement()
    if (!allowed) return
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/generate-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platforms, tone, weeks }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setApiError(data.error || 'Something went wrong. Please try again.');
      } else {
        setPosts(data.posts || []);
        setFilterPlatform("All");
        setFilterType("All");
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyAll() {
    const text = posts.map(p =>
      `[${p.platform}] ${p.date} ${p.time}\n${p.content}\n${p.hashtags?.map(h => '#'+h).join(' ') || ''}`
    ).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
  }

  const filteredPosts = posts.filter(p => {
    if (filterPlatform !== "All" && p.platform !== filterPlatform) return false;
    if (filterType !== "All" && p.type !== filterType) return false;
    return true;
  });

  const platformsWithTips = posts.length > 0
    ? [...new Set(posts.map(p => p.platform))].filter(pl => posts.find(p => p.platform === pl)?.platform_tips)
    : [];

  const types = posts.length > 0 ? [...new Set(posts.map(p => p.type))] : [];

  const totalReach = posts.reduce((sum, p, i) => {
    const a = getAnalytics(p.platform, i)
    return sum + (a?.reach || 0)
  }, 0)

  return (
    <>
    {showGate && (
      <RegisterGate
        freeUsed={gateCount}
        freeLimit={3}
        freeFeature="calendars"
        lockedFeature="unlimited calendar generations"
        accentColor="#ec4899"
        site="socialscribe"
        onSuccess={onRegistered}
        onDismiss={dismissGate}
      />
    )}
    {showProModal && (
      <ProModal
        onClose={() => setShowProModal(false)}
        onCheckout={handleUpgrade}
        loading={checkoutLoading}
      />
    )}

    <main className="min-h-screen text-white relative overflow-x-hidden">
      <div className="noise-overlay" aria-hidden="true" />

      {/* ── Animated gradient mesh background ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true" style={{
        background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(236,72,153,0.18) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 30%, rgba(139,92,246,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 50% 80%, rgba(59,130,246,0.15) 0%, transparent 60%), #050510',
        zIndex: 0,
      }} />

      {/* Floating social icon silhouettes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ zIndex: 0 }}>
        {FLOAT_ICONS.map((icon, i) => (
          <span key={i} className="absolute text-white/[0.04] select-none"
            style={{
              fontSize: `${24 + (i % 3) * 16}px`,
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 97.3 + 10) % 90}%`,
              animation: `float ${8 + i * 1.3}s ease-in-out infinite`,
              animationDelay: `${-i * 1.1}s`,
              fontFamily: 'system-ui',
            }}>
            {icon}
          </span>
        ))}
      </div>

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/[0.06]"
        style={{ background: 'rgba(5,5,16,0.85)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DraftCal
            </span>
            <span className="pill-glass text-[11px] px-3 py-1 font-semibold">AI Content Calendar</span>
            {isPro && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: 'white' }}>
                PRO ✦
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {posts.length > 0 && (
              <>
                <button onClick={() => setShowAnalytics(s => !s)}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    showAnalytics
                      ? 'border-pink-500/40 bg-pink-500/10 text-pink-300'
                      : 'border-white/10 bg-white/[0.04] text-white/50 hover:text-white/80'
                  }`}>
                  📈 {showAnalytics ? 'Hide analytics' : 'Analytics'}
                </button>
                <button onClick={copyAll}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all">
                  Export
                </button>
              </>
            )}
            {!isPro ? (
              <button onClick={() => setShowProModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                Go Pro — $10/mo
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(236,72,153,0.3)', color: '#f9a8d4' }}>
                Pro member ✦
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* ── Bold hero ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Social proof badge */}
        <div className="flex justify-center mb-6">
          <span className="pill-glass text-xs font-semibold px-4 py-2 inline-flex items-center gap-2">
            <span className="text-pink-400">●</span>
            10,000+ creators use DraftCal · <span className="text-pink-300">Join them free</span>
          </span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.02] mb-5 tracking-tight">
            Generate{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>30 days</span>
            {' '}of<br />
            social content in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>30 seconds</span>
            {' '}with AI
          </h1>
          <p className="text-white/55 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Drop your brand. Pick your platforms. Watch AI fill your entire content calendar with scroll-stopping posts — hooks, hashtags, engagement tips included.
          </p>

          {/* Platform badge row */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {PLATFORM_PILLS.map(p => (
              <span key={p.label} className={`pill-glass text-xs font-medium px-3 py-1.5 flex items-center gap-1.5 ${p.color}`}>
                <span className="font-bold">{p.icon}</span> {p.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <ShimmerButton
              id="hero-generate-btn"
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              borderRadius="1rem"
              background="rgba(99,102,241,1)"
              shimmerColor="#f9a8d4"
              shimmerDuration="2.5s"
              className="px-8 py-4 font-black text-base shadow-[0_0_40px_rgba(99,102,241,0.5),0_8px_30px_rgba(0,0,0,0.4)]">
              ✦ Generate my calendar free
            </ShimmerButton>
            <button
              onClick={() => setShowProModal(true)}
              className="px-8 py-4 rounded-2xl font-bold text-base border border-white/15 text-white/70 hover:border-pink-500/40 hover:text-white transition-all">
              See Pro plan — $10/mo →
            </button>
          </div>
        </div>
      </section>

      {/* ── Two-column: Calendar + Sample Posts ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar mockup */}
          <div className="glass-liquid rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white/80">May 2025</span>
              <span className="pill-glass text-[11px] px-2.5 py-1 font-semibold"
                style={{ color: '#f472b6' }}>This week ✦</span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-white/30 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {CAL_DAYS.map(day => {
                const dots = CAL_DOTS[day] || [];
                const isThisWeek = THIS_WEEK.has(day);
                return (
                  <div key={day}
                    className={`rounded-lg p-1.5 flex flex-col items-center gap-1 transition-all ${
                      isThisWeek
                        ? 'border'
                        : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/15'
                    }`}
                    style={isThisWeek ? { background: 'rgba(236,72,153,0.12)', borderColor: 'rgba(236,72,153,0.35)' } : {}}>
                    <span className={`text-[11px] font-semibold leading-none`}
                      style={isThisWeek ? { color: '#f9a8d4' } : { color: 'rgba(255,255,255,0.5)' }}>
                      {day}
                    </span>
                    {dots.length > 0 && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {dots.map((color, i) => (
                          <span key={i} className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
              {[['#8b5cf6', 'LinkedIn'], ['#ec4899', 'Instagram'], ['#3b82f6', 'Twitter/X']].map(([color, label]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-white/40">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample generated post cards */}
          <div className="space-y-3">
            <p className="text-xs text-white/35 font-semibold uppercase tracking-widest mb-3">Sample AI-generated posts</p>
            {SAMPLE_POSTS.map((post, i) => (
              <PostCard key={i} post={post} index={i} showAnalytics={false} onSchedule={() => setShowProModal(true)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PRO section ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-3xl border p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.08) 100%)', borderColor: 'rgba(236,72,153,0.2)' }}>
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f472b6' }}>WHY PRO</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2 mb-2">Everything you need to<br />
              <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                dominate social media
              </span>
            </h2>
            <p className="text-white/40 text-sm">One plan. One price. Unlimited content.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: '∞', title: 'Unlimited content', desc: 'Generate as many calendars as you need — no daily caps, no throttling.' },
              { icon: '📱', title: 'All 5 platforms', desc: 'Twitter/X, LinkedIn, Instagram, TikTok, Facebook — all covered, all optimised.' },
              { icon: '🔗', title: 'Scheduling links', desc: 'One-click scheduling links for every post. Connect Buffer, Later, or Hootsuite.' },
              { icon: '📊', title: 'Analytics', desc: 'Full analytics dashboard — track reach, engagement rate, and top-performing content.' },
              { icon: '👥', title: 'Team seats', desc: 'Invite teammates. Collaborate on your brand calendar in real time.' },
              { icon: '🧠', title: 'Brand voice memory', desc: 'AI learns your tone and style — every post sounds authentically you.' },
            ].map(f => (
              <div key={f.title} className="glass-liquid rounded-xl p-5">
                <div className="text-2xl mb-3 font-black" style={{ color: '#f472b6' }}>{f.icon}</div>
                <div className="font-bold text-sm text-white/90 mb-1">{f.title}</div>
                <div className="text-xs text-white/45 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Pricing CTA */}
          <div className="text-center">
            <button onClick={() => setShowProModal(true)}
              className="px-10 py-4 rounded-2xl font-black text-lg transition-all hover:opacity-90 inline-flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: '0 0 50px rgba(236,72,153,0.35), 0 8px 30px rgba(0,0,0,0.4)' }}>
              ✦ Get Pro — $10/mo
            </button>
            <p className="text-white/30 text-xs mt-3">Cancel anytime · No contracts · Instant access</p>
          </div>
        </div>
      </section>

      {/* ── AI generation section ── */}
      <section id="generator" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2">
            <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Generate your calendar
            </span>
          </h2>
          <p className="text-white/35 text-sm">{remaining} free generations left today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config panel */}
          <div className="space-y-5">
            <div className="glass-liquid rounded-2xl p-7">
              <h3 className="font-bold text-base mb-5">Configure your calendar</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Brand / Topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. SaaS startup for freelancers, fitness coaching for busy moms..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-all resize-none"
                    style={{ focusBorderColor: 'rgba(236,72,153,0.6)' } as React.CSSProperties}
                    onFocus={e => e.target.style.borderColor = 'rgba(236,72,153,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button key={p} onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          platforms.includes(p)
                            ? "border text-pink-300"
                            : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                        }`}
                        style={platforms.includes(p) ? { background: 'rgba(236,72,153,0.15)', borderColor: 'rgba(236,72,153,0.4)' } : {}}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button key={t} onClick={() => setTone(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          tone === t
                            ? "border text-purple-300"
                            : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                        }`}
                        style={tone === t ? { background: 'rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.4)' } : {}}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                    Weeks to generate <span style={{ color: '#f472b6' }}>{weeks}w</span>
                  </label>
                  <input type="range" min={1} max={4} value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full accent-pink-500" />
                  <div className="flex justify-between text-[10px] text-white/25 mt-1">
                    <span>1w</span><span>2w</span><span>3w</span><span>4w</span>
                  </div>
                </div>

                {isLimited ? (
                  <div className="w-full py-3.5 rounded-xl border text-center"
                    style={{ background: 'rgba(236,72,153,0.06)', borderColor: 'rgba(236,72,153,0.2)' }}>
                    <p className="text-sm font-semibold" style={{ color: '#f472b6' }}>Daily limit reached (3 free / day)</p>
                    <button onClick={() => setShowProModal(true)} className="text-xs text-white/50 mt-0.5 hover:text-white transition-colors">
                      Upgrade to Pro for unlimited →
                    </button>
                  </div>
                ) : (
                  <button onClick={generate} disabled={!topic || loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', boxShadow: '0 0 25px rgba(236,72,153,0.3)' }}>
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : `✦ Generate calendar (${remaining} left today)`}
                  </button>
                )}
              </div>
            </div>

            {/* Analytics summary */}
            {posts.length > 0 && (
              <div className="glass-liquid rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Analytics preview</span>
                  <button onClick={() => setShowAnalytics(s => !s)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${showAnalytics ? 'border-pink-500/30 bg-pink-500/10 text-pink-300' : 'border-white/10 text-white/40'}`}>
                    {showAnalytics ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                    <div className="text-lg font-black text-white/90">
                      <NumberTicker value={Math.round(totalReach / 100) / 10} decimalPlaces={1} suffix="k" />
                    </div>
                    <div className="text-[10px] text-white/35">est. total reach</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                    <div className="text-lg font-black text-white/90">
                      <NumberTicker value={posts.length} />
                    </div>
                    <div className="text-[10px] text-white/35">posts scheduled</div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Insights */}
            {platformsWithTips.length > 0 && (
              <div className="glass-liquid rounded-2xl p-5">
                <button onClick={() => setShowInsights(o => !o)}
                  className="w-full flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">Platform insights</span>
                  <span className="text-white/40 text-xs">{showInsights ? '▲ Hide' : '▼ Show'}</span>
                </button>
                {showInsights && (
                  <div className="space-y-3 mt-3">
                    {platformsWithTips.map(pl => {
                      const tips = posts.find(p => p.platform === pl)?.platform_tips!;
                      return <PlatformInsight key={pl} platform={pl} tips={tips} />;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Calendar grid / results */}
          <div className="lg:col-span-2">
            {posts.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {["All", ...platforms].map(p => (
                    <button key={p} onClick={() => setFilterPlatform(p)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        filterPlatform === p
                          ? 'text-pink-300 border-pink-500/40 bg-pink-500/10'
                          : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <div className="flex gap-1.5 flex-wrap">
                  {["All", ...types].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        filterType === t
                          ? 'text-purple-300 border-purple-500/40 bg-purple-500/10'
                          : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}>
                      {TYPE_LABELS[t] || t}
                    </button>
                  ))}
                </div>
                <span className="ml-auto text-xs text-white/30">{filteredPosts.length} posts</span>
              </div>
            )}

            {apiError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center mb-4">
                <p className="text-red-300 font-semibold mb-1">Could not generate calendar</p>
                <p className="text-red-300/70 text-sm">{apiError}</p>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              <div ref={resultsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPosts.map((post, i) => (
                  <PostCard key={i} post={post} index={i} showAnalytics={showAnalytics} onSchedule={() => setShowProModal(true)} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="h-48 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <p className="text-white/30 text-sm">No posts match the current filter</p>
              </div>
            ) : (
              <div className="h-full glass-liquid rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(139,92,246,0.25))', border: '1px solid rgba(236,72,153,0.3)' }}>
                  📅
                </div>
                <p className="text-white/40 text-sm max-w-xs text-center">
                  Describe your brand and click generate to fill your content calendar
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {["Copy each post with 1 click", "Analytics preview per post", "Trending hashtags included", "Filter by platform or type"].map(f => (
                    <span key={f} className="pill-glass text-[10px] px-2.5 py-1 text-white/40">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing section ── */}
      <section id="pricing" className="relative z-10 border-t border-white/5 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2">
              <span style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Simple pricing
              </span>
            </h2>
            <p className="text-white/35 text-sm">3 free calendars per day · No card required</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-8 bg-white/[0.02]">
              <div className="text-xs font-bold uppercase tracking-widest mb-1 text-white/25">Free</div>
              <div className="text-4xl font-black mb-0.5 text-white/40">$0</div>
              <div className="text-sm mb-5 text-white/20">forever</div>
              <ul className="space-y-2.5 mb-7">
                {['3 calendars / day', '5 platforms', 'Up to 4 weeks', 'Engagement tips', 'Analytics preview', 'Copy with 1 click'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/30">
                    <span className="text-white/20 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-bold border border-white/10 text-white/30 cursor-default">
                Current plan
              </button>
            </div>
            <div className="p-8" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(139,92,246,0.12) 100%)' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f472b6' }}>Pro</div>
              <div className="text-4xl font-black mb-0.5 text-white">$10</div>
              <div className="text-sm mb-5" style={{ color: '#ec4899' }}>/month</div>
              <ul className="space-y-2.5 mb-7">
                {['Unlimited calendars', 'All 5 platforms', 'Scheduling links', 'Full analytics dashboard', 'Team seats', 'Brand voice memory'].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="mt-0.5" style={{ color: '#f472b6' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowProModal(true)}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                Go Pro ✦
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
        <p className="text-white/25 text-xs">
          © 2025 DraftCal · <span style={{ color: 'rgba(244,114,182,0.6)' }}>draftcal.app</span>
        </p>
      </footer>
      <GuidedTour steps={DRAFTCAL_TOUR} storageKey="draftcal_tour_v1" accentColor="#ec4899" />
    </main>
    </>
  );
}
