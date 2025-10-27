"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DOMAIN } from "@/lib/constants";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";



export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/projects");
    }
    if (!loading && !user) {
      window.dataLayer?.push({
        event: "page_view",
        page_name: "register",
      });
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <div className="h-screen w-screen bg-white dark:bg-gray-900" />;
  }

  
  const handleGoogleLogin = () => {
    window.dataLayer?.push({
      event: "register_submit",
      method: "google",
    });
    window.location.href = `${DOMAIN}/api/v1/auth/google/login`;
  };

  const handleGithubLogin = () => {
    window.dataLayer?.push({
      event: "register_submit",
      method: "github",
    });
    window.location.href = `${DOMAIN}/api/v1/auth/github/login`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      window.dataLayer?.push({
        event: "register_submit",
        method: "email",
      });
      const res = await fetch(`${DOMAIN}/api/v1/auth/email/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        toast.error(error.detail || "Registration failed");
        return;
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div className="sticky top-0 z-50 w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800">
      <div className="overflow-x-auto">
        <div className="min-w-max text-sm py-2 px-4 whitespace-nowrap">
          ⚠️ 目前不支持邮箱直接注册，请使用 Google 或 GitHub 登录 · Email registration is temporarily disabled. Please use Google or GitHub to continue.
        </div>
      </div>
    </div>
    <Navbar />
      <main>
        <div className="min-h-screen flex items-center justify-center dark:text-gray-100 px-4 py-6 md:py-12">
          <div className="w-full max-w-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">Create an Account</h1>
            {/* Email registration temporarily disabled */}
            {false && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  autoFocus
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="Email"
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={false}
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    className="w-full px-3 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-600 text-sm font-medium">{error}</div>
                )}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
                </button>
              </form>
            )}
            <div role="alert" aria-live="polite" className="text-center text-gray-600 dark:text-gray-300 py-4">
              Email registration is currently unavailable. Please use Google or GitHub.
            </div>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleGithubLogin}
            className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition text-gray-900 dark:text-gray-100 cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>
          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-300">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline dark:text-blue-400">Log in</a>
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}