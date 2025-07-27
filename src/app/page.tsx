"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";



export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Talk to Your DOM with AI</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          Say goodbye to fragile selectors. Describe the element you want—our AI finds it for you. No more tweaking XPaths or CSS.
        </p>
        <p className="text-sm text-gray-600 max-w-2xl mb-2">
          Built for automation engineers, QA testers, web scrapers, and devs who work with fast-changing UIs. Works with any tool, in any language.
        </p>
        <div className="flex gap-4">
          <a href="/register" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Get Started
          </a>
          <a href="/docs" className="border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Learn More
          </a>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">No Selectors Needed</h2>
            <p>Stop writing brittle selectors. Just describe the UI you see.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Developer Friendly</h2>
            <p>Integrates with any frontend or testing tool, via simple REST APIs.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Real-Time Feedback</h2>
            <p>Inspect, locate, and test instantly—no more reloading or guessing.</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Element-Level Intelligence for Real Workflows</h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-8 text-left">
          <div className="border p-6 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Cross-Platform Element Location</h3>
            <p>We don’t write test cases—we help you locate the elements. Describe them in natural language, and our API finds them for you. Works with Playwright, Selenium, Cypress, and more.</p>
          </div>
          <div className="border p-6 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2">AI-Powered Web Scraping</h3>
            <p>No need to fight layout shifts or class changes. Just say "get the product price" and we’ll locate it—across sessions and versions.</p>
          </div>
          <div className="border p-6 rounded shadow-sm">
            <h3 className="font-semibold text-lg mb-2">In-App User Guidance</h3>
            <p>Power onboarding flows and tooltips that always find the right element—even when the UI changes.</p>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Free, Scale as You Grow</h2>
          <p className="text-gray-700 mb-6">
            Get started instantly with our <strong>Free plan</strong> — includes essential features to explore Talk2Dom without commitment. Upgrade anytime for more projects and team features.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            View All Plans
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}