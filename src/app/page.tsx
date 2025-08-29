"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";



export default function HomePage() {
  useEffect(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/`;

      // Title
      document.title = "Talk2Dom – AI-Powered UI Element Locator For Web Automation";

      // Meta description
      const ensureMeta = (name: string, content: string) => {
        let m = document.querySelector(`meta[name="${name}"]`);
        if (!m) {
          m = document.createElement('meta');
          m.setAttribute('name', name);
          document.head.appendChild(m);
        }
        m.setAttribute('content', content);
      };
      ensureMeta(
        'description',
        'Talk2Dom turns plain-language descriptions into robust UI selectors. AI-powered element location for Playwright, Selenium, and more.'
      );

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);

      // Open Graph
      const ensureOG = (property: string, content: string) => {
        let t = document.querySelector(`meta[property="${property}"]`);
        if (!t) {
          t = document.createElement('meta');
          t.setAttribute('property', property);
          document.head.appendChild(t);
        }
        t.setAttribute('content', content);
      };
      ensureOG('og:title', 'Talk2Dom – AI-Powered UI Element Locator');
      ensureOG(
        'og:description',
        'AI-powered service that converts natural language into reliable UI selectors for Selenium, Playwright, and more.'
      );
      ensureOG('og:type', 'website');
      ensureOG('og:url', url);
      ensureOG('og:image', `${origin}/images/video-fallback.png`);

      // Twitter Card
      const ensureTwitter = (name: string, content: string) => {
        let t = document.querySelector(`meta[name="${name}"]`);
        if (!t) {
          t = document.createElement('meta');
          t.setAttribute('name', name);
          document.head.appendChild(t);
        }
        t.setAttribute('content', content);
      };
      ensureTwitter('twitter:card', 'summary_large_image');
      ensureTwitter('twitter:title', 'Talk2Dom – AI-Powered UI Element Locator');
      ensureTwitter('twitter:description', 'Natural language → robust UI selectors. Works with automation tools');
      ensureTwitter('twitter:image', `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);
  return (
    <main className="min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      <Script id="ldjson-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Talk2Dom",
          "url": "https://www.itbanque.com/",
          "logo": "https://www.itbanque.com/icon.png",
          "sameAs": [
            "https://github.com/itbanque/talk2dom"
          ]
        })}
      </Script>
      <Script id="ldjson-app" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Talk2Dom",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "description": "AI-powered service that turns plain-language descriptions into robust UI element locators for Playwright, Selenium, and more.",
          "url": "https://www.itbanque.com/",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </Script>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 pt-32 pb-20 text-center">
        {/* Left: Text & CTA */}
        <div className="w-full md:w-1/2 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Find UI Elements<br /> with <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent animate-pulse">AI</span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
            Find any element. Anywhere. Instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold hover:from-indigo-600 hover:to-blue-600 transition w-fit mx-auto sm:mx-0"
            >
              Start for Free
            </a>
          </div>
          <div className="mt-4 mb-12 text-sm text-gray-500 dark:text-gray-400">
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

      {/* Accuracy Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Generative AI</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            One of the world’s most advanced language models — is at the heart of Talk2Dom. It deeply understands HTML structure, text content, and visual layout. Combined with our in-house selector engine and fallback heuristics, this enables precise, reliable element targeting.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">97.4%</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Top-1 Selector Match Accuracy</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">99.1%</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Top-3 Match Coverage</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">140+</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Real-World Websites Tested</p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Talk2Dom?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">Experience a new way to interact with the DOM across any platform or framework.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-left">
          <div className="rounded-xl p-6 transition border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg bg-white dark:bg-gray-800">
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Resilient Element Location</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Describe what you see — Talk2Dom can locate UI elements even as your page evolves. No fragile selectors, no maintenance hassle.</p>
          </div>
          <div className="rounded-xl p-6 transition border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg bg-white dark:bg-gray-800">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Future-Proof Automation</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">AI is reshaping every industry, and element interaction is no exception. Talk2Dom is built to align with the future of software testing and intelligent automation.</p>
          </div>
          <div className="rounded-xl p-6 transition border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg bg-white dark:bg-gray-800">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Effortlessly integrate with your existing stack — whether you're using Playwright, Selenium, or custom automation tools.</p>
          </div>
        </div>
      </section>
      
      {/* Time Saved Metrics Section */}  
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See the Impact</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real metrics from teams using Talk2Dom — stop wasting hours on manual selectors.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">+120h</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Average dev hours saved per team per month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">85%</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Reduction in selector-related test failures</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text mb-2 transition-opacity duration-700 ease-out transform-gpu animate-fade-up">65%</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">Drop in test maintenance workload</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Element-Level Intelligence for Real Workflows</h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mt-8 text-left">
          <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition hover:border-indigo-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              🧪
            </div>
            <h3 className="font-semibold text-lg mb-2">Automated Testing</h3>
            <p>Generate resilient selectors for Playwright, Selenium, Cypress, and more. Stop fixing broken locators and focus on test logic.</p>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition hover:border-indigo-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              📊
            </div>
            <h3 className="font-semibold text-lg mb-2">Web Scraping & Data Extraction</h3>
            <p>No more brittle XPaths. Just say “get all product prices” and our API finds them reliably across sessions and layout changes.</p>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition hover:border-indigo-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              🎯
            </div>
            <h3 className="font-semibold text-lg mb-2">RPA & Workflow Automation</h3>
            <p>Integrate with robotic process automation or backend workflows to find and interact with elements in enterprise apps.</p>
          </div>
          <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition hover:border-indigo-300">
            <div className="w-10 h-10 mb-4 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
              🧭
            </div>
            <h3 className="font-semibold text-lg mb-2">In-App Guidance</h3>
            <p>Power onboarding flows and tooltips that always anchor to the right element—even when the UI changes.</p>
          </div>
        </div>
      </section>

      {/* Simple Integration Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">One API Call Away</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            No complex setup. Just send one HTTP request with a prompt and HTML, and get back the most accurate selector instantly.
          </p>
        </div>
        
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">Works with any test framework, CLI, or web scraper.</p>
        <div className="max-w-3xl mx-auto text-sm rounded-xl shadow-md overflow-x-auto mt-8">
          <pre className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-xl p-6 font-mono">
            <code>{`curl -X POST https://api.talk2dom.itbanque.com/api/v1/inference/locator \\
  -H "Authorization: Bearer your-token" \\
  -H "X-Project-ID: your-project-id" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_instruction": "find the login button",
    "html": "<html>...</html>",
    "url": "https://example.com"
  }'`}</code>
          </pre>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start Free, Scale as You Grow</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Get started instantly with our <strong>Free plan</strong> — includes essential features to explore Talk2Dom without commitment. Upgrade anytime for more projects and team features.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg text-base font-semibold hover:from-indigo-600 hover:to-blue-600 transition"
          >
            View All Plans
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}