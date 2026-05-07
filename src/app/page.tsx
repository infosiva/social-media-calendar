"use client";
import { useState, useCallback } from "react";

function useRateLimit(key: string, limit: number) {
  const getUsage = useCallback(() => {
    if (typeof window === 'undefined') return { count: 0, date: '' }
    try { return JSON.parse(localStorage.getItem(key) || '{"count":0,"date":""}') } catch { return { count: 0, date: '' } }
  }, [key])
  const today = new Date().toISOString().split('T')[0]
  const usage = getUsage()
  const count = usage.date === today ? usage.count : 0
  const remaining = Math.max(0, limit - count)
  const increment = useCallback(() => {
    const d = new Date().toISOString().split('T')[0]
    const u = getUsage()
    const c = u.date === d ? u.count + 1 : 1
    localStorage.setItem(key, JSON.stringify({ count: c, date: d }))
  }, [key, getUsage])
  return { remaining, increment, isLimited: remaining === 0 }
}

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
  "TikTok": "text-red-300 border-red-500/30 bg-red-500/10",
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={copy}
      className={`text-xs px-2 py-1 rounded-lg border transition-all ${copied ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/20'}`}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  );
}

function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-[#0d0a14] rounded-2xl border border-pink-500/20 p-8 max-w-sm w-full text-center shadow-2xl shadow-pink-500/10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-pink-500/30">✦</div>
        <h3 className="text-xl font-black mb-2">Schedule to Socials</h3>
        <p className="text-white/50 text-sm mb-5 leading-relaxed">
          Direct scheduling to Twitter/X, LinkedIn, Instagram, Facebook and TikTok is a Pro feature — connect your accounts and post directly from SocialScribe.
        </p>
        <div className="space-y-2 mb-6 text-left">
          {['Connect all 5 platforms', 'Auto-post at optimal times', 'Brand voice memory', 'Analytics tracking', 'Bulk CSV export'].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-pink-400">✓</span> {f}
            </div>
          ))}
        </div>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold text-sm mb-3 hover:from-pink-500 hover:to-purple-500 transition-all">
          Upgrade to Pro — $9/mo
        </button>
        <button onClick={onClose} className="text-xs text-white/30 hover:text-white/50 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  )
}

