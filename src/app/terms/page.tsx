// src/app/terms/page.tsx
"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function TermsPage() {
  return (
    <main className="min-h-screen !bg-white dark:!bg-black !text-gray-900 dark:!text-gray-100">
      <Navbar />
      <section className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

        <p className="mb-4">
          Welcome to Talk2Dom. By using our platform, you agree to the following terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using the service, you agree to be bound by these terms. If you do not agree, do not use the service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Account Responsibilities</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account and credentials, and for all activities that occur under your account.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Subscription and Billing</h2>
        <p className="mb-4">
          Certain features require a paid subscription. All fees are non-refundable unless required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Prohibited Uses</h2>
        <p className="mb-4">
          You may not use the service for any illegal or unauthorized purpose, including scraping, reverse-engineering, or reselling the service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Modifications</h2>
        <p className="mb-4">
          We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Contact</h2>
        <p className="mb-4">
          For questions about these terms, contact us at <a href="mailto:contact@itbanque.com" className="underline">contact@itbanque.com</a>.
        </p>
      </section>
      <Footer />
    </main>
  );
}