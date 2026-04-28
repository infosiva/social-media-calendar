import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { topic, platforms, tone, weeks } = await req.json();
  const postsPerWeek = platforms.length * 3;
  const totalPosts = postsPerWeek * weeks;

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: `You are a social media expert. Generate engaging, platform-optimized content that drives real engagement.
Always return valid JSON only, no markdown.`,
    messages: [{
      role: "user",
      content: `Generate ${totalPosts} social media posts for: "${topic}"

Requirements:
- Platforms: ${platforms.join(", ")}
- Tone: ${tone}
- Spread across ${weeks} weeks starting from ${dateStr}
- Mix content types: tips, stories, questions, promotions, behind-the-scenes
- Optimize post length per platform (Twitter: concise, LinkedIn: longer, Instagram: medium)
- Include relevant hashtags (3-8 per post)

Return JSON: {"posts": [{"platform": "...", "date": "YYYY-MM-DD", "time": "HH:MM", "content": "...", "hashtags": ["tag1","tag2"], "type": "tip|story|question|promo|bts"}]}`
    }]
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return NextResponse.json(JSON.parse(match[0]));
    }
    return NextResponse.json({ posts: [] });
  }
}
