import { useState } from "react";
import { motion } from "motion/react";
import { Circle, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: (data: { email: string; password: string }) => void;
  onGoogleLogin: () => void;
  onSignUp: () => void;
  error?: string;
  loading?: boolean;
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login({ onLogin, onGoogleLogin, onSignUp, error, loading }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* Left Column - Hero */}
      <div className="relative hidden w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full lg:flex">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>
        <motion.div className="z-10 w-full max-w-xs space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}>
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Circle className="fill-white text-white" size={20} />
            <span className="text-xl font-semibold tracking-tight">Divyansh</span>
          </motion.div>
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap">Welcome Back</h1>
            <p className="text-white/60 text-sm leading-relaxed px-4">Sign in to access Judge AI and get verdicts based on Indian law.</p>
          </motion.div>
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3">
              <span className="text-2xl">⚖️</span>
              <span className="text-sm font-medium text-white/90">AI Judge powered by Indian Constitution</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3">
              <span className="text-2xl">📜</span>
              <span className="text-sm font-medium text-white/90">IPC & BNS 2023 verdicts</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden">
        <motion.div className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <div>
            <h2 className="text-3xl font-medium tracking-tight">Sign In</h2>
            <p className="text-white/40 text-sm mt-2">Enter your credentials to access the courtroom.</p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-black border border-white/10 rounded-xl h-12 px-4 hover:bg-white/5 transition-all text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-4 text-xs font-medium text-white/40 uppercase tracking-widest">Or</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-gray border-none rounded-xl h-11 px-4 pr-12 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] mt-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40">
            Don't have an account?{" "}
            <button onClick={onSignUp} className="text-white hover:text-white/80 underline underline-offset-4 transition-colors">
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </main>
  );
}