import { useState, useEffect } from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import ChatBot from "./pages/ChatBot";
import {
  onAuthChange,
  loginWithEmail,
  signUpWithEmail,
  loginWithGoogle,
  logout,
  initAnalytics,
  type User,
} from "./firebase";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

type Page = "signup" | "login" | "chat";

function getUserData(user: User): UserData {
  const displayName = user.displayName ?? "";
  const parts = displayName.trim().split(" ");
  const firstName = parts[0] ?? "User";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName, email: user.email ?? "" };
}

export default function App() {
  const [page, setPage] = useState<Page>("signup");
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initAnalytics().catch(console.error);

    // Listen to Firebase auth state — handles session persistence automatically
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(getUserData(firebaseUser));
        setPage("chat");
      } else {
        setUser(null);
        setPage("login");
      }
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setError("");
    setLoading(true);
    try {
      await signUpWithEmail(data.firstName, data.lastName, data.email, data.password);
      // onAuthChange will handle setting user + page
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      // onAuthChange will handle setting user + page
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        setError("No account found or incorrect password. Please try again.");
      } else if (code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait and try again.");
      } else {
        setError(err instanceof Error ? err.message : "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      // onAuthChange will handle setting user + page
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === "auth/popup-closed-by-user") {
        // User closed popup — not really an error
      } else {
        setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setError("");
    // onAuthChange will handle setting user + page
  };

  // Don't render until Firebase has checked auth state
  if (!authReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (page === "chat" && user) {
    return <ChatBot user={user} onLogout={handleLogout} />;
  }

  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onSignUp={() => { setError(""); setPage("signup"); }}
        error={error}
        loading={loading}
      />
    );
  }

  return (
    <SignUp
      onSignUp={handleSignUp}
      onGoogleLogin={handleGoogleLogin}
      onLogin={() => { setError(""); setPage("login"); }}
      error={error}
      loading={loading}
    />
  );
}