import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black">
      {/* Soft glow behind content */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-5">
        {/* Emoji */}
        <span className="text-5xl" style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,0.6))" }}>⚖️</span>

        {/* Main text */}
        <p className="text-4xl sm:text-5xl font-bold tracking-widest uppercase text-center text-white"
          style={{ textShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(99,102,241,0.2)" }}>
          For Education
        </p>
        <p className="text-4xl sm:text-5xl font-bold tracking-widest uppercase text-center text-white"
          style={{ textShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(99,102,241,0.2)" }}>
          Purpose Only
        </p>

        {/* Subtitle */}
        <p className="text-white/30 text-xs tracking-widest uppercase mt-2">
          Not actual legal advice
        </p>
      </div>
    </div>
  );
}

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashScreen onDone={() => setShowSplash(false)} />
  ) : (
    <App />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);