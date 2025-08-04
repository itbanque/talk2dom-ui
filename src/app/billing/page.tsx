"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import SidebarLayout from "@/components/layout/SidebarLayout";
import { useEffect } from "react";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import FullPageLoader from "@/components/ui/FullPageLoader"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CreditModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  selectedCredit: number | null;
  setSelectedCredit: (value: number | null) => void;
}

function CreditModal({
  show,
  setShow,
  selectedCredit,
  setSelectedCredit,
}: CreditModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState("");
  const [paying, setPaying] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // Reset modal state when shown
  useEffect(() => {
    if (show) {
      setSelectedCredit(null);
      setClientSecret("");
      setCardholderName("");
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Purchase Credits</h2>
        <div className="space-y-3 mb-4">
          {[{ amount: 1000, price: 999 }, { amount: 2200, price: 1999 }, { amount: 5500, price: 4999 }].map((opt) => (
            <div
              key={opt.amount}
              className={`border rounded p-3 cursor-pointer ${selectedCredit === opt.amount ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
              onClick={async () => {
                setSelectedCredit(opt.amount);
                try {
                  const res = await fetch(`${DOMAIN}/api/v1/payment/create-payment-intent`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ number_of_credit: opt.amount })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.detail || "Failed to create payment intent");
                  setClientSecret(data.clientSecret);
                } catch (err: any) {
                  toast.error(err.message);
                }
              }}
            >
              <p className="font-medium">{opt.amount} credits</p>
              <p className="text-sm text-gray-500">${(opt.price / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cardholder-name">Name on Card</label>
          <input
            id="cardholder-name"
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Info</label>
          <div className="border border-gray-300 rounded px-3 py-2">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShow(false)}
            className="cursor-pointer px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            disabled={paying}
          >
            Cancel
          </button>
          <button
            disabled={!selectedCredit || !stripe || !elements || !cardholderName || paying}
            onClick={async () => {
              setPaying(true);
              try {
                const cardElement = elements?.getElement(CardElement);
                if (!stripe || !elements || !cardElement) throw new Error("Stripe not loaded");

                const result = await stripe.confirmCardPayment(clientSecret, {
                  payment_method: {
                    card: cardElement,
                    billing_details: {
                      name: cardholderName,
                    },
                  },
                });

                if (result.error) {
                  toast.error(result.error.message ?? "Payment failed");
                } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
                  toast.success("Payment successful!");
                  window.location.reload();
                }
              } catch (err: any) {
                toast.error(err.message);
              } finally {
                setPaying(false);
                setShow(false);
              }
            }}
            className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm disabled:opacity-50"
          >
            {paying ? "Processing..." : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<number | null>(null);

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "billing_page",
    });
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/subscription/history`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData?.detail || "Failed to fetch invoices");
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }

        setInvoices(data);
      } catch (error: any) {
        console.error("Failed to fetch invoices:", error);
        toast.error(`Failed to fetch invoices: ${error.message}`);
      } finally {
        setLoadingInvoices(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loadingInvoices) {
    return <FullPageLoader message="Loading billing details..." />;
  }
  return (
    <SidebarLayout>
      <Elements stripe={stripePromise}>
        <CreditModal
          show={showCreditModal}
          setShow={setShowCreditModal}
          selectedCredit={selectedCredit}
          setSelectedCredit={setSelectedCredit}
        />
      </Elements>
      <main className="min-h-screen bg-white text-gray-800 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Billing & Subscription</h1>

          {/* Current Plan */}
          <section className="mb-10 bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
            <p className="mb-2">Plan: <strong>{user?.plan || "N/A"}</strong></p>
            <p className="mb-2">Subscription Credits: <strong>{user?.subscription_credits ?? "N/A"}</strong></p>
            <p className="mb-2">One-Time Credits: <strong>{user?.one_time_credits ?? "N/A"}</strong></p>
            <p className="mb-2">Subscription Status: <strong>{user?.subscription_status ?? "N/A"}</strong></p>
            <p className="mb-4 text-sm text-gray-500">Next Billing Date: {user?.subscription_end_date?.split("T")[0] ?? "N/A"}</p>

            {user?.plan === "free" && (
              <p className="mb-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded">
                You are currently on the Free plan. Upgrade to unlock more features and increase your usage limits.
              </p>
            )}

            <div className={`flex gap-4 mt-4 ${user?.plan === "free" ? "justify-start" : "justify-start flex-wrap"}`}>
              <button
                className="cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
                onClick={() => {
                  window.dataLayer?.push({
                    event: "billing_upgrade_click"
                  });
                  router.push("/pricing");
                }}
              >
                Upgrade Plan
              </button>
              <button
                className="cursor-pointer border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 text-sm"
                onClick={() => {
                  window.dataLayer?.push({
                    event: "billing_add_credit_click"
                  });
                  setShowCreditModal(true);
                }}
                >
                Add Credits
              </button>
              {user?.plan !== "free" && (
                <>
                  <button
                    className="cursor-pointer border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 text-sm"
                    onClick={async () => {
                      try {
                        const res = await fetch(`${DOMAIN}/api/v1/subscription/cancel`, {
                          method: "POST",
                          credentials: "include",
                        });
                        const data = await res.json();
                        if (res.ok) {
                          window.dataLayer?.push({
                            event: "billing_cancel_subscription"
                          });
                          toast.success("Subscription cancellation scheduled.");
                        } else {
                          toast.error(data.detail || "Failed to cancel subscription.");
                        }
                      } catch (error) {
                        toast.error("Error cancelling subscription.");
                      }
                    }}
                  >
                    Cancel Subscription
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Billing History */}
          <section className="mb-10 bg-white border border-gray-200 rounded p-6">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <p className="text-sm text-gray-500 mb-2">  Displaying your 10 most recent invoices. For older billing records, please contact support.
</p>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-600">No billing history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Amount</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv: any) => (
                      <tr key={inv.id}>
                        <td className="px-4 py-2 border-b">{new Date(inv.created * 1000).toISOString().split("T")[0]}</td>
                        <td className="px-4 py-2 border-b">
                          ${(inv.amount_paid / 100).toFixed(2)} {inv.currency.toUpperCase()}
                        </td>
                        <td className="px-4 py-2 border-b capitalize">{inv.status}</td>
                        <td className="px-4 py-2 border-b">
                          <a
                            href={inv.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </SidebarLayout>
  );
}