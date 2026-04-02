"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Playground" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/memory-trainer", label: "Trainer" },
  { href: "/profile", label: "Profile" },
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
  authButton,
}: {
  authButton?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeColor, setActiveColor] = useState(CUBE_COLORS[0]);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActiveColor(randomCubeColor());
  }, []);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveColor((prev) => randomCubeColor(prev));
    setMenuOpen(false);
  }

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="relative bg-[#0d0d14] border-b border-white/[0.04]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Site name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-base leading-none tracking-tight text-[#FFD500] transition-opacity hover:opacity-80 shrink-0"
          style={{ textShadow: "1px 1px 0 #C41E3A, 2px 2px 0 #C41E3A, 3px 3px 0 #C41E3A" }}
        >
          {/* Pixel cube icon */}
          <div className="grid grid-cols-3 gap-[2px] p-[2px] bg-[#1a1a26] shrink-0">
            {["#C41E3A","#FFD500","#0051A2","#FF5800","#009B48","#ffffff","#FFD500","#C41E3A","#0051A2"].map((color, i) => (
              <div key={i} style={{ width: 5, height: 5, backgroundColor: color }} />
            ))}
          </div>
          CubeMaxxed
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.filter(l => l.href !== "/profile").map(({ href, label }) => {
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
                    style={{ background: `linear-gradient(to right, transparent, ${activeColor}70, transparent)` }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right — profile + auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/profile"
            className={`relative font-sans text-[15px] font-medium transition-colors duration-300 pb-1 ${
              pathname === "/profile" ? "font-bold" : "text-zinc-400 hover:text-zinc-100"
            }`}
            style={pathname === "/profile" ? { color: activeColor } : undefined}
          >
            Profile
            {pathname === "/profile" && (
              <span
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${activeColor}70, transparent)` }}
              />
            )}
          </Link>
          {authButton}
        </div>

        {/* Mobile right — auth + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {authButton}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={menuOpen ? { transform: "translateY(7px) rotate(45deg)" } : undefined}
            />
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={menuOpen ? { opacity: 0 } : undefined}
            />
            <span
              className="block h-[2px] w-5 bg-zinc-400 transition-all duration-200"
              style={menuOpen ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined}
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
        </div>
      )}

      {/* Cube-color accent bar */}
      <div className="h-[2px] w-full" style={{ background: CUBE_GRADIENT }} />
    </header>
  );
}
