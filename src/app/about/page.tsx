"use client";

import { useEffect } from "react";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  useEffect(() => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/about`;

      // Title
      document.title = "About Us — Talk2Dom";

      // Helper to ensure meta tags
      const ensureMeta = (name: string, content: string) => {
        let m = document.querySelector(`meta[name="${name}"]`);
        if (!m) {
          m = document.createElement("meta");
          m.setAttribute("name", name);
          document.head.appendChild(m);
        }
        m.setAttribute("content", content);
      };

      // Company-focused meta
      ensureMeta(
        "description",
        "Talk2Dom is a small, product‑focused team building simple tools for dependable UI automation. Learn who we are, why we exist, and how we work."
      );

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);

      // Open Graph
      const ensureOG = (property: string, content: string) => {
        let t = document.querySelector(`meta[property="${property}"]`);
        if (!t) {
          t = document.createElement("meta");
          t.setAttribute("property", property);
          document.head.appendChild(t);
        }
        t.setAttribute("content", content);
      };
      ensureOG("og:title", "About Us — Talk2Dom");
      ensureOG(
        "og:description",
        "We’re a small team with a clear mission: remove friction from UI automation. This page covers our mission, principles, and how to reach us."
      );
      ensureOG("og:type", "website");
      ensureOG("og:url", url);
      ensureOG("og:image", `${origin}/images/video-fallback.png`);

      // Twitter Card
      const ensureTwitter = (name: string, content: string) => {
        let t = document.querySelector(`meta[name="${name}"]`);
        if (!t) {
          t = document.createElement("meta");
          t.setAttribute("name", name);
          document.head.appendChild(t);
        }
        t.setAttribute("content", content);
      };
      ensureTwitter("twitter:card", "summary_large_image");
      ensureTwitter("twitter:title", "About Us — Talk2Dom");
      ensureTwitter(
        "twitter:description",
        "Small team. Clear mission. Practical tools for dependable UI automation."
      );
      ensureTwitter("twitter:image", `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  return (
    <main className="min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      {/* Organization schema, company centric */}
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
        <h1 className="text-2xl md:text-4xl font-bold mb-3">About Us</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8">
          We’re a small team focused on building dependable tooling for UI automation. We value clarity, speed, and keeping things simple.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">Mission</h2>
        <p className="mb-6 text-base md:text-lg leading-relaxed">
          Remove friction from UI automation so teams can ship with confidence. We do this by turning messy, brittle steps into predictable ones.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">Principles</h2>
        <ul className="list-disc pl-6 space-y-2 text-base md:text-lg leading-relaxed">
          <li><strong>Small &amp; focused.</strong> Fewer features, better outcomes.</li>
          <li><strong>Practical over perfect.</strong> Real‑world reliability beats lab benchmarks.</li>
          <li><strong>Fast iteration.</strong> Ship, learn, improve.</li>
          <li><strong>Respect for users.</strong> Clear pricing, simple integration, responsive support.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">Who we serve</h2>
        <p className="mb-6 text-base md:text-lg leading-relaxed">
          Engineers, testers, and small teams who want lightweight, effective automation without the overhead.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold mt-6 mb-3">Contact</h2>
        <p className="mb-4 text-base md:text-lg leading-relaxed">
          Want to chat or share feedback? We read every message.
        </p>
        <div className="mt-2">
          <a
            href="mailto:contact@itbanque.com"
            className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline break-words"
          >
            contact@itbanque.com
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}