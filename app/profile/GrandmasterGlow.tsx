"use client";

export function GrandmasterGlow({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes gm-glow {
          0%   { box-shadow: 0 0 32px rgba(196,30,58,0.8);  border-color: rgba(196,30,58,0.20);  }
          33%  { box-shadow: 0 0 32px rgba(0,81,162,0.8);   border-color: rgba(0,81,162,0.20);   }
          66%  { box-shadow: 0 0 32px rgba(255,213,0,0.8);  border-color: rgba(255,213,0,0.20);  }
          100% { box-shadow: 0 0 32px rgba(196,30,58,0.8);  border-color: rgba(196,30,58,0.20);  }
        }
        .gm-glow {
          animation: gm-glow 4s linear infinite;
        }
      `}</style>
      <div
        className="gm-glow relative overflow-hidden p-8 sm:p-10"
        style={{ border: "1px solid transparent", backgroundColor: "#0f0f1a" }}
      >
        {children}
      </div>
    </>
  );
}
