"use client";

import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { toast } from "react-hot-toast";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";


export default function PlaygroundPage() {
  const [url, setUrl] = useState("https://python.org");
  const [instruction, setInstruction] = useState("Find the search button on the top");
  const [html, setHtml] = useState("");
  const [locators, setLocators] = useState<
    Array<{ selector_type: string; selector_value: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"desktop" | "mobile">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
  );

  const handleGo = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`${DOMAIN}/api/v1/inference/locator-playground`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          url,
          user_instruction: instruction,
          view,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.detail || "Server error");
        return;
      }

      const data = await res.json();
      if (typeof data?.page_html === "string") {
        setHtml(data.page_html);
      }
      if (data?.selector_type && data?.selector_value) {
        setLocators([{ selector_type: data.selector_type, selector_value: data.selector_value }]);
      }
    } catch (err: any) {
      console.error("Failed to fetch locators:", err);
      toast.error(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const iframe = document.getElementById("rendered-iframe") as HTMLIFrameElement;
    if (!iframe || !html || locators.length === 0) return;

    const handleIframeLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) return;

      // 注入样式
      if (!doc.getElementById("locator-style")) {
        const style = doc.createElement("style");
        style.id = "locator-style";
        style.textContent = `
          .locator-highlight-border {
            outline: 2px solid red;
            animation: blink 1.2s ease-in-out infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
        `;
        doc.head.appendChild(style);
      }

      // 清除旧框
      const oldHighlights = doc.querySelectorAll(".locator-highlight-border");
      oldHighlights.forEach((el) => el.classList.remove("locator-highlight-border"));

      // 添加红框
      locators.forEach((locator) => {
        let el: Element | null = null;
        switch (locator.selector_type) {
          case "id":
            el = doc.getElementById(locator.selector_value);
            break;
          case "tag name":
            el = doc.getElementsByTagName(locator.selector_value)[0];
            break;
          case "name":
            el = doc.getElementsByName(locator.selector_value)[0];
            break;
          case "class name":
            el = doc.getElementsByClassName(locator.selector_value)[0];
            break;
          case "css selector":
            el = doc.querySelector(locator.selector_value);
            break;
          case "xpath":
            try {
              const result = doc.evaluate(
                locator.selector_value,
                doc,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              );
              el = result.singleNodeValue as Element | null;
            } catch (err) {
              console.warn("Invalid XPath:", locator.selector_value);
            }
            break;
        }
        if (el) {
          el.classList.add("locator-highlight-border");
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    };

    iframe.addEventListener("load", handleIframeLoad);
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [html, locators]);

  const iframeClass =
    view === "mobile"
      ? "w-[360px] md:w-[390px] h-[640px] md:h-[844px] mx-auto border border-gray-300 rounded pointer-events-none"
      : "w-full md:w-[1280px] h-[70vh] md:h-[1024px] mx-auto border border-gray-300 rounded pointer-events-none";

  return (
    <SidebarLayout>
      <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-10">
        {/* Top Panel - Controls */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-3">Playground</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                Enter a public website URL
              </label>
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="border px-4 py-2 rounded w-full"
              />
            </div>
            <div className="w-full md:w-40">
              <label htmlFor="view-select" className="block text-sm font-medium text-gray-700 mb-1">
                View Mode
              </label>
              <select
                id="view-select"
                value={view}
                onChange={(e) => setView(e.target.value as "desktop" | "mobile")}
                className="border px-4 py-2 rounded w-full"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="instruction-input" className="block text-sm font-medium text-gray-700 mb-1">
              Describe the element to locate, then Click "Go" to highlight it
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                id="instruction-input"
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Find the login button"
                className="border px-4 py-2 rounded w-full"
              />
              <button
                onClick={handleGo}
                className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition flex items-center justify-center min-w-[80px] cursor-pointer w-full md:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "Go"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Panel - Iframe Preview */}
        <div className="border rounded bg-white overflow-auto relative flex justify-center p-2 md:p-4">
          <iframe
            srcDoc={html}
            className={iframeClass}
            sandbox="allow-scripts allow-forms allow-same-origin"
            id="rendered-iframe"
          />
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <svg
                className="animate-spin h-8 w-8 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}