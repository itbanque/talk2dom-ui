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

      document.title = "About — Talk2Dom";

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
        "Talk2Dom is a small, product-focused team building dependable AI selectors for real-world browser control. Learn our mission, principles, and how to reach us."
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
      ensureOG("og:title", "About — Talk2Dom");
      ensureOG(
        "og:description",
        "We’re a small team with a clear mission: remove friction from browser control and automation. Read about our principles and how to reach us."
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
      ensureTwitter("twitter:title", "About — Talk2Dom");
      ensureTwitter(
        "twitter:description",
        "Small team. Clear mission. Practical tools for dependable UI automation."
      );
      ensureTwitter("twitter:image", `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-gray-900 dark:from-[#05070f] dark:via-[#060815] dark:to-[#05070f] dark:text-gray-100">
      <Navbar />

      <Script id="ldjson-about-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Talk2Dom",
          url: "https://www.itbanque.com/",
          logo: "https://www.itbanque.com/icon.png",
          sameAs: ["https://github.com/itbanque/talk2dom"],
        })}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 md:px-12">
        <div className="pointer-events-none absolute left-[-5%] top-[-20%] h-80 w-80 rounded-full bg-indigo-300/25 blur-[140px] dark:bg-indigo-600/20" />
        <div className="pointer-events-none absolute right-[-15%] top-[10%] h-96 w-96 rounded-full bg-sky-300/25 blur-[160px] dark:bg-sky-500/20" />
        <div className="mx-auto flex max-w-5xl flex-col gap-6 text-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-gray-100">
            About Talk2Dom
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            We build dependable AI selectors for teams that need reliable browser control.
          </h1>
          <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-200">
            Talk2Dom is crafted by a small, product-focused team. We care about clarity, resilience, and speed—so you can spend less time fixing flaky
            selectors and more time keeping your browser-driven workflows stable.
          </p>
          <div className="grid gap-4 sm:grid-cols-3 max-w-2xl">
            {[
              { label: "Focus", value: "Browser control & QA" },
              { label: "Approach", value: "Small team, fast shipping" },
              { label: "Location", value: "Remote-first" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16 text-gray-900 dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Mission</p>
            <div className="mt-3 grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold md:text-4xl">Remove friction from UI automation</h2>
            <p className="text-base text-gray-600 dark:text-gray-200">
              We turn natural-language prompts into selectors that keep working after your UI changes. Reliability beats lab benchmarks: we test on
              real products and iterate fast so your browser automation keeps running.
            </p>
              </div>
              <div className="grid gap-3 text-sm text-gray-700 dark:text-gray-200">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">What matters</p>
                  <p className="mt-1 font-semibold">Clarity, speed, stable outputs</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Who we build for</p>
                  <p className="mt-1 font-semibold">Engineers, QA, and ops teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-gray-50 px-6 py-16 text-gray-900 dark:bg-[#0e1222] dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Principles</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">How we build and ship</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Small & focused",
                body: "We keep scope tight so the core experience is dependable. Fewer features, better outcomes.",
              },
              {
                title: "Practical over perfect",
                body: "We care about stability on real sites, not just benchmarks. Reliability wins over vanity metrics.",
              },
              {
                title: "Ship, learn, improve",
                body: "Fast feedback loops with users guide our roadmap. We iterate in weeks, not quarters.",
              },
              {
                title: "Respect for teams",
                body: "Clear pricing, honest docs, and responsive support. We aim to unblock you, not upsell you.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="px-6 py-16 text-gray-900 dark:text-gray-100 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">How we work</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Built for real-world release cycles</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                label: "01",
                title: "Real product coverage",
                body: "We test across consumer sites, SaaS dashboards, and internal tools so selectors hold up when designs move.",
              },
              {
                label: "02",
                title: "Data-informed updates",
                body: "Feedback from QA and dev teams drives improvements—less guesswork, more shipping.",
              },
              {
                label: "03",
                title: "Secure by design",
                body: "Project-scoped keys, auditable requests, and minimal data retention keep your workflows safe.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-sm font-semibold text-sky-700 dark:text-sky-200">{item.label}</p>
                <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-900 px-6 py-16 text-gray-50 md:px-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-r from-gray-900 via-sky-900 to-indigo-900 px-8 py-10 shadow-2xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Contact</p>
            <h2 className="text-3xl font-semibold md:text-4xl">We read every message</h2>
            <p className="text-base text-sky-100/85">
              Have feedback, a feature request, or want to collaborate? Reach out—we respond quickly.
            </p>
            <a
              href="mailto:contact@itbanque.com"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5"
            >
              contact@itbanque.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
