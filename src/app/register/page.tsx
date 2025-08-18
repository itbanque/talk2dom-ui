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
    <Navbar />
      <main>
        <div className="min-h-screen flex items-center justify-center dark:text-gray-100 px-4 py-6 md:py-12">
          <div className="w-full max-w-md border border-gray-200 dark:border-gray-700 p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">Create an Account</h1>
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
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223C2.946 9.41 2.25 10.7 2.25 12c0 0 3.75 7.5 9.75 7.5 2.01 0 3.827-.673 5.33-1.72M6.228 6.228A10.451 10.451 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a12.57 12.57 0 01-2.17 3.093M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                )}
              </button>
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
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                aria-pressed={showConfirmPassword}
                title={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223C2.946 9.41 2.25 10.7 2.25 12c0 0 3.75 7.5 9.75 7.5 2.01 0 3.827-.673 5.33-1.72M6.228 6.228A10.451 10.451 0 0112 4.5c6 0 9.75 7.5 9.75 7.5a12.57 12.57 0 01-2.17 3.093M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12 18 19.5 12 19.5 2.25 12 2.25 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                )}
              </button>
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
          <div className="my-4 md:my-6 flex items-center justify-center">
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow" />
            <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <div className="h-px bg-gray-300 dark:bg-gray-700 flex-grow" />
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