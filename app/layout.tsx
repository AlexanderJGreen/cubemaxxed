import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import RankUpModal from "./components/RankUpModal";
import { ThemeProvider, ThemeScript } from "./components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME, isValidTheme } from "@/lib/themes";
import type { ThemeId } from "@/lib/themes";

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
  let initialTheme: ThemeId = DEFAULT_THEME;
  let initialIsPro = false;

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

    const profileTheme = (profile as Record<string, unknown>)?.theme as string | null;
    if (profileTheme && isValidTheme(profileTheme)) {
      initialTheme = profileTheme;
    }
    initialIsPro = ((profile as Record<string, unknown>)?.is_pro as boolean) ?? false;
  }

  return (
    <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
      <head>
        {/* Anti-flash: sync localStorage theme before paint */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('cm-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
        }} />
      </head>
      <body className={`${pressStart2P.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          initialTheme={initialTheme}
          initialIsPro={initialIsPro}
          isLoggedIn={!!user}
        >
          <Header xp={xp} avatarUrl={avatarUrl} username={username} />
          <main>{children}</main>
          <RankUpModal />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
