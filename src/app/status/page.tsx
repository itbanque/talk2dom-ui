"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function StatusPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="max-w-4xl mx-auto py-20 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">System Status</h1>
        <p className="text-green-600 text-lg font-semibold mb-6">✅ All Systems Operational</p>

        <div className="text-left">
          <h2 className="text-xl font-semibold mb-2">Components</h2>
          <ul className="mb-8">
            <li>🌐 Website — <span className="text-green-600">Operational</span></li>
            <li>🧠 AI Model API — <span className="text-green-600">Operational</span></li>
            <li>💳 Billing System — <span className="text-green-600">Operational</span></li>
          </ul>

          <h2 className="text-xl font-semibold mb-2">Past Incidents</h2>
          <ul>
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}