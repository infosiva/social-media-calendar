"use client";
import { useState } from "react";

const PLATFORMS = ["Twitter/X", "LinkedIn", "Instagram", "Facebook", "TikTok"];
const TONES = ["Professional", "Casual", "Humorous", "Inspirational", "Educational"];

interface PostIdea {
  platform: string;
  date: string;
  time: string;
  content: string;
  hashtags: string[];
  type: string;
}

export default function Home() {
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["Twitter/X", "LinkedIn"]);
  const [tone, setTone] = useState("Professional");
  const [weeks, setWeeks] = useState(2);
  const [posts, setPosts] = useState<PostIdea[]>([]);
  const [loading, setLoading] = useState(false);

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
    } finally {
      setLoading(false);
    }
  }

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
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 text-sm font-medium transition-all">
            Upgrade to Pro
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            AI Content Calendar
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-3">
            Generate a month of{" "}
            <span className="bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent">content in seconds</span>
          </h1>
          <p className="text-white/50">AI writes platform-optimized posts, schedules them, and generates hashtags automatically.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Config panel */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7">
            <h2 className="font-semibold mb-5">Configure</h2>

            <div className="space-y-5">
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Brand / Topic</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. SaaS startup, fitness coach..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-500/60 transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        platforms.includes(p)
                          ? "bg-pink-500/20 border border-pink-500/40 text-pink-300"
                          : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        tone === t
                          ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                          : "bg-white/[0.04] border border-white/10 text-white/50 hover:border-white/20"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Weeks to generate</label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-full accent-pink-500"
                />
                <div className="text-xs text-white/40 mt-1">{weeks} week{weeks > 1 ? "s" : ""}</div>
              </div>

              <button
                onClick={generate}
                disabled={!topic || loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-500 hover:to-amber-500 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate calendar ✦"
                )}
              </button>
            </div>
          </div>

          {/* Calendar grid */}
          <div className="lg:col-span-2">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map((post, i) => (
                  <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] p-5 hover:border-white/15 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/20">
                        {post.platform}
                      </span>
                      <span className="text-xs text-white/30">{post.date} · {post.time}</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-3">{post.content}</p>
                    {post.hashtags?.length > 0 && (
                      <p className="text-xs text-cyan-400/70">{post.hashtags.map((h) => `#${h}`).join(" ")}</p>
                    )}
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                      <span className="text-xs text-white/30">{post.type}</span>
                      <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs text-white/50 hover:text-white transition-colors">Edit</button>
                        <button className="text-xs text-white/50 hover:text-white transition-colors">Schedule</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✦</div>
                <p className="text-white/40 text-sm max-w-xs text-center">
                  Configure your settings and click generate to fill your content calendar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
