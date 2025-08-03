"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/context/UserContext";
import { DOMAIN } from "@/lib/constants";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";

const PLAN_LEVEL: Record<string, number> = { developer: 1, pro: 2, enterprise: 3 };

export default function PricingPage() {
  const { user } = useUser();

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "pricing_page",
    });
  }, []);

  const handleUpgrade = async (plan: string) => {
    try {
      window.dataLayer?.push({
        event: "pricing_upgrade_click",
        plan: plan,
      });
      const res = await fetch(`${DOMAIN}/api/v1/subscription/create-subscription?plan=${plan}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create subscription");
      const { checkout_url } = await res.json();
      window.location.href = checkout_url;
    } catch (error) {
      console.error("Upgrade failed:", error);
    }
  };

  if (user === undefined) return null; // Wait for user state to resolve

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-gray-800 px-6 py-24 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          {/* Developer Plan */}
          <div className="w-full max-w-xs border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Developer</h2>
            <p className="text-gray-600 mb-4">For solo developers building serious projects</p>
            <div className="text-3xl font-bold mb-4">$9.99<span className="text-base font-medium">/mo</span></div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ 2,000 API calls / mo</li>
              <li>✅ Up to 10 projects</li>
              <li>✅ Up to 2 members / project</li>
            </ul>
            {user === null ? (
              <Link
                href="/register"
                className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-gray-900"
              >
                Sign up
              </Link>
            ) : user?.plan && PLAN_LEVEL[user.plan] > PLAN_LEVEL["developer"] ? (
              <button className="mt-auto text-center bg-gray-200 text-gray-400 py-2 rounded cursor-not-allowed" disabled>
                Included
              </button>
            ) : user?.plan === "developer" ? (
              <button className="mt-auto text-center bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("developer")}
                className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-gray-900"
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="w-full max-w-xs border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <p className="text-gray-600 mb-4">Unlock full capacity for teams and advanced workflows</p>
            <div className="text-3xl font-bold mb-4">$39.99<span className="text-base font-medium">/mo</span></div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ 10,000 API calls / mo</li>
              <li>✅ Unlimited projects</li>
              <li>✅ Up to 10 members / project</li>
            </ul>
            {user === null ? (
              <Link
                href="/register"
                className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-gray-900"
              >
                Sign up
              </Link>
            ) : user?.plan && PLAN_LEVEL[user.plan] > PLAN_LEVEL["pro"] ? (
              <button className="mt-auto text-center bg-gray-200 text-gray-400 py-2 rounded cursor-not-allowed" disabled>
                Included
              </button>
            ) : user?.plan === "pro" ? (
              <button className="mt-auto text-center bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("pro")}
                className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-gray-900"
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Enterprise Plan */}
          <div className="w-full max-w-xs border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Enterprise</h2>
            <p className="text-gray-600 mb-4">Custom needs, team scaling, and dedicated support</p>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ Unlimited API calls</li>
              <li>✅ Role-based access control</li>
              <li>✅ SLA support & self-host options</li>
            </ul>
            {user?.plan === "enterprise" ? (
              <button className="mt-auto text-center bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <a href="mailto:sales@talk2dom.com" className="mt-auto text-center bg-black text-white py-2 rounded hover:bg-gray-900">Contact Sales</a>
            )}
          </div>
        </div>
      </main>
    <Footer />
    </>
  );
}