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
    return <div className="h-screen w-screen bg-white" />;
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 md:py-12">
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded shadow-md">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center text-black">Create an Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="Email"
                className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full px-3 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500 text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-black focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="w-full px-3 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500 text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 hover:text-black focus:outline-none"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            <button
              type="submit"
              className={`w-full bg-black text-white py-3 rounded transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 cursor-pointer'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="my-4 md:my-6 flex items-center justify-center">
            <div className="h-px bg-gray-300 flex-grow" />
            <span className="mx-3 text-sm text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-grow" />
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-black cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
          <button
            onClick={handleGithubLogin}
            className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-300 px-4 py-3 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition text-black cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account? <a href="/login" className="text-black hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}