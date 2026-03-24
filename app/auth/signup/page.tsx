"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/auth/actions";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1
          className="font-heading mb-2 text-center text-xl text-[#FFD500]"
          style={{ textShadow: "2px 2px 0 #C41E3A" }}
        >
          CREATE ACCOUNT
        </h1>
        <p className="font-sans mb-8 text-center text-sm text-zinc-500">
          Start your speedcubing journey today.
        </p>

        <form className="space-y-4">
          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              minLength={3}
              maxLength={24}
              pattern="[a-zA-Z0-9_]+"
              className="font-sans w-full rounded border border-zinc-700 bg-[#12121f] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
              placeholder="speedcuber99"
            />
            <p className="font-sans mt-1 text-xs text-zinc-600">
              Letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="font-sans w-full rounded border border-zinc-700 bg-[#12121f] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-sans w-full rounded border border-zinc-700 bg-[#12121f] px-4 py-3 pr-11 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            <p className="font-sans mt-1 text-xs text-zinc-600">
              Minimum 6 characters
            </p>
          </div>

          <div>
            <label className="font-sans mb-1 block text-xs text-zinc-400">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`font-sans w-full rounded border bg-[#12121f] px-4 py-3 pr-11 text-sm text-zinc-100 outline-none transition focus:ring-1 ${
                  mismatch
                    ? "border-red-700 focus:border-red-500 focus:ring-red-500"
                    : "border-zinc-700 focus:border-[#FFD500] focus:ring-[#FFD500]"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {mismatch && (
              <p className="font-sans mt-1 text-xs text-red-500">
                Passwords do not match
              </p>
            )}
          </div>

          {error && (
            <p className="font-sans rounded border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            formAction={signup}
            disabled={mismatch}
            className="font-heading mt-2 w-full rounded bg-[#FFD500] px-4 py-3 text-xs text-black transition hover:bg-yellow-400 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            CREATE ACCOUNT
          </button>
        </form>

        <p className="font-sans mt-6 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#FFD500] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
