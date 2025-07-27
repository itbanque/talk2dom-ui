// /src/app/billing/success/page.tsx
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function BillingSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <FaCheckCircle className="text-green-500 text-5xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. Your account has been updated.</p>
      <Link
        href="/billing"
        className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700"
      >
        Go to Billing Dashboard
      </Link>
    </div>
  );
}