function PostCard({ post, index, showAnalytics }: { post: PostIdea; index: number; showAnalytics: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const fullText = post.content + (post.hashtags?.length ? '\n' + post.hashtags.map(h => `#${h}`).join(' ') : '');
  const analytics = getAnalytics(post.platform, index);

  return (
    <>
      {showScheduleModal && <ProModal onClose={() => setShowScheduleModal(false)} />}
      <div className="reveal-3d rounded-xl border border-white/8 bg-white/[0.025] hover:border-violet-500/30 transition-all group flex flex-col">
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
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400/80">
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
                <div className="text-sm font-bold text-emerald-400">{analytics.engRate}%</div>
                <div className="text-[9px] text-white/30">eng. rate</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-amber-400">{analytics.engagements}</div>
                <div className="text-[9px] text-white/30">interactions</div>
              </div>
              <div className="ml-auto">
                <div className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                  analytics.engRate >= 4 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' :
                  analytics.engRate >= 2 ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' :
                  'border-white/10 text-white/30'
                }`}>
                  {analytics.engRate >= 4 ? 'High' : analytics.engRate >= 2 ? 'Medium' : 'Low'}
                </div>
              </div>
            </div>
          </div>
        )}

        {post.engagement_tip && (
          <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
            <p className="text-[10px] text-amber-300/80 leading-snug">
              <span className="font-semibold">⚡ Tip:</span> {post.engagement_tip}
            </p>
          </div>
        )}

        <div className="px-4 pb-4 pt-1 border-t border-white/5 flex items-center gap-2">
          <span className="text-[10px] text-white/25">{TYPE_LABELS[post.type] || post.type}</span>
          <div className="ml-auto flex gap-1.5">
            <button onClick={() => setShowScheduleModal(true)}
              className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-white/30 hover:text-white/60 hover:border-white/20 transition-all">
              📅 Schedule
            </button>
            <CopyButton text={fullText} />
          </div>
        </div>
      </div>
    </>
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

// Calendar mockup data — days 1-28, Mon-Sun cols, some dots per day
const CAL_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const CAL_DOTS: Record<number, string[]> = {
  1: ['#8b5cf6'], 3: ['#ec4899', '#8b5cf6'], 5: ['#f59e0b'],
  7: ['#ec4899'], 8: ['#8b5cf6', '#f59e0b'], 10: ['#ec4899'],
  12: ['#8b5cf6'], 14: ['#ec4899', '#f59e0b'], 15: ['#8b5cf6'],
  17: ['#f59e0b', '#ec4899'], 19: ['#8b5cf6'], 21: ['#ec4899'],
  22: ['#8b5cf6', '#f59e0b', '#ec4899'], 24: ['#8b5cf6'],
  26: ['#ec4899'], 28: ['#f59e0b', '#8b5cf6'],
};
// "This week" = days 8-14 (row 2)
const THIS_WEEK = new Set([8, 9, 10, 11, 12, 13, 14]);
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PLATFORM_PILLS = [
  { label: 'Instagram', icon: '📸', color: 'text-pink-300 border-pink-500/30 bg-pink-500/10' },
  { label: 'TikTok', icon: '♪', color: 'text-red-300 border-red-500/30 bg-red-500/10' },
  { label: 'Twitter/X', icon: '𝕏', color: 'text-sky-300 border-sky-500/30 bg-sky-500/10' },
  { label: 'LinkedIn', icon: 'in', color: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
  { label: 'Facebook', icon: 'f', color: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10' },
];

export default function Home() {
  const { remaining, increment, isLimited } = useRateLimit('socialscribe-usage', 3)
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

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  async function generate() {
    if (isLimited) return
    increment()
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
    <main className="min-h-screen text-white relative">
      {/* Ambient background */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="liquid-blob liquid-blob-1" style={{ '--theme-primary': '#8b5cf6' } as React.CSSProperties} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-2" style={{ '--theme-secondary': '#ec4899' } as React.CSSProperties} aria-hidden="true" />
      <div className="liquid-blob liquid-blob-3" style={{ '--theme-accent': '#f59e0b' } as React.CSSProperties} aria-hidden="true" />

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/90 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-tight">📅 ContentCal</span>
            <span className="pill-glass text-[11px] px-3 py-1 font-semibold">AI Content Planner</span>
          </div>
          <div className="flex items-center gap-3">
            {posts.length > 0 && (
              <>
                <button onClick={() => setShowAnalytics(s => !s)}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    showAnalytics
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/10 bg-white/[0.04] text-white/50 hover:text-white/80'
                  }`}>
                  📈 {showAnalytics ? 'Hide analytics' : 'Analytics preview'}
                </button>
                <button onClick={copyAll}
                  className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-white/60 hover:text-white hover:border-white/30 transition-all">
                  Export
                </button>
              </>
            )}
            <button className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
              Start free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Split hero ── */}
      <section className="grid md:grid-cols-2 gap-8 items-center min-h-[85vh] px-6 md:px-12 py-12 max-w-7xl mx-auto">
        {/* Left — copy */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="pill-glass text-xs font-semibold px-3 py-1.5 inline-block mb-5">
              ✨ 30 days of content in 5 minutes
            </span>
            <h1 className="text-4xl md:text-5xl font-black leading-[1.05] mb-4">
              Never run out of<br />
              <span className="text-iridescent">content ideas</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-md">
              AI generates a full month of social posts tailored to your brand voice.
            </p>
          </div>

          {/* Platform pills */}
          <div className="flex flex-wrap gap-2">
            {PLATFORM_PILLS.map(p => (
              <span key={p.label} className={`pill-glass text-xs font-medium px-3 py-1.5 flex items-center gap-1.5 ${p.color}`}>
                <span className="font-bold">{p.icon}</span> {p.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-liquid px-6 py-3 rounded-xl font-bold text-sm">
              Generate my calendar
            </button>
            <button
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/15 text-white/70 hover:border-white/30 hover:text-white transition-all">
              See example
            </button>
          </div>
        </div>

        {/* Right — calendar mockup */}
        <div className="glass-liquid rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white/80">May 2025</span>
            <span className="pill-glass text-[11px] px-2.5 py-1 text-violet-300 font-semibold">This week ✦</span>
          </div>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-white/30 py-1">{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {CAL_DAYS.map(day => {
              const dots = CAL_DOTS[day] || [];
              const isThisWeek = THIS_WEEK.has(day);
              return (
                <div key={day}
                  className={`rounded-lg p-1.5 flex flex-col items-center gap-1 transition-all ${
                    isThisWeek
                      ? 'bg-violet-500/20 border border-violet-500/40'
                      : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/15'
                  }`}>
                  <span className={`text-[11px] font-semibold leading-none ${isThisWeek ? 'text-violet-200' : 'text-white/50'}`}>
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
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
            {[['#8b5cf6', 'LinkedIn'], ['#ec4899', 'Instagram'], ['#f59e0b', 'TikTok']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI generation section ── */}
      <section id="generator" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config panel */}
          <div className="space-y-5">
            <div className="glass-liquid rounded-2xl p-7">
              <h2 className="font-bold text-lg mb-5">Configure your calendar</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Brand / Topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. SaaS startup for freelancers, fitness coaching for busy moms..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Platforms</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => (
                      <button key={p} onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          platforms.includes(p)
                            ? "bg-pink-500/20 border border-pink-500/40 text-pink-300"
                            : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                        }`}>
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
                            ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                            : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
                    Weeks to generate <span className="text-pink-400">{weeks}w</span>
                  </label>
                  <input type="range" min={1} max={4} value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full accent-violet-500" />
                  <div className="flex justify-between text-[10px] text-white/25 mt-1">
                    <span>1w</span><span>2w</span><span>3w</span><span>4w</span>
                  </div>
                </div>

                {isLimited ? (
                  <div className="w-full py-3.5 rounded-xl bg-white/[0.04] border border-amber-500/20 text-center">
                    <p className="text-amber-400 text-sm font-semibold">Daily limit reached (3 free / day)</p>
                    <p className="text-xs text-amber-700 mt-0.5">Upgrade to Pro for unlimited calendars</p>
                  </div>
                ) : (
                  <button onClick={generate} disabled={!topic || loading}
                    className="btn-liquid w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
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
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${showAnalytics ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40'}`}>
                    {showAnalytics ? 'On' : 'Off'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                    <div className="text-lg font-black text-white/90">{(totalReach / 1000).toFixed(1)}k</div>
                    <div className="text-[10px] text-white/35">est. total reach</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 text-center">
                    <div className="text-lg font-black text-white/90">{posts.length}</div>
                    <div className="text-[10px] text-white/35">posts scheduled</div>
                  </div>
                </div>
                <p className="text-[10px] text-white/25 mt-3 leading-relaxed">
                  Estimates based on platform averages for small creators. Actual reach varies with follower count and posting time.
                </p>
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
                          ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
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
                          ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                          : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}>
                      {TYPE_LABELS[t] || t}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAnalytics(s => !s)}
                  className={`sm:hidden text-xs px-2.5 py-1 rounded-full border transition-all ${
                    showAnalytics ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 text-white/40'
                  }`}>
                  📈 Analytics
                </button>
                <span className="ml-auto text-xs text-white/30">{filteredPosts.length} posts</span>
              </div>
            )}

            {apiError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center mb-4">
                <p className="text-red-300 font-semibold mb-1">⚠️ Could not generate calendar</p>
                <p className="text-red-300/70 text-sm">{apiError}</p>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPosts.map((post, i) => (
                  <PostCard key={i} post={post} index={i} showAnalytics={showAnalytics} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="h-48 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <p className="text-white/30 text-sm">No posts match the current filter</p>
              </div>
            ) : (
              <div className="h-full glass-liquid rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
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

      {/* ── Feature grid ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🤖', title: 'AI Writing', desc: 'Platform-native copy in your brand voice' },
            { icon: '📊', title: 'Analytics', desc: 'Estimated reach & engagement per post' },
            { icon: '🗓️', title: 'Visual Calendar', desc: 'See your full month at a glance' },
            { icon: '🚀', title: 'Auto-Schedule', desc: 'Post at optimal times automatically' },
          ].map(f => (
            <div key={f.title} className="glass-liquid reveal-3d rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="font-bold text-sm text-white/90 mb-1">{f.title}</div>
                <div className="text-xs text-white/45 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing section ── */}
      <section id="pricing" className="border-t border-white/5 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2">
              <span className="text-iridescent">Simple pricing</span>
            </h2>
            <p className="text-white/35 text-sm">3 free calendars per day · No card required</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-white/10 rounded-2xl overflow-hidden">
            {[
              { name: 'Free', price: '$0', sub: 'forever', features: ['3 calendars / day', '5 platforms', 'Up to 4 weeks', 'Engagement tips', 'Analytics preview', 'Copy with 1 click'], cta: 'Current plan', highlight: false },
              { name: 'Pro', price: '$9', sub: '/month', features: ['Unlimited calendars', 'Schedule directly to socials', 'Brand voice memory', 'Full analytics dashboard', 'Bulk export (CSV)', 'Priority AI speed'], cta: 'Go Pro ✦', highlight: true },
            ].map(plan => (
              <div key={plan.name} className={`p-8 ${plan.highlight ? 'bg-gradient-to-br from-violet-950/50 to-pink-950/40' : 'bg-white/[0.02]'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${plan.highlight ? 'text-violet-400' : 'text-white/25'}`}>{plan.name}</div>
                <div className={`text-4xl font-black mb-0.5 ${plan.highlight ? 'text-white' : 'text-white/40'}`}>{plan.price}</div>
                <div className={`text-sm mb-5 ${plan.highlight ? 'text-pink-500' : 'text-white/20'}`}>{plan.sub}</div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-white/70' : 'text-white/30'}`}>
                      <span className={plan.highlight ? 'text-violet-400 mt-0.5' : 'text-white/20 mt-0.5'}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${plan.highlight ? 'hover:opacity-90' : 'border border-white/10 text-white/30 cursor-default'}`}
                  style={plan.highlight ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' } : {}}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
