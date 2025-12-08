"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/projects");
    }
    if (!loading && !user) {
      window.dataLayer?.push({
        event: "page_view",
        page_name: "login",
      });
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <div className="h-screen w-screen bg-white dark:bg-gray-900" />;
  }

  const handleGoogleLogin = () => {
    window.dataLayer?.push({
      event: "login_submit",
      method: "google",
    });
    window.location.href = `${DOMAIN}/api/v1/auth/google/login`;
  };

  const handleGithubLogin = () => {
    window.dataLayer?.push({
      event: "login_submit",
      method: "github",
    });
    window.location.href = `${DOMAIN}/api/v1/auth/github/login`;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 py-12 text-gray-900 dark:from-[#080b16] dark:via-[#070a14] dark:to-[#060911] dark:text-gray-100">
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-gray-200/60 bg-white/90 p-8 shadow-xl shadow-indigo-500/10 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <div className="mb-6 text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Login
              </p>
              <h1 className="text-3xl font-semibold">Welcome back</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use your Google or GitHub account to access Talk2Dom.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="GitHub"
                  className="h-5 w-5"
                />
                Continue with GitHub
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-white/15 dark:bg-white/5 dark:text-gray-200">
              Email and password login are not available yet. We&apos;ll add it when ready.
            </div>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
              New to Talk2Dom?{" "}
              <a href="/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-300">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
