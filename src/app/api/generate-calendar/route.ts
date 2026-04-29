import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLATFORM_TIPS: Record<string, { best_times: string[]; max_hashtags: number; format_tip: string }> = {
  "Twitter/X":  { best_times: ["9:00","12:00","17:00"], max_hashtags: 3, format_tip: "Keep under 280 chars. Use thread format for long content." },
  "LinkedIn":   { best_times: ["08:00","12:00","17:30"], max_hashtags: 5, format_tip: "Start with a hook. Use line breaks. 1300 chars optimal." },
  "Instagram":  { best_times: ["11:00","14:00","20:00"], max_hashtags: 8, format_tip: "First line is the hook. Emojis add personality. Alt text helps reach." },
  "Facebook":   { best_times: ["13:00","15:00","19:00"], max_hashtags: 4, format_tip: "Questions drive comments. Native video gets 6x reach." },
  "TikTok":     { best_times: ["07:00","14:00","21:00"], max_hashtags: 6, format_tip: "Hook in first 3 seconds. Trending sounds boost discovery." },
}

export async function POST(req: NextRequest) {
  const { topic, platforms, tone, weeks } = await req.json();
  const postsPerWeek = platforms.length * 3;
  const totalPosts = postsPerWeek * weeks;

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: `You are a social media expert and content strategist. Generate engaging, platform-optimized content that drives real engagement.
Always return valid JSON only, no markdown.`,
    messages: [{
      role: "user",
      content: `Generate ${totalPosts} social media posts for: "${topic}"

Requirements:
- Platforms: ${platforms.join(", ")}
- Tone: ${tone}
- Spread across ${weeks} weeks starting from ${dateStr}
- Mix content types: tip, story, question, promo, bts (behind-the-scenes), poll, carousel
- Optimize post length per platform (Twitter: concise <280 chars, LinkedIn: 800-1300 chars, Instagram: 150-200 chars, TikTok: script-style)
- Include relevant hashtags (3-8 per post based on platform best practice)
- For each post include an "engagement_tip" — one actionable tip to maximise reach (e.g. "Post on Tuesday at 9am", "Reply to first 10 comments quickly")
- Include "hook" — the opening line to grab attention (first 10-15 words)

Return JSON: {"posts": [{"platform": "...", "date": "YYYY-MM-DD", "time": "HH:MM", "content": "...", "hashtags": ["tag1","tag2"], "type": "tip|story|question|promo|bts|poll|carousel", "hook": "...", "engagement_tip": "..."}]}`
    }]
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    let data = JSON.parse(text);
    // Inject platform static tips
    if (data.posts) {
      data.posts = data.posts.map((p: { platform: string }) => ({
        ...p,
        platform_tips: PLATFORM_TIPS[p.platform] || null,
      }));
    }
    return NextResponse.json(data);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const data = JSON.parse(match[0]);
        return NextResponse.json(data);
      } catch { /* fall through */ }
    }
    return NextResponse.json({ posts: [] });
  }
}
