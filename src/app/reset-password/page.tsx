"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // If no token in URL, block form
  const tokenMissing = !token || token.trim().length === 0;

  useEffect(() => {
    if (tokenMissing) {
      toast.error("Reset link is invalid or expired. Please request a new one.");
    }
  }, [tokenMissing]);

  const minLen = 8;
  const tooShort = password.length > 0 && password.length < minLen;
  const mismatch = confirm.length > 0 && password !== confirm;
  const canSubmit = !submitting && !tokenMissing && password.length >= minLen && password === confirm;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${DOMAIN}/api/v1/auth/email/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error((data && (data.detail || data.message)) || "Failed to reset password");
        return;
      }

      setDone(true);
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const SuccessCard = (
    <div className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">Password reset successfully</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center">You can now sign in with your new password.</p>
      <div className="mt-6 grid grid-cols-1 gap-3">
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-primary text-primary-foreground py-3 rounded hover:bg-primary/90 transition cursor-pointer"
        >
          Go to Login
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition text-black dark:text-gray-100 cursor-pointer"
        >
          Back Home
        </button>
      </div>
    </div>
  );

  const FormCard = (
    <div className="w-full max-w-md p-6 md:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Reset your password</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New password</label>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="new-password"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`At least ${minLen} characters`}
              disabled={submitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? (
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
          {tooShort && (
            <p className="mt-1 text-xs text-red-600">Password must be at least {minLen} characters.</p>
          )}
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm password</label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base pr-12"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-type new password"
              disabled={submitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
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
          {mismatch && (
            <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-primary text-primary-foreground py-3 rounded hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>Resetting...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
        <button onClick={() => router.push("/login")} className="underline underline-offset-2 hover:text-black dark:hover:text-white">Back to login</button>
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
