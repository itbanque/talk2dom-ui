"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useRef, useState } from "react";

export default function DocsPage() {
  const stepByStepRef = useRef<HTMLElement | null>(null);
  const sampleCodeRef = useRef<HTMLElement | null>(null);

  const [copiedStepByStep, setCopiedStepByStep] = useState(false);
  const [copiedSampleCode, setCopiedSampleCode] = useState(false);

  const handleCopy = (ref: React.RefObject<HTMLElement>, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (ref.current) {
      navigator.clipboard.writeText(ref.current.innerText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 px-6 pb-20">
      <Navbar />
      <section className="max-w-4xl mx-auto py-20">
        <h1 className="text-4xl font-bold mb-6 text-center">How Talk2Dom Works</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Talk2Dom brings AI-native element location to your workflow. Instead of writing and maintaining brittle selectors, you can describe elements in natural language—making automation, scraping, and validation more robust as your frontend evolves. Built for developers, testers, and automation engineers, Talk2Dom is framework-agnostic and works with any language or browser via a simple API.
        </p>

        <div className="space-y-16">
          {/* Section: Product Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is Talk2Dom?</h2>
            <p className="text-gray-700">
              Talk2Dom is an AI-native platform that lets you locate web elements using natural language. It’s built for developers, testers,
              and automation engineers who are tired of maintaining fragile selectors. Instead of writing XPath or CSS queries, just describe
              what you're looking for — like "the red delete button in the top right."
            </p>
            <p className="text-gray-700 mt-4">
              Whether you're building automation frameworks, scraping data, or designing internal tooling, Talk2Dom gives you a universal,
              language-based way to find the elements you care about. Use it with any language, any framework, and any browser — via a
              simple API.
            </p>
          </div>
          {/* Section: Designed for Real Workflows */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Designed for Real Workflows</h2>
            <p className="text-gray-700">
              Talk2Dom focuses exclusively on intelligent element location. It doesn’t generate test cases or click buttons for you —
              instead, it works as a foundational service that integrates cleanly into your existing workflow.
            </p>
            <p className="text-gray-700 mt-2">
              This makes it ideal for CI pipelines, scrapers, visual validators, or any system that needs to find page elements reliably,
              even as the frontend evolves.
            </p>
          </div>


          {/* Section: Getting Started */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step-by-Step: Get Started</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>First, create a <strong>Project</strong> in your dashboard.</li>
              <li>Next, generate an <strong>API Key</strong></li>
              <li>Store your Project ID in the X-Project-ID header, and include your API key as a Bearer token in the Authorization header.</li>
              <li>Then, call the inference API:</li>
            </ol>
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
                onClick={() => handleCopy(stepByStepRef, setCopiedStepByStep)}
                aria-label="Copy code"
                type="button"
              >
                {copiedStepByStep ? "Copied" : "Copy"}
              </button>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mt-4">
                <code ref={stepByStepRef} className="language-javascript">
                  {`POST /api/v1/inference/locator
Headers:
  X-Project-ID: your_project_id
  Authorization: Bearer your_api_key

Body:
{
  "url": "https://yourwebsite.com",
  "html": "<html>...</html>",
  "user_instruction": "the blue login button at the top right",
  "conversation_history": [
    ["I want to click the login area", "xpath,//div/button"]
  ]
}`}
                </code>
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This will return the selector metadata for your target element.
            </p>
          </div>

          {/* Section: Sample Code */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Sample End-to-End Script (Python + Selenium)</h2>
            <p className="text-gray-700">
              Here’s a minimal working example showing how to use Talk2Dom with Python and Selenium:
            </p>
            <div className="relative">
              <button
                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-xs px-2 py-1 rounded"
                onClick={() => handleCopy(sampleCodeRef, setCopiedSampleCode)}
                aria-label="Copy code"
                type="button"
              >
                {copiedSampleCode ? "Copied" : "Copy"}
              </button>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mt-4">
                <code ref={sampleCodeRef} className="language-python">
                  {`import time
import requests
from selenium import webdriver
from selenium.webdriver import Keys

# Config
API_URL = "https://yourdomain.com/api/v1/inference/locator"
PROJECT_ID = "your_project_id"
API_KEY = "your_api_key"

# Setup Selenium
driver = webdriver.Chrome()
driver.get("http://www.python.org")
html = driver.page_source

# Send request to Talk2Dom
payload = {
    "url": "http://www.python.org",
    "html": html,
    "user_instruction": "Find the Search box",
    "conversation_history": [],
}
headers = {"X-Project-ID": PROJECT_ID, "Authorization": f"Bearer {API_KEY}"}

response = requests.post(API_URL, json=payload, headers=headers)
selector_type = response.json()["selector_type"]
selector_value = response.json()["selector_value"]

# Use the selector
element = driver.find_element(selector_type, selector_value)
element.send_keys("pycon")
element.send_keys(Keys.RETURN)

time.sleep(2)

assert "No results found." not in driver.page_source
assert "PSF PyCon Trademark Usage Policy" in driver.page_source`}
                </code>
              </pre>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This script captures the current page HTML, sends it to Talk2Dom, receives the matching selector, and then clicks it via Selenium.
            </p>
          </div>

          {/* Section: Integration */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Integrate with Your Stack</h2>
            <p className="text-gray-700">
              Talk2Dom can be used alongside any UI framework or automation tool, such as Cypress, Selenium, or Playwright.
              Simply use the API response to trigger actions, validations, or visual cues.
            </p>
          </div>

          {/* Section: Self-Hosting */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Self-Host with Confidence</h2>
            <p className="text-gray-700">
              Our system is fully open-source and can be deployed with Docker. Enjoy full control over your data and
              customize the AI behavior to suit your workflows.
            </p>
            <p className="mt-2">
              <Link href="https://github.com/itbanque/talk2dom" className="text-black underline hover:text-gray-800">
                View on GitHub ↗
              </Link>
            </p>
          </div>

          {/* Section: FAQ */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Q:</strong> Does it support Shadow DOM? <br /> <strong>A:</strong> Yes, our selector engine is Shadow DOM-aware.</li>
              <li><strong>Q:</strong> Can I use this in mobile web testing? <br /> <strong>A:</strong> Yes, as long as the page can be rendered in a browser context.</li>
              <li><strong>Q:</strong> How is privacy handled? <br /> <strong>A:</strong> Self-hosting lets you keep data entirely in-house.</li>
              <li><strong>Q:</strong> Is it only for testers? <br /> <strong>A:</strong> Not at all. It's great for anyone who wants to automate interaction with the DOM — developers, analysts, internal tool builders, and more.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}