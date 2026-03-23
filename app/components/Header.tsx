"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Playground" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/memory-trainer", label: "Trainer" },
  { href: "/profile", label: "Profile" },
];

// WCA-standard Rubik's cube face colors
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
  const [activeColor, setActiveColor] = useState(() => randomCubeColor());
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setActiveColor((prev) => randomCubeColor(prev));
  }

  return (
    <header className="relative bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        {/* Site name */}
        <Link
          href="/"
          className="font-heading text-base leading-none tracking-tight text-[#FFD500] transition-opacity hover:opacity-80"
          style={{
            textShadow:
              "1px 1px 0 #C41E3A, 2px 2px 0 #C41E3A, 3px 3px 0 #C41E3A",
          }}
        >
          CubeMaxxed
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-7">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-sans text-[15px] font-medium transition-colors duration-300 ${
                  isActive ? "font-bold" : "text-zinc-400 hover:text-zinc-100"
                }`}
                style={isActive ? { color: activeColor } : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        {authButton}
      </div>

      {/* Cube-color accent bar */}
      <div className="h-[2px] w-full" style={{ background: CUBE_GRADIENT }} />
    </header>
  );
}
