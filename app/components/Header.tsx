"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getRankInfo } from "@/lib/rank";
import { RankBadge } from "@/app/components/RankBadge";
import AvatarDropdown from "@/app/components/AvatarDropdown";
import { signout } from "@/app/auth/actions";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Playground" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/memory-trainer", label: "Trainer" },
];

const CUBE_GRADIENT =
  "linear-gradient(to right, #C41E3A, #FF5800, #FFD500, #009B48, #0051A2, #ffffff)";

const CUBE_COLORS = [
  "#C41E3A",
  "#0051A2",
  "#009B48",
  "#FF5800",
  "#FFD500",
  "#ffffff",
];

function randomCubeColor(exclude?: string) {
  const options = CUBE_COLORS.filter((c) => c !== exclude);
  return options[Math.floor(Math.random() * options.length)];
}

export default function Header({
  xp,
  avatarUrl,
  username,
}: {
  xp?: number | null;
  avatarUrl?: string | null;
  username?: string | null;
}) {
  const pathname = usePathname();
  const [activeColor, setActiveColor] = useState(CUBE_COLORS[0]);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  const rank = xp != null ? getRankInfo(xp) : null;
  const xpInTier = rank && xp != null ? xp - rank.start : 0;
  const xpNeeded = rank ? rank.end - rank.start : 1;
  const xpPct =
    (rank?.end ?? 0) >= 999999
      ? 100
      : Math.min(100, Math.round((xpInTier / xpNeeded) * 100));

  useEffect(() => {
    setActiveColor(randomCubeColor());
  }, []);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveColor((prev) => randomCubeColor(prev));
    setMenuOpen(false);
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isLoggedIn = !!username;

  return (
    <header className="relative bg-[#0d0d14] border-b border-white/[0.04]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Site name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-base leading-none tracking-tight text-[#FFD500] transition-opacity hover:opacity-80 shrink-0"
          style={{
            textShadow:
              "1px 1px 0 #C41E3A, 2px 2px 0 #C41E3A, 3px 3px 0 #C41E3A",
          }}
        >
          {/* Pixel cube icon */}
          <div className="grid grid-cols-3 gap-[2px] p-[2px] bg-[#1a1a26] shrink-0">
            {[
              "#C41E3A",
              "#FFD500",
              "#0051A2",
              "#FF5800",
              "#009B48",
              "#ffffff",
              "#FFD500",
              "#C41E3A",
              "#0051A2",
            ].map((color, i) => (
              <div key={i} style={{ width: 5, height: 5, backgroundColor: color }} />
            ))}
          </div>
          CubeMaxxed
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative font-sans text-[15px] font-medium transition-colors duration-300 pb-1 ${
                  isActive ? "font-bold" : "text-zinc-400 hover:text-zinc-100"
                }`}
                style={isActive ? { color: activeColor } : undefined}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background: `linear-gradient(to right, transparent, ${activeColor}70, transparent)`,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && rank ? (
            <>
              {/* Compact rank widget */}
              <Link
                href="/profile"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                title={`${rank.rank} ${rank.tier} — ${xp?.toLocaleString()} XP`}
              >
                <div className="w-5 h-5 shrink-0">
                  <RankBadge name={rank.rank} />
                </div>
                <div className="flex flex-col gap-[3px] items-start">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-heading text-[7px] leading-none tracking-widest"
                      style={{ color: rank.color }}
                    >
                      {rank.rank} {rank.tier}
                    </span>
                    <div className="flex gap-[3px]">
                      {(["I", "II", "III"] as const).map((t) => (
                        <div
                          key={t}
                          style={{
                            width: 4,
                            height: 4,
                            backgroundColor: rank.color,
                            opacity: t <= rank.tier ? 1 : 0.18,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="font-sans text-[10px] leading-none text-zinc-500">
                    {xp?.toLocaleString()} XP
                  </span>
                </div>
              </Link>

              {/* Avatar dropdown */}
              <AvatarDropdown
                username={username!}
                avatarUrl={avatarUrl ?? null}
                rankColor={rank.color}
              />
            </>
          ) : (
            /* Logged-out: sign in / sign up */
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="font-sans text-[15px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors duration-300"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="font-heading bg-[#FFD500] px-3 py-1.5 text-[10px] text-black transition hover:brightness-110"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>

        {/* Mobile right — avatar (if logged in) + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {isLoggedIn && rank && (
            <AvatarDropdown
              username={username!}
              avatarUrl={avatarUrl ?? null}
              rankColor={rank.color}
            />
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 shrink-0 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={
                menuOpen
                  ? { transform: "translateY(7px) rotate(45deg)" }
                  : undefined
              }
            />
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={menuOpen ? { opacity: 0 } : undefined}
            />
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={
                menuOpen
                  ? { transform: "translateY(-7px) rotate(-45deg)" }
                  : undefined
              }
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d14] px-6 py-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-sans text-sm py-3 border-b border-white/[0.04] transition-colors ${
                  isActive ? "font-bold" : "text-zinc-400"
                }`}
                style={isActive ? { color: activeColor } : undefined}
              >
                {label}
              </Link>
            );
          })}

          {/* Mobile auth section */}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className={`font-sans text-sm py-3 border-b border-white/[0.04] transition-colors ${
                  pathname === "/profile" ? "font-bold" : "text-zinc-400"
                }`}
                style={
                  pathname === "/profile" ? { color: activeColor } : undefined
                }
              >
                Profile
              </Link>
              <form action={signout} className="pt-1">
                <button
                  type="submit"
                  className="font-sans text-sm text-zinc-600 hover:text-[#C41E3A] transition-colors py-2 cursor-pointer"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-3 pt-3">
              <Link
                href="/auth/login"
                className="font-sans text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="font-heading bg-[#FFD500] px-3 py-1.5 text-[10px] text-black transition hover:brightness-110"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>
      )}

      {/* XP progress bar / accent bar */}
      {rank ? (
        <div className="h-[2px] w-full bg-[#0a0a12] relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 transition-all duration-700"
            style={{
              width: `${xpPct}%`,
              backgroundColor: rank.color,
              boxShadow: `0 0 8px ${rank.glow}`,
            }}
          />
        </div>
      ) : (
        <div className="h-[2px] w-full" style={{ background: CUBE_GRADIENT }} />
      )}
    </header>
  );
}
