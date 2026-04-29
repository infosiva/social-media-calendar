"use client";
import { useState, useCallback } from "react";

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

function PostCard({ post, index }: { post: PostIdea; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const fullText = post.content + (post.hashtags?.length ? '\n' + post.hashtags.map(h => `#${h}`).join(' ') : '');

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] hover:border-white/15 transition-all group flex flex-col">
      {/* Header */}
      <div className="p-4 pb-3 flex items-center justify-between">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${PLATFORM_COLORS[post.platform] || 'text-pink-300 border-pink-500/30 bg-pink-500/10'}`}>
          {post.platform}
        </span>
        <span className="text-[10px] text-white/30">{post.date} · {post.time}</span>
      </div>

      {/* Hook */}
      {post.hook && (
        <div className="px-4 pb-2">
          <p className="text-xs font-semibold text-white/90 leading-snug">"{post.hook}"</p>
        </div>
      )}

      {/* Content */}
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

      {/* Hashtags */}
      {post.hashtags?.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {post.hashtags.map((h, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400/80">
              #{h}
            </span>
          ))}
        </div>
      )}

      {/* Engagement tip */}
      {post.engagement_tip && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
          <p className="text-[10px] text-amber-300/80 leading-snug">
            <span className="font-semibold">⚡ Tip:</span> {post.engagement_tip}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-4 pt-1 border-t border-white/5 flex items-center gap-2">
        <span className="text-[10px] text-white/25">{TYPE_LABELS[post.type] || post.type}</span>
        <div className="ml-auto flex gap-1.5">
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

export default function Home() {
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter/X", "LinkedIn"]);
  const [tone, setTone] = useState("Professional");
  const [weeks, setWeeks] = useState(2);
  const [posts, setPosts] = useState<PostIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showInsights, setShowInsights] = useState(false);

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platforms, tone, weeks }),
      });
      const data = await res.json();
      setPosts(data.posts || []);
      setFilterPlatform("All");
      setFilterType("All");
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

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-white/[0.02] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center text-sm font-bold">S</div>
            <span className="font-semibold text-lg">SocialAI</span>
          </div>
          <div className="flex items-center gap-3">
            {posts.length > 0 && (
              <>
                <span className="text-xs text-white/40">{posts.length} posts generated</span>
                <button onClick={copyAll}
                  className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-white/60 hover:text-white hover:border-white/20 transition-all">
                  Copy all
                </button>
              </>
            )}
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-sm font-medium transition-all">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            AI Content Calendar · Hashtags · Engagement tips
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            Generate a month of{" "}
            <span className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent">content in seconds</span>
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto">
            AI writes platform-optimized posts, schedules them, generates trending hashtags, and gives you engagement tips for each post.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config panel */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7">
              <h2 className="font-semibold mb-5">Configure</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Brand / Topic</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. SaaS startup for freelancers, fitness coaching for busy moms..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-500/60 transition-all resize-none"
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
                    className="w-full accent-pink-500" />
                  <div className="flex justify-between text-[10px] text-white/25 mt-1">
                    <span>1w</span><span>2w</span><span>3w</span><span>4w</span>
                  </div>
                </div>

                <button onClick={generate} disabled={!topic || loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : "✦ Generate calendar"}
                </button>
              </div>
            </div>

            {/* Platform Insights */}
            {platformsWithTips.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5">
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

          {/* Calendar grid */}
          <div className="lg:col-span-2">
            {/* Filter bar */}
            {posts.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                  {["All", ...platforms].map(p => (
                    <button key={p} onClick={() => setFilterPlatform(p)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        filterPlatform === p
                          ? 'border-pink-500/50 bg-pink-500/15 text-pink-300'
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
                <span className="ml-auto text-xs text-white/30">{filteredPosts.length} posts</span>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPosts.map((post, i) => (
                  <PostCard key={i} post={post} index={i} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="h-48 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center">
                <p className="text-white/30 text-sm">No posts match the current filter</p>
              </div>
            ) : (
              <div className="h-full rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✦</div>
                <p className="text-white/40 text-sm max-w-xs text-center">
                  Describe your brand and click generate to fill your content calendar
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {["Copy each post with 1 click", "Engagement tips per post", "Trending hashtags included", "Filter by platform or type"].map(f => (
                    <span key={f} className="text-[10px] px-2.5 py-1 rounded-full border border-white/8 text-white/30">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
