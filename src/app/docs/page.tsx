"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRef, useState, useEffect } from "react";
import Script from "next/script";

export default function DocsPage() {
  const sdkSeleniumRef = useRef<HTMLElement | null>(null);
  const sdkPlaywrightRef = useRef<HTMLElement | null>(null);
  const actionChainsRef = useRef<HTMLElement | null>(null);
  const pageNavigatorRef = useRef<HTMLElement | null>(null);

  const [copiedSdkSel, setCopiedSdkSel] = useState(false);
  const [copiedSdkPw, setCopiedSdkPw] = useState(false);
  const [copiedActionChains, setCopiedActionChains] = useState(false);
  const [copiedPageNavigator, setCopiedPageNavigator] = useState(false);
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);

  const copyAnchor = (id: string) => {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const link = `${origin}/docs#${id}`;
      navigator.clipboard.writeText(link).then(() => {
        setCopiedAnchor(id);
        setTimeout(() => setCopiedAnchor(null), 2000);
      });
    } catch (_) {}
  };

  const handleCopy = (
    ref: React.RefObject<HTMLElement | null>,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (ref.current) {
      const text = ref.current.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "docs_page",
    });

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/docs`;

      document.title = "Docs | Talk2Dom – Browser-Aware AI Selectors";

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
        "Developer documentation for Talk2Dom. Learn how to convert natural language into robust UI selectors for browser control with Selenium, Playwright, and more."
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
      ensureOG("og:title", "Talk2Dom Documentation");
      ensureOG("og:description", "How Talk2Dom works with Selenium, Playwright, and browser-driven automation.");
      ensureOG("og:type", "article");
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
      ensureTwitter("twitter:title", "Talk2Dom Documentation");
      ensureTwitter("twitter:description", "Developer docs for AI-powered browser control and element location.");
      ensureTwitter("twitter:image", `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      try {
        const hash = (typeof window !== "undefined" ? window.location.hash : "").replace("#", "");
        if (!hash) return;
        const target = document.getElementById(hash);
        if (!target) return;
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } catch {}
    };

    scrollToHash();
    const t1 = setTimeout(scrollToHash, 60);
    const t2 = setTimeout(scrollToHash, 250);
    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const anchorButton = (id: string) => (
    <button
      className="ml-2 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10"
      onClick={() => copyAnchor(id)}
      type="button"
    >
      {copiedAnchor === id ? "Copied" : "Copy Link"}
    </button>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-gray-900 dark:from-[#05070f] dark:via-[#060815] dark:to-[#05070f] dark:text-gray-100">
      <Navbar />
      <Script id="ldjson-docs-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Talk2Dom",
          url: "https://www.itbanque.com/",
          logo: "https://www.itbanque.com/icon.png",
          sameAs: ["https://github.com/itbanque/talk2dom"],
        })}
      </Script>
      <Script id="ldjson-docs-webpage" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Talk2Dom Documentation",
          url: "https://www.itbanque.com/docs",
          description: "Developer documentation for Talk2Dom: convert natural language into robust UI selectors via API.",
        })}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 md:px-12">
        <div className="pointer-events-none absolute left-[-12%] top-[-25%] h-96 w-96 rounded-full bg-sky-300/25 blur-[160px] dark:bg-sky-500/20" />
        <div className="pointer-events-none absolute right-[-12%] top-[8%] h-80 w-80 rounded-full bg-indigo-300/25 blur-[160px] dark:bg-indigo-600/20" />
        <div className="mx-auto max-w-5xl space-y-5 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/90 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm dark:border-white/15 dark:bg-white/5 dark:text-gray-100">
            Developer documentation
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Developer Documentation – How Talk2Dom Works
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            Talk2Dom brings AI-native element location to your workflow. Describe elements in natural language and receive durable selectors for
            browser control in Selenium, Playwright, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-16 px-6 pb-20 md:px-12">
        {/* Overview */}
        <div id="product-overview" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>What is Talk2Dom?</span>
              {anchorButton("product-overview")}
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Talk2Dom is an AI-native platform that lets you locate web elements using natural language. It’s built for developers, testers,
            and automation engineers who are tired of maintaining fragile selectors. Instead of writing XPath or CSS queries, just describe
            what you're looking for — like "the red delete button in the top right."
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Whether you're building automation frameworks, scraping data, or designing internal tooling, Talk2Dom gives you a universal,
            language-based way to find the elements you care about. Use it with any language, any framework, and any browser — via a
            simple API.
          </p>
          <div className="mt-8 flex justify-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/XsEYvdffQjE"
              title="YouTube video player"
              className="max-w-full rounded-xl border border-gray-200 shadow-md dark:border-white/10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Workflows */}
        <div id="workflows" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Designed for Real Workflows</span>
              {anchorButton("workflows")}
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Talk2Dom focuses exclusively on intelligent element location. It doesn’t generate test cases or click buttons for you —
            instead, it works as a foundational service that integrates cleanly into your existing workflow.
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            This makes it ideal for CI pipelines, scrapers, visual validators, or any system that needs to find page elements reliably,
            even as the frontend evolves.
          </p>
        </div>

        {/* Python SDK — Selenium */}
        <div id="sdk-selenium" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Python SDK — Selenium (sync)</span>
              {anchorButton("sdk-selenium")}
            </h2>
            <button
              className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10"
              onClick={() => handleCopy(sdkSeleniumRef, setCopiedSdkSel)}
              aria-label="Copy code"
              type="button"
            >
              {copiedSdkSel ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Install: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">pip install talk2dom</code>
          </p>
          <pre className="mt-4 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
            <code ref={sdkSeleniumRef} className="language-python">
{`from selenium import webdriver
from selenium.webdriver.common.by import By
from talk2dom import Talk2DomClient

client = Talk2DomClient(
    api_key="YOUR_API_KEY",
    project_id="your_project_id"
)

driver = webdriver.Chrome()
driver.get("https://example.com/login")

html = driver.page_source
res = client.locate("click the primary login button", html=html, url=driver.current_url)

driver.find_element(res.selector_type, res.selector_value).click()
`}
            </code>
          </pre>
        </div>

        {/* Selenium ActionChains */}
        <div id="selenium-actionchains" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Selenium ActionChains</span>
              {anchorButton("selenium-actionchains")}
            </h2>
            <button
              className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10"
              onClick={() => handleCopy(actionChainsRef, setCopiedActionChains)}
              aria-label="Copy code"
              type="button"
            >
              {copiedActionChains ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Use our convenience ActionChains helper to predict an element and chain actions.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
            <code ref={actionChainsRef as any} className="language-python">
{`from selenium import webdriver

import time
from talk2dom.selenium import ActionChains

driver = webdriver.Chrome()
driver.get("https://python.org")

actions = ActionChains(driver)

actions
    .go("Type 'pycon' in the search box")
    .go("Click the 'go' button")

time.sleep(2)
`}
            </code>
          </pre>
        </div>

        {/* Python SDK — Playwright */}
        <div id="sdk-playwright" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Python SDK — Playwright (async)</span>
              {anchorButton("sdk-playwright")}
            </h2>
            <button
              className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10"
              onClick={() => handleCopy(sdkPlaywrightRef, setCopiedSdkPw)}
              aria-label="Copy code"
              type="button"
            >
              {copiedSdkPw ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Install: <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">pip install talk2dom</code>
          </p>
          <pre className="mt-4 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
            <code ref={sdkPlaywrightRef} className="language-python">
{`import asyncio
from playwright.async_api import async_playwright
from talk2dom import Talk2DomClient

client = Talk2DomClient(
    api_key="YOUR_API_KEY", 
    project_id="your_project_id")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://example.com/login")

        html = await page.content()
        res = await client.alocate("click the primary login button", html=html, url=page.url)

        await page.locator(res.selector_value).click()
        await browser.close()

asyncio.run(main())
`}
            </code>
          </pre>
        </div>

        {/* Playwright PageNavigator helper */}
        <div id="playwright-pagenavigator" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Playwright PageNavigator</span>
              {anchorButton("playwright-pagenavigator")}
            </h2>
            <button
              className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 transition hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10"
              onClick={() => handleCopy(pageNavigatorRef, setCopiedPageNavigator)}
              aria-label="Copy code"
              type="button"
            >
              {copiedPageNavigator ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Use a simple page navigator to predict an element and perform actions with Playwright.
          </p>
          <pre className="mt-4 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-white/5">
            <code ref={pageNavigatorRef as any} className="language-python">
{`from playwright.sync_api import sync_playwright
from talk2dom.playwright import PageNavigator


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        navigator = PageNavigator(page)
        page.goto("https://www.python.org")

        navigator.go("Type 'pycon' in the search box")
        navigator.go("Click the 'go' button")

        page.wait_for_timeout(3000)
        browser.close()


if __name__ == "__main__":
    main()
`}
            </code>
          </pre>
        </div>

        {/* Integration */}
        <div id="integration" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Integrate with Your Stack</span>
              {anchorButton("integration")}
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Talk2Dom can be used alongside any UI framework or automation tool, such as Cypress, Selenium, or Playwright.
            Simply use the API response to trigger actions, validations, or visual cues.
          </p>
        </div>

        {/* Self-hosting */}
        <div id="self-hosting" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Self-Host with Confidence</span>
              {anchorButton("self-hosting")}
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Our system is fully open-source and can be deployed with Docker. Both self-hosting and secondary development support — including installation guides, updates, troubleshooting, and customization — are available exclusively for <strong>Enterprise</strong> customers. This ensures you have full control over your data while tailoring the AI behavior to your specific workflows.
          </p>
          <p className="mt-2">
            <Link href="https://github.com/itbanque/talk2dom" className="text-indigo-600 underline decoration-indigo-400 underline-offset-4 hover:text-indigo-700 dark:text-indigo-300">
              View on GitHub ↗
            </Link>
          </p>
        </div>

        {/* FAQ */}
        <div id="faq" className="scroll-mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <span>Frequently Asked Questions</span>
              {anchorButton("faq")}
            </h2>
          </div>
          <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <strong>Q:</strong> Does it support Shadow DOM? <br /> <strong>A:</strong> Yes, our selector engine is Shadow DOM-aware.
            </li>
            <li>
              <strong>Q:</strong> Can I use this in mobile web testing? <br /> <strong>A:</strong> Yes, as long as the page can be rendered in a browser context.
            </li>
            <li>
              <strong>Q:</strong> How is privacy handled? <br /> <strong>A:</strong> Self-hosting lets you keep data entirely in-house.
            </li>
            <li>
              <strong>Q:</strong> Is it only for testers? <br /> <strong>A:</strong> No. It works for developers, testers, analysts, or anyone automating DOM interactions.
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
