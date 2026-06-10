import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Send, LogOut, Scale, Trash2 } from "lucide-react";
import { getJudgement } from "../gemini";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  user: { firstName: string; lastName: string; email: string };
  onLogout: () => void;
}



export default function ChatBot({ user, onLogout }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNavMenu, setShowNavMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Video fade loop control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animId: number;
    let fadeTimeout: ReturnType<typeof setTimeout>;

    const handleLoadedData = () => {
      video.style.opacity = "0";
      video.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        video.style.opacity = "1";
      }, 100);
    };

    const checkFadeOut = () => {
      if (!video) return;
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= 0.5 && timeLeft > 0) {
        video.style.opacity = "0";
      }
      animId = requestAnimationFrame(checkFadeOut);
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      fadeTimeout = setTimeout(() => {
        video.currentTime = 0;
        video.play();
        setTimeout(() => {
          video.style.opacity = "1";
        }, 100);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("ended", handleEnded);
    animId = requestAnimationFrame(checkFadeOut);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(animId);
      clearTimeout(fadeTimeout);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      }));

      const response = await getJudgement(userMessage.content, chatHistory);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **Error**: ${err instanceof Error ? err.message : "An unexpected error occurred. Please try again."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\n/g, "<br />");
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: "hsl(260, 87%, 3%)" }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, transition: "opacity 0.5s ease" }}
        autoPlay
        muted
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
          type="video/mp4"
        />
      </video>

      {/* Blurred overlay shape */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 984,
          height: 527,
          opacity: 0.9,
          background: "#030712",
          filter: "blur(82px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="w-full py-5 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center">
              <Scale size={16} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Judge Divyansh</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <a href="https://indiacode.nic.in" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
              Indian Laws
            </a>
            <a href="https://legislative.gov.in/constitution-of-india" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
              Constitution
            </a>
            <a href="https://en.wikipedia.org/wiki/Bharatiya_Nyaya_Sanhita,_2023" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors rounded-lg hover:bg-white/5">
              Learning
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearChat}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground/70 hover:text-foreground"
              title="Clear Chat"
            >
              <Trash2 size={18} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                  {user.firstName[0]}
                </div>
                <span className="hidden sm:inline">{user.firstName}</span>
              </button>
              {showNavMenu && (
                <div className="absolute right-0 top-12 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-2 w-48 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-white/40">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Gradient divider */}
        <div className="w-full h-px mt-[3px] shrink-0" style={{ background: "linear-gradient(to right, transparent, rgba(240,234,214,0.2), transparent)" }} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden" style={{ overflow: "visible" }}>
          {!hasStarted ? (
            /* Hero State */
            <motion.div
              className="flex flex-col items-center text-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="font-medium leading-[1.02] tracking-[-0.024em]"
                style={{ fontFamily: "'General Sans', sans-serif", fontSize: "clamp(48px, 12vw, 180px)" }}
              >
                <span className="text-foreground">Judge </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)" }}
                >
                  AI
                </span>
              </h1>
              <p className="text-hero-sub text-lg leading-8 max-w-md mt-[9px] opacity-80">
                Confess your actions and receive verdicts<br />based on Indian Law & Constitution
              </p>

              {/* Input bar for initial state */}
              <div className="w-full max-w-2xl mt-10">
                <div className="relative liquid-glass rounded-2xl overflow-visible">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Confess your crime... e.g. "I stole candy from a mall"'
                    className="w-full bg-transparent text-foreground placeholder:text-foreground/30 px-6 py-4 pr-14 text-sm resize-none focus:outline-none"
                    rows={2}
                    maxLength={2000}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-xl text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {["I stole a car", "I committed tax fraud", "I shoplifted groceries", "I drove without a license"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="liquid-glass rounded-full px-4 py-2 text-xs text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Chat State */
            <div className="flex flex-col w-full max-w-3xl mx-auto flex-1 overflow-hidden px-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto chat-scroll py-6 space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-foreground"
                          : "liquid-glass text-foreground/90"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                          <Scale size={14} className="text-amber-400" />
                        <span className="text-xs font-semibold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, #6366f1, #a855f7, #fcd34d)" }}>Judge Divyansh</span>
                        </div>
                      )}
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                      />
                      <p className="text-[10px] text-white/20 mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="liquid-glass rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                        <Scale size={14} className="text-purple-400" />
                        <span className="text-xs font-semibold bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(to right, #6366f1, #a855f7, #fcd34d)" }}>Judge Divyansh is deliberating...</span>
                      </div>
                      <div className="flex items-center gap-1.5 py-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot-1" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot-2" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full typing-dot-3" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="shrink-0 pb-4 pt-2">
                <div className="relative liquid-glass rounded-2xl overflow-visible">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="State your next confession or ask about Indian law..."
                    className="w-full bg-transparent text-foreground placeholder:text-foreground/30 px-6 py-4 pr-14 text-sm resize-none focus:outline-none"
                    rows={2}
                    maxLength={2000}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-xl text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-center text-[10px] text-foreground/30 mt-2">
                  ⚖️ For educational purposes only. Not actual legal advice. Based on Indian Penal Code & BNS 2023.
                </p>
              </div>
            </div>
          )}
        </div>


      </div>

      {/* Click away to close nav menu */}
      {showNavMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNavMenu(false)} />
      )}
    </div>
  );
}