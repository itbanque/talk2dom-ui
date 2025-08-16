"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="max-w-3xl mx-auto pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 text-left">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">About Talk2Dom</h1>
        <p className="text-sm md:text-base text-gray-500 mb-6">A lean, one‑person company focused on reliable UI automation.</p>

        <p className="mb-6 text-base md:text-lg leading-relaxed">
          <strong>Talk2Dom</strong> is a focused service that turns natural‑language descriptions into robust UI element locators. It’s built and maintained by one person—me—so you get fast iteration, clear ownership, and enterprise‑grade attention to reliability.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3">What Talk2Dom does</h2>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed">
          <li><strong>Stable element discovery.</strong> Reduce flaky tests by generating resilient, context‑aware locators.</li>
          <li><strong>Fits your stack.</strong> Use a simple API from Playwright/Selenium—no heavy platform required.</li>
          <li><strong>Faster maintenance.</strong> Spend less time fixing selectors, more time shipping quality.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3">Who it’s for</h2>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed">
          <li>Anyone building or testing web applications who needs more reliable element location.</li>
          <li>Startups that want strong coverage without heavy tooling.</li>
          <li>Platforms seeking a pragmatic AI layer for UI automation.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3">My approach</h2>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed">
          <li><strong>Quality first.</strong> Reproducible pipelines, clear SLAs, and regression safeguards.</li>
          <li><strong>Automation over repetition.</strong> Codify processes to eliminate manual toil.</li>
          <li><strong>Observability & Eval.</strong> Metrics, tracing, and evaluation to keep changes safe.</li>
          <li><strong>Pragmatic AI.</strong> Use AI where it helps—never AI for AI’s sake.</li>
        </ul>

        

        <h2 className="text-xl md:text-2xl font-semibold mt-8 md:mt-10 mb-3">How we can work together</h2>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed">
          <li><strong>Hosted API</strong> for element location (easy integration).</li>
          <li><strong>Enterprise/on‑prem</strong> deployment for regulated or air‑gapped environments.</li>
          <li><strong>Advisory & integration</strong> to harden your test architecture.</li>
          <li><strong>Evaluation & regression</strong> setup to keep quality stable as you evolve.</li>
        </ul>

        <p className="mt-8 md:mt-10 mb-4 text-base md:text-lg leading-relaxed">
          If you want a lean, practical way to improve how you build and test web applications—whether with Talk2Dom or tailored solutions—let’s talk.
        </p>
        <div className="mt-2">
          <a href="mailto:contact@itbanque.com" className="inline-block text-blue-600 underline hover:text-blue-800 break-words">contact@itbanque.com</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}