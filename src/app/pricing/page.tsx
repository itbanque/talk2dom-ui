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
                style={{ cursor: "pointer" }}
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
                style={{ cursor: "pointer" }}
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
      {showConfirmPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Plan Upgrade</h2>
            <p className="mb-4">Are you sure you want to upgrade to the {selectedPlan} plan?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirmPopup(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer">Cancel</button>
              <button onClick={confirmUpgrade} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900 cursor-pointer" style={{ cursor: "pointer" }}>Confirm</button>
            </div>
          </div>
        </div>
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
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
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
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Enter Payment Info for {selectedPlan} Plan</h2>
        <div className="mb-4 border rounded p-2">
          <CardElement />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-900"
            style={{ cursor: "pointer" }}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
}