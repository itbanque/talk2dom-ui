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
import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";
import Script from "next/script";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const PLAN_LEVEL: Record<string, number> = { developer: 1, pro: 2, enterprise: 3 };

export default function PricingPage() {
  const { user } = useUser();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "pricing_page",
    });

    // SEO: Pricing page meta
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/pricing`;

      // Title
      document.title = 'Pricing | Talk2Dom – AI-Powered UI Element Locator';

      // Meta description
      const ensureMeta = (name: string, content: string) => {
        let m = document.querySelector(`meta[name="${name}"]`);
        if (!m) {
          m = document.createElement('meta');
          m.setAttribute('name', name);
          document.head.appendChild(m);
        }
        m.setAttribute('content', content);
      };
      ensureMeta('description', 'Choose a plan for Talk2Dom. AI-powered element location for Selenium, Playwright, and more. Developer, Pro, and Enterprise options.');

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);

      // Open Graph
      const ensureOG = (property: string, content: string) => {
        let t = document.querySelector(`meta[property="${property}"]`);
        if (!t) {
          t = document.createElement('meta');
          t.setAttribute('property', property);
          document.head.appendChild(t);
        }
        t.setAttribute('content', content);
      };
      ensureOG('og:title', 'Pricing | Talk2Dom');
      ensureOG('og:description', 'Plans for AI-powered UI element location. Developer, Pro, and Enterprise.');
      ensureOG('og:type', 'website');
      ensureOG('og:url', url);
      ensureOG('og:image', `${origin}/images/video-fallback.png`);

      // Twitter Card
      const ensureTwitter = (name: string, content: string) => {
        let t = document.querySelector(`meta[name="${name}"]`);
        if (!t) {
          t = document.createElement('meta');
          t.setAttribute('name', name);
          document.head.appendChild(t);
        }
        t.setAttribute('content', content);
      };
      ensureTwitter('twitter:card', 'summary_large_image');
      ensureTwitter('twitter:title', 'Pricing | Talk2Dom');
      ensureTwitter('twitter:description', 'Select a plan for AI-powered element location.');
      ensureTwitter('twitter:image', `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  const confirmUpgrade = async () => {
    if (!selectedPlan) return;
    const isExistingSubscription = !!user?.subscription_status && user.subscription_status !== "canceled";
    const endpoint = isExistingSubscription
      ? `${DOMAIN}/api/v1/payment/update-subscription?plan=${selectedPlan}`
      : `${DOMAIN}/api/v1/payment/create-subscription?plan=${selectedPlan}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: null,
    });
    const data = await res.json();
    setClientSecret(data.clientSecret);
    setShowModal(true);
    setShowConfirmPopup(false);
    if (isExistingSubscription) {
        toast.success("Subscription updated.")
    } else {
        toast.success("Subscription updated. Please enter payment details.");
    }
  };

  const handleUpgrade = (plan: string) => {
    window.dataLayer?.push({
      event: "pricing_upgrade_click",
      plan,
    });
    setSelectedPlan(plan);
    setShowConfirmPopup(true);
  };

  if (user === undefined) return null; // Wait for user state to resolve

  return (
    <>
      <Navbar />
      <Script id="ldjson-product-developer" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Talk2Dom Developer Plan",
          "brand": {"@type": "Brand", "name": "Talk2Dom"},
          "description": "Developer plan for AI-powered UI element location.",
          "offers": {
            "@type": "Offer",
            "price": "9.99",
            "priceCurrency": "USD",
            "priceSpecification": {"@type": "UnitPriceSpecification", "price": 9.99, "priceCurrency": "USD", "billingDuration": "P1M"},
            "availability": "https://schema.org/InStock"
          }
        })}
      </Script>
      <Script id="ldjson-product-pro" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Talk2Dom Pro Plan",
          "brand": {"@type": "Brand", "name": "Talk2Dom"},
          "description": "Pro plan for teams using AI-powered UI element location.",
          "offers": {
            "@type": "Offer",
            "price": "39.99",
            "priceCurrency": "USD",
            "priceSpecification": {"@type": "UnitPriceSpecification", "price": 39.99, "priceCurrency": "USD", "billingDuration": "P1M"},
            "availability": "https://schema.org/InStock"
          }
        })}
      </Script>
      <Script id="ldjson-product-enterprise" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Talk2Dom Enterprise",
          "brand": {"@type": "Brand", "name": "Talk2Dom"},
          "description": "Enterprise partnership with SLA and deployment options.",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
        })}
      </Script>
      <main className="min-h-screen text-gray-900 dark:text-gray-100 px-4 py-10 md:px-6 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12">Choose Your Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">

          {/* Developer Plan */}
          <div className="w-full max-w-md md:max-w-xs border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Developer</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">For solo developers building serious projects</p>
            <div className="text-3xl font-bold mb-4">$9.99<span className="text-base font-medium">/mo</span></div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ 2,000 API calls / mo</li>
              <li>✅ Up to 10 projects</li>
              <li>✅ Up to 2 members / project</li>
            </ul>
            {user === null ? (
              <Link
                href="/register"
                className="mt-auto w-full text-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign up
              </Link>
            ) : user?.plan && PLAN_LEVEL[user.plan] > PLAN_LEVEL["developer"] ? (
              <button className="mt-auto w-full text-center px-4 py-2 rounded bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed" disabled>
                Included
              </button>
            ) : user?.plan === "developer" ? (
              <button className="mt-auto w-full text-center px-4 py-2 rounded bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("developer")}
                className="mt-auto w-full text-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ cursor: "pointer" }}
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className="w-full max-w-md md:max-w-xs border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Unlock full capacity for teams and advanced workflows</p>
            <div className="text-3xl font-bold mb-4">$39.99<span className="text-base font-medium">/mo</span></div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ 10,000 API calls / mo</li>
              <li>✅ Unlimited projects</li>
              <li>✅ Up to 10 members / project</li>
            </ul>
            {user === null ? (
              <Link
                href="/register"
                className="mt-auto w-full text-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign up
              </Link>
            ) : user?.plan && PLAN_LEVEL[user.plan] > PLAN_LEVEL["pro"] ? (
              <button className="mt-auto w-full text-center px-4 py-2 rounded bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed" disabled>
                Included
              </button>
            ) : user?.plan === "pro" ? (
              <button className="mt-auto w-full text-center px-4 py-2 rounded bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade("pro")}
                className="mt-auto w-full text-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ cursor: "pointer" }}
              >
                Upgrade
              </button>
            )}
          </div>

          {/* Enterprise Plan */}
          <div className="w-full max-w-md md:max-w-xs border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold mb-2">Enterprise</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Partner with us for stable, high‑quality delivery at scale.</p>
            <div className="text-3xl font-bold mb-4">Custom</div>
            <ul className="flex-1 space-y-2 mb-6 text-sm text-left">
              <li>✅ Unlimited API calls</li>
              <li>✅ Dedicated engineering partnership</li>
              <li>✅ High-quality, stable delivery across environments</li>
              <li>✅ SLA-backed support</li>
              <li>✅ Comprehensive self-host support</li>
              <li>✅ Architecture & workflow advisory</li>
            </ul>
            {user?.plan === "enterprise" ? (
              <button className="mt-auto w-full text-center px-4 py-2 rounded bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed" disabled>
                Current Plan
              </button>
            ) : (
              <a href="mailto:sales@talk2dom.com" className="mt-auto w-full text-center px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">Contact Sales</a>
            )}
          </div>
        </div>
      </main>
      {showConfirmPopup && (
        <ConfirmPopup
          selectedPlan={selectedPlan}
          onCancel={() => setShowConfirmPopup(false)}
          onConfirm={confirmUpgrade}
        />
      )}
      {showModal && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentModal
            selectedPlan={selectedPlan}
            onClose={() => setShowModal(false)}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    <Footer />
    </>
  );
}

function PaymentModal({
  selectedPlan,
  onClose,
  clientSecret,
}: {
  selectedPlan: string | null;
  onClose: () => void;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const cardholderName = (document.getElementById("card-name") as HTMLInputElement)?.value;
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: { name: cardholderName },
      },
    });
    setLoading(false);
    if (result.error) {
      toast.error("Payment failed!");
    } else if (result.paymentIntent?.status === "succeeded") {
      toast.success("Payment successful!");
      onClose();
      window.location.reload(); // 刷新页面
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Enter Payment Info for{" "}
          <span className="text-black underline uppercase">{selectedPlan}</span> Plan
        </h2>
        <div className="mb-4">
          <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name on Card</label>
          <input
            id="card-name"
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="mb-4 border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900">
          <CardElement />
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded w-full md:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            style={{ cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="px-4 py-2 rounded w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ cursor: "pointer" }}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}
function ConfirmPopup({
  selectedPlan,
  onCancel,
  onConfirm,
}: {
  selectedPlan: string | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Plan Upgrade</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to upgrade to the {selectedPlan} plan?</p>
        <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded cursor-pointer w-full md:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setConfirming(true);
              await onConfirm();
              setConfirming(false);
            }}
            className="px-4 py-2 rounded cursor-pointer flex items-center gap-2 w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ cursor: "pointer" }}
            disabled={confirming}
          >
            {confirming && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                ></path>
              </svg>
            )}
            {confirming ? "Upgrading..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}