import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import RankUpModal from "./components/RankUpModal";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@/lib/supabase/server";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cubemaxxed",
  description: "Learn to speedcube. Level up.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let xp: number | null = null;
  let avatarUrl: string | null = null;
  let username: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    xp = profile?.total_xp ?? 0;
    avatarUrl = (profile as Record<string, unknown>)?.avatar_url as string | null ?? null;
    username =
      (user.user_metadata?.username as string | undefined) ??
      user.email?.split("@")[0] ??
      "Cuber";
  }

  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${inter.variable} antialiased`}>
        <Header xp={xp} avatarUrl={avatarUrl} username={username} />
        <main>{children}</main>
        <RankUpModal />
        <Analytics />
      </body>
    </html>
  );
}
