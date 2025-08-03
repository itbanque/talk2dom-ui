"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import { useRouter } from "next/navigation";
import { DOMAIN } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useEffect } from "react";

const creditOptions = [
  { label: "$9.99 → 1000 credits", plan: "10" },
  { label: "$19.99 → 2100 credits", plan: "20" },
  { label: "$49.99 → 5500 credits", plan: "50" },
];

export default function AddCreditsPage() {
  const { user } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "add_credit_page",
    });
  }, []);

  const handleSelect = async (plan: string) => {
    try {
      window.dataLayer?.push({
        event: "add_credit_click",
        amount: plan,
      });
      const res = await fetch(`${DOMAIN}/api/v1/subscription/create-one-time?plan=${plan}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Power Up Your Workflow ⚡
          </h1>
          <p className="text-gray-600 text-lg">Select a credit pack and get back to building faster.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
          {creditOptions.map((option) => (
            <div key={option.plan}>
              <button
                onClick={() => isLoggedIn && handleSelect(option.plan)}
                disabled={!isLoggedIn}
                className={`rounded-2xl border border-transparent ${
                  isLoggedIn
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                    : "bg-gray-300 cursor-not-allowed"
                } text-white p-6 shadow-lg transition-all duration-200 w-full`}
              >
                <div className="text-2xl font-semibold mb-1">{option.label}</div>
                <p className="text-sm opacity-90">
                  {isLoggedIn ? "Click to proceed to secure checkout" : "Login to continue"}
                </p>
              </button>
              {!isLoggedIn && (
                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full transition duration-200"
                  >
                    Signup to Continue
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}