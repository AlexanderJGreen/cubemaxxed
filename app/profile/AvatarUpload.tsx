"use client";

import Image from "next/image";
import { useRef, useTransition } from "react";
import { uploadAvatar } from "./avatar-actions";

export default function AvatarUpload({
  avatarUrl,
  username,
  rankColor,
}: {
  avatarUrl: string | null;
  username: string;
  rankColor: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const initials = username.slice(0, 2).toUpperCase();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("avatar", file);
    startTransition(() => uploadAvatar(fd));
    // Reset so re-uploading the same file triggers onChange again
    e.target.value = "";
  }

  return (
    <div className="relative">
      {/* Avatar square */}
      <div
        className="relative overflow-hidden flex items-center justify-center group"
        style={{
          width: 88,
          height: 88,
          border: `2px solid ${rankColor}`,
          backgroundColor: "#0a0a12",
          opacity: isPending ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span
            className="font-heading leading-none select-none"
            style={{ fontSize: 26, color: rankColor }}
          >
            {initials}
          </span>
        )}

        {/* Hover overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          style={{ backgroundColor: "rgba(0,0,0,0.72)" }}
        >
          <span className="font-heading text-[8px] tracking-widest text-white leading-none">
            {isPending ? "UPLOADING" : "CHANGE"}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
