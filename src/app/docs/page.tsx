"use client";

// Declare window.dataLayer type for TypeScript
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
  const stepByStepRef = useRef<HTMLElement | null>(null);
  const sdkSeleniumRef = useRef<HTMLElement | null>(null);
  const sdkPlaywrightRef = useRef<HTMLElement | null>(null);

  const [copiedStepByStep, setCopiedStepByStep] = useState(false);
  const [copiedSdkSel, setCopiedSdkSel] = useState(false);
  const [copiedSdkPw, setCopiedSdkPw] = useState(false);

  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);
  const copyAnchor = (id: string) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
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

    // SEO: Docs page meta
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const url = `${origin}/docs`;

      // Title
      document.title = 'Docs | Talk2Dom – AI-Powered UI Element Locator';

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
      ensureMeta('description', 'Developer documentation for Talk2Dom. Learn how to convert natural language into robust UI selectors via API with Selenium, Playwright, and more.');

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
      ensureOG('og:title', 'Talk2Dom Documentation');
      ensureOG('og:description', 'How Talk2Dom works with Selenium, Playwright, and more.');
      ensureOG('og:type', 'article');
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
      ensureTwitter('twitter:title', 'Talk2Dom Documentation');
      ensureTwitter('twitter:description', 'Developer docs for AI-powered UI element location.');
      ensureTwitter('twitter:image', `${origin}/images/video-fallback.png`);
    } catch (_) {}
  }, []);

  // --- Ensure hash anchors scroll correctly on initial load and navigation ---
  const scrollToHash = (rawHash?: string) => {
    try {
      const hashSource = rawHash ?? (typeof window !== 'undefined' ? (window.location.hash ?? '') : '');
      const hash = (hashSource || '').replace('#', '');
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      // Use scrollMarginTop via Tailwind classes AND explicit scrollIntoView as fallback
      target.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' as ScrollLogicalPosition });
    } catch {}
  };

  useEffect(() => {
    // Initial attempt (immediately after mount)
    scrollToHash();
    // In case content/layout shifts after hydration, try again shortly after
    const t1 = setTimeout(() => scrollToHash(), 60);
    const t2 = setTimeout(() => scrollToHash(), 250);

    // Listen to future hash changes (e.g., internal nav)
    const onHashChange = () => scrollToHash();
    window.addEventListener('hashchange', onHashChange);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return (
    <main className="min-h-screen text-gray-900 dark:text-gray-100 px-6 pb-20">
      <Navbar />
      <Script id="ldjson-docs-org" type="application/ld+json">
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
      <Script id="ldjson-docs-webpage" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Talk2Dom Documentation",
          "url": "https://www.itbanque.com/docs",
          "description": "Developer documentation for Talk2Dom: convert natural language into robust UI selectors via API.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.itbanque.com/"},
              {"@type": "ListItem", "position": 2, "name": "Docs", "item": "https://www.itbanque.com/docs"}
            ]
          }
        })}
      </Script>
      <div className="h-12" />
      <section className="max-w-4xl mx-auto pt-20 pb-20">
        <h1 className="text-4xl font-bold mb-6 text-center">Developer Documentation – How Talk2Dom Works</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
          Talk2Dom brings AI-native element location to your workflow. Instead of writing and maintaining brittle selectors, you can describe elements in natural language—making automation, scraping, and validation more robust as your frontend evolves. Built for developers, testers, and automation engineers, Talk2Dom is framework-agnostic and works with any language or browser via a simple API.
        </p>

        <div className="space-y-16">
          {/* Section: Product Overview */}
          <div id="product-overview" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#product-overview" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>What is Talk2Dom?</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('product-overview')}
                type="button"
              >
                {copiedAnchor === 'product-overview' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Talk2Dom is an AI-native platform that lets you locate web elements using natural language. It’s built for developers, testers,
              and automation engineers who are tired of maintaining fragile selectors. Instead of writing XPath or CSS queries, just describe
              what you're looking for — like "the red delete button in the top right."
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Whether you're building automation frameworks, scraping data, or designing internal tooling, Talk2Dom gives you a universal,
              language-based way to find the elements you care about. Use it with any language, any framework, and any browser — via a
              simple API.
            </p>
            <div className="mb-8 flex justify-center">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/XsEYvdffQjE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          {/* Section: Designed for Real Workflows */}
          <div id="workflows" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#workflows" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Designed for Real Workflows</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('workflows')}
                type="button"
              >
                {copiedAnchor === 'workflows' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Talk2Dom focuses exclusively on intelligent element location. It doesn’t generate test cases or click buttons for you —
              instead, it works as a foundational service that integrates cleanly into your existing workflow.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              This makes it ideal for CI pipelines, scrapers, visual validators, or any system that needs to find page elements reliably,
              even as the frontend evolves.
            </p>
          </div>


          {/* Section: Getting Started */}
          <div id="getting-started" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#getting-started" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Step-by-Step: Get Started</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('getting-started')}
                type="button"
              >
                {copiedAnchor === 'getting-started' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>First, create a <strong>Project</strong> in your dashboard.</li>
              <li>Next, generate an <strong>API Key</strong></li>
              <li>Store your Project ID in the X-Project-ID header, and include your API key as a Bearer token in the Authorization header.</li>
              <li>Then, call the inference API:</li>
            </ol>
            <div className="relative">
              <button
                className="absolute top-3 right-3 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs px-2 py-1 rounded"
                onClick={() => handleCopy(stepByStepRef, setCopiedStepByStep)}
                aria-label="Copy code"
                type="button"
              >
                {copiedStepByStep ? "Copied" : "Copy"}
              </button>
              <pre className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded text-sm overflow-x-auto mt-4">
                <code ref={stepByStepRef} className="language-javascript">
                  {`
POST /api/v1/locate
Headers:
  Authorization: Bearer YOUR_API_KEY
  X-Project-ID: your_project_id

Body (JSON):
{
  "url": "https://yourwebsite.com",
  "html": "<html>...</html>",
  "user_instruction": "the blue login button at the top right",
}

Response:
{
  "selector_type": "css", // or "xpath"
  "selector_value": ".btn.btn-primary.login",
}
`}
                </code>
              </pre>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This will return the selector for your target element.
            </p>
          </div>

          {/* Section: Python SDK — Selenium (sync) */}
          <div id="sdk-selenium" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#sdk-selenium" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Python SDK — Selenium (sync)</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('sdk-selenium')}
                type="button"
              >
                {copiedAnchor === 'sdk-selenium' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Install: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pip install talk2dom</code>
            </p>
            <div className="relative">
              <button
                className="absolute top-3 right-3 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs px-2 py-1 rounded"
                onClick={() => handleCopy(sdkSeleniumRef, setCopiedSdkSel)}
                aria-label="Copy code"
                type="button"
              >
                {copiedSdkSel ? "Copied" : "Copy"}
              </button>
              <pre className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded text-sm overflow-x-auto mt-4">
                <code ref={sdkSeleniumRef} className="language-python">
{`
from selenium import webdriver
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

driver.find_element(res.selector_type, res.selector_value).click()`}
                </code>
              </pre>
            </div>
          </div>

          {/* Section: Python SDK — Playwright (async) */}
          <div id="sdk-playwright" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#sdk-playwright" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Python SDK — Playwright (async)</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('sdk-playwright')}
                type="button"
              >
                {copiedAnchor === 'sdk-playwright' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Install: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">pip install talk2dom</code>
            </p>
            <div className="relative">
              <button
                className="absolute top-3 right-3 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs px-2 py-1 rounded"
                onClick={() => handleCopy(sdkPlaywrightRef, setCopiedSdkPw)}
                aria-label="Copy code"
                type="button"
              >
                {copiedSdkPw ? "Copied" : "Copy"}
              </button>
              <pre className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100 p-4 rounded text-sm overflow-x-auto mt-4">
                <code ref={sdkPlaywrightRef} className="language-python">
{`
import asyncio
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

asyncio.run(main())`}
                </code>
              </pre>
            </div>
          </div>

          {/* Section: Integration */}
          <div id="integration" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#integration" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Integrate with Your Stack:</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('integration')}
                type="button"
              >
                {copiedAnchor === 'integration' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Talk2Dom can be used alongside any UI framework or automation tool, such as Cypress, Selenium, or Playwright.
              Simply use the API response to trigger actions, validations, or visual cues.
            </p>
          </div>

          {/* Section: Self-Hosting */}
          <div id="self-hosting" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#self-hosting" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Self-Host with Confidence</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('self-hosting')}
                type="button"
              >
                {copiedAnchor === 'self-hosting' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our system is fully open-source and can be deployed with Docker. Both self-hosting and secondary development support — including installation guides, updates, troubleshooting, and customization — are available exclusively for <strong>Enterprise</strong> customers. This ensures you have full control over your data while tailoring the AI behavior to your specific workflows.
            </p>
            <p className="mt-2">
              <Link href="https://github.com/itbanque/talk2dom" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                View on GitHub ↗
              </Link>
            </p>
          </div>

          {/* Section: FAQ */}
          <div id="faq" className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-4 flex items-center group">
              <a href="#faq" className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400" aria-label="Permalink">#</a>
              <span>Frequently Asked Questions</span>
              <button
                className="ml-2 text-xs bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => copyAnchor('faq')}
                type="button"
              >
                {copiedAnchor === 'faq' ? 'Copied' : 'Copy Link'}
              </button>
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Q:</strong> Does it support Shadow DOM? <br /> <strong>A:</strong> Yes, our selector engine is Shadow DOM-aware.</li>
              <li><strong>Q:</strong> Can I use this in mobile web testing? <br /> <strong>A:</strong> Yes, as long as the page can be rendered in a browser context.</li>
              <li><strong>Q:</strong> How is privacy handled? <br /> <strong>A:</strong> Self-hosting lets you keep data entirely in-house.</li>
              <li><strong>Q:</strong> Is it only for testers? <br /> <strong>A:</strong> No. It works for developers, testers, analysts, or anyone automating DOM interactions.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}