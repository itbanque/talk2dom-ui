"use client";

import { useEffect } from "react";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  useEffect(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/about`;

      // Title
      document.title = 'About Talk2Dom – AI-Powered UI Element Locator';

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
      ensureMeta('description', 'Learn about Talk2Dom: an AI-powered service that turns plain-language descriptions into robust UI locators.');

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
      ensureOG('og:title', 'About Talk2Dom');
      ensureOG('og:description', 'AI-powered service that converts natural language into reliable UI selectors.');
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
      ensureTwitter('twitter:title', 'About Talk2Dom');
      ensureTwitter('twitter:description', 'AI-powered element location for Selenium & Playwright.');
      ensureTwitter('twitter:image', `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  return (
    <main className="min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      <Script id="ldjson-about-org" type="application/ld+json">
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
      <section className="max-w-3xl mx-auto pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 text-left">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">About Talk2Dom</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6">AI‑powered service for smarter, more reliable element location.</p>

        <p className="mb-6 text-base md:text-lg leading-relaxed">
          <strong>Talk2Dom</strong> turns plain-language descriptions into robust UI locators. Built and run with a lean, AI‑driven approach for fast updates and clear accountability.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">What it does</h2>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg leading-relaxed">
          <li>Generates stable, context‑aware locators.</li>
          <li>Works with Playwright, Selenium, and more.</li>
          <li>Reduces maintenance time and flaky tests.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">Who it's for</h2>
        <ul className="list-disc pl-6 space-y-1 text-base md:text-lg leading-relaxed">
          <li>Developers and testers needing reliable element selection.</li>
          <li>Teams wanting lightweight, effective automation tools.</li>
        </ul>

        <p className="mt-8 mb-4 text-base md:text-lg leading-relaxed">
          Want a simple way to improve your UI automation? Let’s talk.
        </p>
        <div className="mt-2">
          <a href="mailto:contact@itbanque.com" className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-words">contact@itbanque.com</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}