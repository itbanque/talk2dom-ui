"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function PrivacyPage() {
  return (
    <main className="min-h-screen !bg-white dark:!bg-black !text-gray-900 dark:!text-gray-100">
      <Navbar />
      <section className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          We value your privacy and are committed to protecting your personal data. This policy outlines how we handle your information.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Information Collection</h2>
        <p className="mb-4">
          We collect basic account information such as your email and name when you register. We may also collect usage data to improve our service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">2. Use of Information</h2>
        <p className="mb-4">
          Your data is used to provide, maintain, and improve our services. We do not sell your data to third parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">3. Cookies</h2>
        <p className="mb-4">
          We use cookies to personalize content and analyze traffic. You can control cookie preferences in your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your information from unauthorized access.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal data. Contact us to exercise your rights.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy from time to time. Continued use of our service implies acceptance of any changes.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact</h2>
        <p className="mb-4">
          For questions regarding this policy, contact us at <a href="mailto:contact@itbanque.com" className="underline">contact@itbanque.com</a>.
        </p>
      </section>
      <Footer />
    </main>
  );
}