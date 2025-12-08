"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

export default function HomePage() {
  useEffect(() => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/`;

      document.title = "Talk2Dom – Production-Ready AI Element Locator";

      const ensureMeta = (name: string, content: string) => {
        let m = document.querySelector(`meta[name="${name}"]`);
        if (!m) {
          m = document.createElement("meta");
          m.setAttribute("name", name);
          document.head.appendChild(m);
        }
        m.setAttribute("content", content);
      };
      ensureMeta(
        "description",
        "Talk2Dom turns natural-language prompts into durable UI selectors for Playwright, Selenium, and internal tools—built for teams that ship automation to production."
      );

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", url);

      const ensureOG = (property: string, content: string) => {
        let t = document.querySelector(`meta[property="${property}"]`);
        if (!t) {
          t = document.createElement("meta");
          t.setAttribute("property", property);
          document.head.appendChild(t);
        }
        t.setAttribute("content", content);
      };
      ensureOG("og:title", "Talk2Dom – AI-Powered UI Element Locator");
      ensureOG(
        "og:description",
        "AI-powered service that converts natural language into reliable UI selectors for Selenium, Playwright, and more."
      );
      ensureOG("og:type", "website");
      ensureOG("og:url", url);
      ensureOG("og:image", `${origin}/images/video-fallback.png`);

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
      ensureTwitter("twitter:title", "Talk2Dom – AI-Powered UI Element Locator");
      ensureTwitter(
        "twitter:description",
        "Natural language → robust UI selectors. Works with automation tools"
      );
      ensureTwitter("twitter:image", `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-[#05070f] dark:text-gray-100">
      <Navbar />
      <Script id="ldjson-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Talk2Dom",
          url: "https://www.itbanque.com/",
          logo: "https://www.itbanque.com/icon.png",
          sameAs: ["https://github.com/itbanque/talk2dom"],
        })}
      </Script>
      <Script id="ldjson-app" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Talk2Dom",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description:
            "AI-powered service that turns plain-language descriptions into robust UI element locators for Playwright, Selenium, and more.",
          url: "https://www.itbanque.com/",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        })}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white px-6 pb-16 pt-28 text-gray-900 dark:from-[#0a0f1f] dark:via-[#0a0f1f] dark:to-[#090d18] dark:text-gray-100 md:px-12">
        <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-sky-300/30 blur-[160px] dark:bg-sky-500/20" />
        <div className="pointer-events-none absolute right-[-5%] top-[10%] h-80 w-80 rounded-full bg-indigo-300/25 blur-[150px] dark:bg-indigo-600/20" />
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-gray-100">
              Reliable selectors · Built for release cycles
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Turn any prompt into selectors that survive redesigns.
            </h1>
            <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-200">
              Talk2Dom combines DOM parsing, ARIA and text signals, and fallback heuristics to return selectors that stay stable across deployments.
              Less flakiness, more shipped features.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="/register"
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Start for free
              </a>
              <a
                href="/playground"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:border-gray-400 dark:border-white/30 dark:text-white dark:hover:border-white"
              >
                Open playground
              </a>
              <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">
                No credit card · Live selector output
              </span>
            </div>
            <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-200 sm:grid-cols-3 sm:max-w-xl">
              <div className="rounded-lg border border-gray-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Top-1 match rate</p>
                <p className="text-xl font-semibold">97.4%</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Avg. latency</p>
                <p className="text-xl font-semibold">&lt; 3s</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Sites tested</p>
                <p className="text-xl font-semibold">140+</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-white/5">
              <div className="absolute right-5 top-5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-100">
                Zero-copy selectors
              </div>
              <video
                src="/videos/demo.webm"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/video-fallback.png"
                className="h-[420px] w-full rounded-xl border border-gray-200 object-cover dark:border-white/10"
                controlsList="nodownload"
                style={{ pointerEvents: "none" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-white px-6 py-16 text-gray-900 dark:bg-[#0b0f1c] dark:text-gray-100 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Proof in production
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">Fewer flaky runs, less rework</h2>
            <p className="max-w-2xl text-base text-gray-600 dark:text-gray-200">
              Teams use Talk2Dom to keep tests and automations stable after design changes. You get selectors with confidence scores and alternates, so
              your pipelines stay green.
            </p>
          </div>
          <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
            {[
              { label: "Reduction in locator churn", value: "85%" },
              { label: "Time saved monthly", value: "120+ hrs" },
              { label: "Top-3 coverage", value: "99.1%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="bg-gray-50 px-6 py-16 text-gray-900 dark:bg-[#0e1222] dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Why teams switch</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Selectors that keep up with your releases</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Resilient discovery",
                body: "Grounds prompts in DOM, ARIA, labels, and proximity to return CSS/XPath plus alternates. Works across languages.",
              },
              {
                title: "Operational guardrails",
                body: "Deterministic retries, configurable temperature, and environment tags keep outputs consistent between staging and prod.",
              },
              {
                title: "Observability built-in",
                body: "Confidence scores and signal metadata show why a selector was chosen. Share traces with QA and devs quickly.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-100">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-16 text-gray-900 dark:bg-[#0b0f1c] dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Flow</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">From prompt to stable selector in minutes</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Send context",
                desc: "Forward the HTML plus URL. We ingest structure, labels, and ARIA hints without scraping hacks.",
              },
              {
                title: "Describe the element",
                desc: "Prompts like “click the primary checkout button” or “grab all product price cells” are grounded to the DOM.",
              },
              {
                title: "Use the selector",
                desc: "Receive CSS and XPath with alternates and confidence. Drop into Playwright, Selenium, or your RPA bot.",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-200">{String(idx + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-gray-50 px-6 py-16 text-gray-900 dark:bg-[#0e1222] dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Where it fits</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Element-level intelligence for your stack</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Automated testing",
                body: "Stabilize Playwright, Selenium, and Cypress suites. Less test debt after every release.",
              },
              {
                title: "Web scraping",
                body: "Extract repeatable data from changing catalogs, forms, and dashboards without brittle XPath.",
              },
              {
                title: "RPA & internal tools",
                body: "Power bots that interact with legacy apps and in-house portals with consistent selectors.",
              },
              {
                title: "Onboarding & guides",
                body: "Anchor tooltips and walkthroughs to the right element even as layouts move.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 px-6 py-16 text-gray-50 md:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-r from-gray-900 via-sky-900 to-indigo-900 px-8 py-12 shadow-2xl">
          <div className="grid gap-8 md:grid-cols-[2fr,1fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Get started</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Ship AI selectors with confidence</h2>
              <p className="text-lg text-sky-100/80">
                Start free, validate in your flows, and scale with team seats and higher throughput when you are ready.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5"
                >
                  Create an account
                </a>
                <a
                  href="/pricing"
                  className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View plans
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/5 p-6 text-sm text-white/90 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-sky-100">What’s included</p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  AI selectors with alternates and confidence scores
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  Playground to validate prompts before CI
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white" />
                  Project-based keys and usage visibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
