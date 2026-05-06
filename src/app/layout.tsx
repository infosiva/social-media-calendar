import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SharedFooter from "@/components/SharedFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialAI — AI Content Calendar",
  description: "Generate weeks of social media content in seconds with Claude AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <SharedFooter theme="dark" />
        <script src="http://31.97.56.148:3098/t.js" data-site="social-media-calendar.vercel.app" defer></script>
      </body>
    </html>
  );
}
