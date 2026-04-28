"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { signout } from "@/app/auth/actions";

export default function AvatarDropdown({
  username,
  avatarUrl,
  rankColor,
}: {
  username: string;
  avatarUrl: string | null;
  rankColor: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative overflow-hidden flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
        style={{
          width: 32,
          height: 32,
          border: `1.5px solid ${rankColor}`,
          backgroundColor: "#0a0a12",
          boxShadow: open ? `0 0 12px ${rankColor}55` : undefined,
        }}
        aria-label="Open user menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={32}
            height={32}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <span
            className="font-heading text-[8px] leading-none select-none"
            style={{ color: rankColor }}
          >
            {initials}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 z-50 mt-2"
          style={{
            width: 180,
            backgroundColor: "#0f0f1a",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.6)",
          }}
        >
          {/* Username */}
          <div
            className="px-4 py-3 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Mini avatar */}
            <div
              className="relative overflow-hidden flex items-center justify-center shrink-0"
              style={{
                width: 22,
                height: 22,
                border: `1px solid ${rankColor}`,
                backgroundColor: "#0a0a12",
              }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username}
                  width={22}
                  height={22}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <span
                  className="font-heading text-[7px] leading-none select-none"
                  style={{ color: rankColor }}
                >
                  {initials}
                </span>
              )}
            </div>
            <span className="font-heading text-[9px] leading-none text-white truncate">
              {username}
            </span>
          </div>

          {/* Nav links */}
          <div className="py-1">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/profile", label: "Profile" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 font-sans text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <form action={signout}>
              <button
                type="submit"
                className="w-full text-left px-4 py-2.5 font-sans text-sm text-zinc-500 hover:text-[#C41E3A] hover:bg-[#C41E3A]/[0.06] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
