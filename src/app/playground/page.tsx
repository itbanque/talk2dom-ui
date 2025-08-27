"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { toast } from "react-hot-toast";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";


export default function PlaygroundPage() {
  const [url, setUrl] = useState("https://python.org");
  const [instruction, setInstruction] = useState("Find the donate button on the top");
  const [html, setHtml] = useState("");
  const [locators, setLocators] = useState<
    Array<{ selector_type: string; selector_value: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"desktop" | "mobile">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
  );
  const [iframeReady, setIframeReady] = useState(false);

  // Guided tour for Playground
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState<1 | 2 | 3 | 4>(1);
  const [spotRect, setSpotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Spotlight targets
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const instructionInputRef = useRef<HTMLInputElement | null>(null);
  const goBtnRef = useRef<HTMLButtonElement | null>(null);
  const iframeBoxRef = useRef<HTMLDivElement | null>(null);
  // Track if Step 4 was reached so it doesn't auto-trigger again
  const reachedStep4Ref = useRef(false);

  useEffect(() => {
    if (html) setIframeReady(false);
  }, [html]);

  // Auto-start tour on first visit when nothing is loaded
  useEffect(() => {
    const seen = typeof window !== 'undefined' && localStorage.getItem('playground_tour_done') === '1';
    if (!seen && !html) {
      setTourOpen(true);
      setTourStep(1);
    }
  }, []);

  useEffect(() => {
    if (!tourOpen) return;
    window.dataLayer?.push({ event: 'playground_tour_step', step: tourStep });
  }, [tourOpen, tourStep]);

  useEffect(() => {
    if (!tourOpen) {
      reachedStep4Ref.current = false;
    }
  }, [tourOpen]);

  useLayoutEffect(() => {
    const pickEl = (): HTMLElement | null => {
      if (tourStep === 1) return urlInputRef.current;
      if (tourStep === 2) return instructionInputRef.current;
      if (tourStep === 3) return goBtnRef.current;
      if (tourStep === 4) return iframeBoxRef.current;
      return null;
    };
    const updateRect = () => {
      if (!tourOpen) { setSpotRect(null); return; }
      const el = pickEl();
      if (!el) { setSpotRect(null); return; }
      const r = el.getBoundingClientRect();
      setSpotRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [tourOpen, tourStep, iframeReady]);

  const lastRectRef = useRef<{ top: number; left: number; width: number; height: number } | null>(null);
  const ensureVisibleAndMeasure = () => {
    let el: HTMLElement | null = null;
    if (tourStep === 1) el = urlInputRef.current;
    else if (tourStep === 2) el = instructionInputRef.current;
    else if (tourStep === 3) el = goBtnRef.current;
    else if (tourStep === 4) el = iframeBoxRef.current;
    if (!el) { setSpotRect(null); return; }
    const vr = el.getBoundingClientRect();
    const fullyOut = vr.bottom < 0 || vr.top > window.innerHeight || vr.right < 0 || vr.left > window.innerWidth;
    if (fullyOut) { try { el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); } catch {}
    }
    let attempts = 0;
    const measure = () => {
      attempts += 1;
      const r = el!.getBoundingClientRect();
      const next = { top: r.top, left: r.left, width: r.width, height: r.height };
      const prev = lastRectRef.current;
      const stable = prev && Math.abs(prev.top - next.top) < 0.5 && Math.abs(prev.left - next.left) < 0.5 && Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5;
      lastRectRef.current = next;
      setSpotRect(next);
      if (!stable && attempts < 6) requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
  };

  useEffect(() => {
    if (!tourOpen) return;
    ensureVisibleAndMeasure();
  }, [tourOpen, tourStep, iframeReady]);

  useEffect(() => {
    if (!tourOpen) return;
    const obs = new MutationObserver(() => ensureVisibleAndMeasure());
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => obs.disconnect();
  }, [tourOpen, tourStep]);

  const handleTourNext = () => {
    if (tourStep === 1) {
      if (!url.trim()) { toast.error('Please enter a URL.'); urlInputRef.current?.focus(); return; }
      setTourStep(2);
      window.dataLayer?.push({ event: 'playground_tour_next', from: 1, to: 2 });
      return;
    }
    if (tourStep === 2) {
      if (!instruction.trim()) { toast.error('Please enter an instruction.'); instructionInputRef.current?.focus(); return; }
      setTourStep(3);
      window.dataLayer?.push({ event: 'playground_tour_next', from: 2, to: 3 });
      return;
    }
    if (tourStep === 3) {
      // If preview already ready (e.g., user returned from step 4), jump to 4 directly
      if (iframeReady) {
        setTourStep(4);
        ensureVisibleAndMeasure();
        window.dataLayer?.push({ event: 'playground_tour_next', from: 3, to: 4, via: 'direct' });
        return;
      }
      // Otherwise, trigger the real Go button; step 4 will auto-advance on ready
      handleForceGo();
      window.dataLayer?.push({ event: 'playground_tour_next', from: 3, to: 'pending-4', via: 'force-go' });
      return;
    }
    if (tourStep === 4) {
      setTourOpen(false);
      localStorage.setItem('playground_tour_done', '1');
      window.dataLayer?.push({ event: 'playground_tour_done' });
      return;
    }
  };

  const handleTourBack = () => {
    if (tourStep === 4) {
      // Back is disabled on step 4
      return;
    }
    if (tourStep === 3) {
      setTourStep(2);
      window.dataLayer?.push({ event: 'playground_tour_prev', from: 3, to: 2 });
      return;
    }
    if (tourStep === 2) {
      setTourStep(1);
      window.dataLayer?.push({ event: 'playground_tour_prev', from: 2, to: 1 });
      return;
    }
  };

  useEffect(() => {
    if (tourOpen && tourStep === 3 && iframeReady && !reachedStep4Ref.current) {
      reachedStep4Ref.current = true;
      setTourStep(4);
      ensureVisibleAndMeasure();
    }
  }, [tourOpen, tourStep, iframeReady]);

  const handleForceGo = () => {
    let tries = 0;
    const attempt = () => {
      const btn = goBtnRef.current;
      if (btn) {
        try { btn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch {}
        btn.click();
        window.dataLayer?.push({ event: 'playground_tour_force_go_click' });
        return;
      }
      if (tries++ < 10) requestAnimationFrame(attempt);
    };
    requestAnimationFrame(attempt);
  };

  const handleGo = async () => {
    if (!url) return;
    setIframeReady(false);
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
    if (!iframe || !html) return;

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

      // 添加红框（支持多元素高亮）
      let scrolled = false;
      locators.forEach((locator) => {
        const matched: Element[] = [];
        switch (locator.selector_type) {
          case "id": {
            const el = doc.getElementById(locator.selector_value);
            if (el) matched.push(el);
            break;
          }
          case "tag name": {
            matched.push(...Array.from(doc.getElementsByTagName(locator.selector_value)));
            break;
          }
          case "name": {
            matched.push(...Array.from(doc.getElementsByName(locator.selector_value)) as unknown as Element[]);
            break;
          }
          case "class name": {
            matched.push(...Array.from(doc.getElementsByClassName(locator.selector_value)));
            break;
          }
          case "css selector": {
            matched.push(...Array.from(doc.querySelectorAll(locator.selector_value)));
            break;
          }
          case "xpath": {
            try {
              const snapshot = doc.evaluate(
                locator.selector_value,
                doc,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
              );
              for (let i = 0; i < snapshot.snapshotLength; i++) {
                const n = snapshot.snapshotItem(i);
                if (n && n.nodeType === Node.ELEMENT_NODE) matched.push(n as Element);
              }
            } catch (err) {
              console.warn("Invalid XPath:", locator.selector_value);
            }
            break;
          }
        }

        matched.forEach((el, idx) => {
          el.classList.add("locator-highlight-border");
          if (!scrolled && idx === 0) {
            try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch {}
            scrolled = true;
          }
        });
      });
      setIframeReady(true);
    };

    iframe.addEventListener("load", handleIframeLoad);
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [html, locators]);

  const iframeClass =
    view === "mobile"
      ? "w-[360px] md:w-[390px] h-[640px] md:h-[844px] mx-auto border border-gray-300 dark:border-gray-700 rounded pointer-events-none"
      : "w-full md:w-[1280px] h-[70vh] md:h-[1024px] mx-auto border border-gray-300 dark:border-gray-700 rounded pointer-events-none";

  // Tooltip clamp helper for tour
  const TOOLTIP_MAX_W = 360; // px, approximate width of the tooltip box
  const TOOLTIP_EST_H = 180; // px, rough height of tooltip content
  const TOOLTIP_GAP = 12;    // px, gap between spotlight and tooltip
  const getTooltipStyle = (): React.CSSProperties => {
    if (!spotRect) return { bottom: 24, transform: 'translateX(-50%)' };
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const margin = 12;

    // Decide vertical placement: below if enough space, otherwise above
    const spaceBelow = vh - (spotRect.top + spotRect.height);
    const placeBelow = spaceBelow >= (TOOLTIP_EST_H + margin);

    let top: number;
    if (placeBelow) {
      top = spotRect.top + spotRect.height + TOOLTIP_GAP;
    } else {
      // Place above; clamp to top margin if needed
      top = Math.max(margin, spotRect.top - TOOLTIP_EST_H - TOOLTIP_GAP);
    }

    // Horizontal clamping
    let left = Math.max(margin, spotRect.left);
    if (left + TOOLTIP_MAX_W > vw - margin) {
      left = Math.max(margin, spotRect.left + spotRect.width - TOOLTIP_MAX_W);
    }

    return { top, left };
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-10">
        {/* Top Panel - Controls */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Playground</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Enter a public website URL
              </label>
              <input
                ref={urlInputRef}
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <div className="w-full md:w-40">
              <label htmlFor="view-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                View Mode
              </label>
              <select
                id="view-select"
                value={view}
                onChange={(e) => setView(e.target.value as "desktop" | "mobile")}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="instruction-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe the element to locate, then Click "Go" to highlight it
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                ref={instructionInputRef}
                id="instruction-input"
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. Find the login button"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <button
                ref={goBtnRef}
                onClick={handleGo}
                className="bg-primary text-primary-foreground px-5 py-2 rounded hover:bg-primary/90 transition flex items-center justify-center min-w-[80px] cursor-pointer w-full md:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-gray-400 dark:text-gray-900"
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
        <div ref={iframeBoxRef} className="border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 overflow-auto relative flex justify-center p-2 md:p-4">
          {html ? (
            <>
              <iframe
                srcDoc={html}
                className={`${iframeClass} bg-transparent transition-opacity duration-300 ${iframeReady ? 'opacity-100' : 'opacity-0'}`}
                style={{ backgroundColor: 'transparent' }}
                sandbox="allow-scripts allow-forms allow-same-origin"
                id="rendered-iframe"
                title="Rendered page preview"
                aria-hidden={!iframeReady}
              />
              {(loading || !iframeReady) && (
                <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center z-20">
                  <svg
                    className="animate-spin h-5 w-5 text-gray-300 dark:text-gray-900"
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
            </>
          ) : null}
        </div>
      {tourOpen && (
    <div className="fixed inset-0 z-[70] pointer-events-none">
      {spotRect && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            top: spotRect.top - 8,
            left: spotRect.left - 8,
            width: spotRect.width + 16,
            height: spotRect.height + 16,
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            transition: 'all 150ms ease',
          }}
        />
      )}
      <div
        role="dialog"
        aria-live="polite"
        className={`pointer-events-auto fixed ${spotRect ? '' : 'left-1/2'}`}
        style={getTooltipStyle()}
      >
        <div className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow p-4 text-sm" style={{ maxWidth: TOOLTIP_MAX_W }}>
          {tourStep === 1 && (
            <>
              <div className="font-semibold mb-1">Step 1/4 · Enter a URL</div>
              <div className="text-gray-600 dark:text-gray-300 mb-3">Paste a public page like <code>https://example.com</code>.</div>
            </>
          )}
          {tourStep === 2 && (
            <>
              <div className="font-semibold mb-1">Step 2/4 · Describe the element</div>
              <div className="text-gray-600 dark:text-gray-300 mb-3">E.g., <em>Find the login button</em>.</div>
            </>
          )}
          {tourStep === 3 && (
            <>
              <div className="font-semibold mb-1">Step 3/4 · Run</div>
              <div className="text-gray-600 dark:text-gray-300 mb-3">Click <strong>Go</strong> to fetch the page and highlight the target.</div>
            </>
          )}
          {tourStep === 4 && (
            <>
              <div className="font-semibold mb-1">Step 4/4 · Check the highlight</div>
              <div className="text-gray-600 dark:text-gray-300 mb-3">Look for the red blinking border in the preview.</div>
            </>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setTourOpen(false); localStorage.setItem('playground_tour_done', '1'); }}
              className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Close
            </button>
            {tourStep > 1 && tourStep < 4 && (
              <button
                type="button"
                onClick={handleTourBack}
                className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Back
              </button>
            )}
            {tourStep < 4 && (
              <button
                type="button"
                onClick={handleTourNext}
                className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
              </button>
            )}
            {tourStep === 4 && (
              <button
                type="button"
                onClick={() => { setTourOpen(false); localStorage.setItem('playground_tour_done', '1'); }}
                className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
      </div>
    </SidebarLayout>
  );
}