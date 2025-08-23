"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Prefill from query (?email=...)
  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${DOMAIN}/api/v1/auth/email/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.detail || data?.message || "Failed to send reset email");
        return;
      }

      setDone(true);
    } catch (err: any) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const SuccessCard = (
    <div className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">Password reset link sent</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
        If an account is associated with <span className="font-medium">{email}</span>, we’ve sent a secure link to reset your password. It may take a few minutes to arrive — please check your inbox and spam folder.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-primary text-primary-foreground py-3 rounded hover:bg-primary/90 transition cursor-pointer"
        >
          Back to Login
        </button>
        <button
          onClick={() => setDone(false)}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition text-black dark:text-gray-100 cursor-pointer"
        >
          Send Again
        </button>
      </div>
    </div>
  );

  const FormCard = (
    <div className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Forgot your password?</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          disabled={!canSubmit}
          aria-busy={isSubmitting}
        >
          {isSubmitting && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          <span>{isSubmitting ? "Sending..." : "Send reset link"}</span>
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        <a href="/login" className="underline underline-offset-2 hover:text-black dark:hover:text-white">Back to login</a>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center dark:text-gray-100 px-4 py-6 md:py-12">
        {done ? SuccessCard : FormCard}
      </main>
      <Footer />
    </>
  );
}