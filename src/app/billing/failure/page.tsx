// /src/app/billing/failure/page.tsx
import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";

export default function BillingFailurePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
      <FaTimesCircle className="text-red-500 text-5xl mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
      <p className="mb-6">Something went wrong. Please try again or contact support.</p>
      <Link
        href="/billing"
        className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700"
      >
        Back to Billing
      </Link>
    </div>
  );
}