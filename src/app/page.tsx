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
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-32 pb-20 bg-white text-center">
        {/* Left: Text & CTA */}
        <div className="w-full md:w-1/2 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Find UI Elements<br /> with <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent animate-pulse">AI</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            No more fragile locators, No more manual tweaking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition w-fit mx-auto sm:mx-0"
            >
              Start for Free
            </a>
          </div>
          <div className="mt-4 mb-12 text-sm text-gray-500">
            ⭐️ Trusted by automation engineers and QA teams
          </div>
        </div>

        {/* Right: Video or Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-12 md:mb-0">
          <div className="relative rounded-xl overflow-hidden shadow-xl max-w-5xl w-full">
            <video
              src="/videos/demo.webm"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/video-fallback.png"
              className="w-full h-[460px] object-cover rounded-xl shadow-md"
              controlsList="nodownload"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Talk2Dom?</h2>
          <p className="text-lg text-gray-300">Experience a new way to interact with the DOM across any platform or framework.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md hover:bg-white/10 transition border border-white/10 shadow-md">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Resilient Element Location</h3>
            <p className="text-gray-300 text-sm">Describe what you see — Talk2Dom can locate UI elements even as your page evolves. No fragile selectors, no maintenance hassle.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md hover:bg-white/10 transition border border-white/10 shadow-md">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Future-Proof Automation</h3>
            <p className="text-gray-300 text-sm">AI is reshaping every industry, and element interaction is no exception. Talk2Dom is built to align with the future of software testing and intelligent automation.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md hover:bg-white/10 transition border border-white/10 shadow-md">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
            <p className="text-gray-300 text-sm">Effortlessly integrate with your existing stack — whether you're using Playwright, Selenium, or custom automation tools.</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Element-Level Intelligence for Real Workflows</h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-8 text-left">
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition hover:border-gray-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              💡
            </div>
            <h3 className="font-semibold text-lg mb-2">Cross-Platform Element Location</h3>
            <p>We don’t write test cases—we help you locate the elements. Describe them in natural language, and our API finds them for you. Works with Playwright, Selenium, Cypress, and more.</p>
          </div>
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition hover:border-gray-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              💡
            </div>
            <h3 className="font-semibold text-lg mb-2">AI-Powered Web Scraping</h3>
            <p>No need to fight layout shifts or class changes. Just say "get the product price" and we’ll locate it—across sessions and versions.</p>
          </div>
          <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition hover:border-gray-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              💡
            </div>
            <h3 className="font-semibold text-lg mb-2">In-App User Guidance</h3>
            <p>Power onboarding flows and tooltips that always find the right element—even when the UI changes.</p>
          </div>
        </div>
      </section>

      {/* Community Praise Section */}
      <section className="py-20 px-6 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers</h2>
          <p className="text-lg text-gray-600 mb-4">
            Automation engineers and software developers alike are embracing Talk2Dom to simplify element location and speed up testing.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="italic text-gray-700">"Finally, a tool that understands my UI struggles. Talk2Dom saved me hours of debugging."</p>
              <div className="mt-4 font-semibold text-sm text-gray-600">— Alex, QA Engineer</div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="italic text-gray-700">"I integrated Talk2Dom into our test pipeline in under 10 minutes. It just works."</p>
              <div className="mt-4 font-semibold text-sm text-gray-600">— Priya, Automation Lead</div>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <p className="italic text-gray-700">"We’ve been using Talk2Dom internally for months—super reliable across layout changes."</p>
              <div className="mt-4 font-semibold text-sm text-gray-600">— Chen, Frontend Dev</div>
            </div>
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