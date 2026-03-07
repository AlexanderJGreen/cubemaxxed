"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/playground", label: "Playground" },
  { href: "/algorithms", label: "Algorithms" },
  { href: "/profile", label: "Profile" },
];

// WCA-standard Rubik's cube face colors
const CUBE_GRADIENT =
  "linear-gradient(to right, #C41E3A, #FF5800, #FFD500, #009B48, #0051A2, #ffffff)";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative bg-[#0a0a11]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Site name */}
        <Link
          href="/"
          className="font-heading text-sm leading-none tracking-tight text-[#FFD500] transition-opacity hover:opacity-80"
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
                className={`font-sans text-sm transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Cube-color accent bar */}
      <div className="h-[2px] w-full" style={{ background: CUBE_GRADIENT }} />
    </header>
  );
}
