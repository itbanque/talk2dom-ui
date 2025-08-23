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
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {[{ amount: 1000, price: 999 }, { amount: 2200, price: 1999 }, { amount: 6000, price: 4999 }].map((opt) => (
            <div
              key={opt.amount}
              className={`border rounded p-3 cursor-pointer ${selectedCredit === opt.amount ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}`}
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
              <p className="font-medium">{opt.amount} calls</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">${(opt.price / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="cardholder-name">Name on Card</label>
          <input
            id="cardholder-name"
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Info</label>
          <div className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
          <button
            onClick={() => setShow(false)}
            className="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-sm w-full md:w-auto"
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
            className="cursor-pointer px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded text-sm disabled:opacity-50 w-full md:w-auto"
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
      <main className="min-h-screen text-gray-900 dark:text-gray-100 px-4 py-4 md:px-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-gray-100">Billing & Subscription</h1>

          {/* Current Plan */}
          <section className="mb-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 md:p-6 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Current Plan</h2>
            <p className="mb-2">Plan: <strong>{user?.plan || "N/A"}</strong></p>
            <p className="mb-2">Subscription Calls: <strong>{user?.subscription_credits ?? "N/A"}</strong></p>
            <p className="mb-2">One-Time Calls: <strong>{user?.one_time_credits ?? "N/A"}</strong></p>
            <p className="mb-2">Subscription Status: <strong>{user?.subscription_status ?? "N/A"}</strong></p>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Next Billing Date: {user?.subscription_end_date?.split("T")[0] ?? "N/A"}</p>

            {user?.plan === "free" && (
              <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded">
                You are currently on the Free plan. Upgrade to unlock more features and increase your usage limits.
              </p>
            )}

            <div className={`flex flex-col sm:flex-row gap-2 mt-4 ${user?.plan === "free" ? "" : "flex-wrap"}`}>
              <button
                className="cursor-pointer px-4 py-2 rounded text-sm w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm w-full md:w-auto"
                onClick={() => {
                  window.dataLayer?.push({
                    event: "billing_add_credit_click"
                  });
                  setShowCreditModal(true);
                }}
                >
                Add Calls
              </button>
              {user?.plan !== "free" && (
                <>
                  <button
                    className="cursor-pointer border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm w-full md:w-auto"
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
          <section className="mb-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 md:p-6 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Billing History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">  Displaying your 10 most recent invoices. For older billing records, please contact support.
</p>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300">No billing history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs md:text-sm text-left">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">Date</th>
                      <th className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">Amount</th>
                      <th className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">Status</th>
                      <th className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv: any) => (
                      <tr key={inv.id}>
                        <td className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">{new Date(inv.created * 1000).toISOString().split("T")[0]}</td>
                        <td className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">
                          ${(inv.amount_paid / 100).toFixed(2)} {inv.currency.toUpperCase()}
                        </td>
                        <td className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700 capitalize">{inv.status}</td>
                        <td className="px-3 py-2 md:px-4 border-b border-gray-200 dark:border-gray-700">
                          <a
                            href={inv.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
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