"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signup, checkUsernameAvailable } from "@/app/auth/actions";

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cube solving stages — 0 fields filled → fully scrambled, 4 → solid yellow
  const CUBE_STAGES = [
    ["#C41E3A","#FFD500","#0051A2","#FF5800","#009B48","#ffffff","#FFD500","#C41E3A","#0051A2"],
    ["#FFD500","#FFD500","#0051A2","#FF5800","#009B48","#ffffff","#FFD500","#C41E3A","#0051A2"],
    ["#FFD500","#FFD500","#FFD500","#FF5800","#FFD500","#ffffff","#FFD500","#C41E3A","#0051A2"],
    ["#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#C41E3A","#0051A2"],
    ["#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500","#FFD500"],
  ];

  const filledCount = [username, email, password, confirm].filter((v) => v.length > 0).length;
  const cubeColors = CUBE_STAGES[filledCount];
  const cubeSolved = filledCount === 4;

  const mismatch = confirm.length > 0 && password !== confirm;

  const usernameFormatError = !username
    ? null
    : /[^a-zA-Z0-9_]/.test(username)
    ? "Only letters, numbers, and underscores are allowed"
    : username.length < 3
    ? "Username must be at least 3 characters"
    : username.length > 24
    ? "Username must be 24 characters or fewer"
    : null;

  const usernameError = usernameFormatError ?? (usernameTaken ? "That username is already taken" : null);
  const usernameInvalid = usernameTouched && !!usernameError;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setUsernameTaken(false);

    if (!username || usernameFormatError) return;

    setUsernameChecking(true);
    debounceRef.current = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      setUsernameTaken(!available);
      setUsernameChecking(false);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const floaters = [
    { color: "#C41E3A", size: 6, left: "8%", delay: "0s", duration: "10s" },
    { color: "#FFD500", size: 10, left: "22%", delay: "2s", duration: "13s" },
    { color: "#009B48", size: 5, left: "60%", delay: "3.5s", duration: "11s" },
    { color: "#0051A2", size: 8, left: "78%", delay: "1s", duration: "14s" },
    { color: "#FF5800", size: 6, left: "90%", delay: "5s", duration: "10s" },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 overflow-hidden">
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 55%, transparent 100%)",
        }}
      />

      {/* Yellow glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,213,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating pixels */}
      {floaters.map((f, i) => (
        <div
          key={i}
          className="absolute bottom-0 pointer-events-none"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            backgroundColor: f.color,
            opacity: 0.5,
            animation: `floatUp ${f.duration} ${f.delay} linear infinite`,
          }}
        />
      ))}

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md p-8 sm:p-10"
        style={{
          backgroundColor: "#0f0f1a",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Pixel cube — solves as user fills in fields */}
        <div className="flex justify-center mb-6">
          <div
            className="grid grid-cols-3 gap-[2px] p-[3px] bg-[#1a1a26] transition-all duration-500"
            style={cubeSolved ? { boxShadow: "0 0 18px rgba(255,213,0,0.5)" } : undefined}
          >
            {cubeColors.map((color, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: color,
                  transition: "background-color 0.4s ease",
                }}
              />
            ))}
          </div>
        </div>

        <h1
          className="font-heading mb-2 text-center text-xl text-[#FFD500]"
          style={{ textShadow: "2px 2px 0 #C41E3A" }}
        >
          CREATE ACCOUNT
        </h1>
        <p className="font-sans mb-8 text-center text-sm text-zinc-500">
          Start your speedcubing journey today.
        </p>

        <form className="space-y-5">
          <div>
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setUsernameTouched(true)}
              className={`font-sans w-full border bg-[#0d0d14] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:ring-1 ${
                usernameInvalid
                  ? "border-red-700 focus:border-red-500 focus:ring-red-500"
                  : "border-white/10 focus:border-[#FFD500] focus:ring-[#FFD500]"
              }`}
              placeholder="speedcuber99"
            />
            {usernameInvalid ? (
              <p className="font-sans mt-1 text-xs text-red-500">{usernameError}</p>
            ) : usernameChecking ? (
              <p className="font-sans mt-1 text-xs text-zinc-500">Checking availability...</p>
            ) : username && !usernameFormatError && !usernameTaken ? (
              <p className="font-sans mt-1 text-xs text-green-500">Username is available</p>
            ) : (
              <p className="font-sans mt-1 text-xs text-zinc-600">
                3–24 characters. Letters, numbers, and underscores only.
              </p>
            )}
          </div>

          <div>
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-sans w-full border border-white/10 bg-[#0d0d14] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
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
                className="font-sans w-full border border-white/10 bg-[#0d0d14] px-4 py-3 pr-11 text-sm text-zinc-100 outline-none transition focus:border-[#FFD500] focus:ring-1 focus:ring-[#FFD500]"
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
            <label className="font-sans mb-1.5 block text-xs text-zinc-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`font-sans w-full border bg-[#0d0d14] px-4 py-3 pr-11 text-sm text-zinc-100 outline-none transition focus:ring-1 ${
                  mismatch
                    ? "border-red-700 focus:border-red-500 focus:ring-red-500"
                    : "border-white/10 focus:border-[#FFD500] focus:ring-[#FFD500]"
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
            <p className="font-sans border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            formAction={signup}
            disabled={mismatch || !!usernameInvalid || usernameChecking || usernameTaken}
            className="font-heading mt-2 w-full bg-[#FFD500] px-4 py-3.5 text-xs text-[#0d0d14] transition-all hover:brightness-110 active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ boxShadow: "3px 3px 0px #a38a00" }}
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
