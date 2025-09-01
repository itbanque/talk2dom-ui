"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { toast } from "react-hot-toast";


const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";
const PROXY_PATH = "/api/v1/proxy/start"; // backend router path, e.g., router.api_route("/start", ...)
const LOCATOR_PATH = "/api/v1/inference/locator-playground";


export default function PlaygroundPage() {
  const [url, setUrl] = useState("https://python.org");
  const [proxySrc, setProxySrc] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"desktop" | "mobile">(
    typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
  );
  const [iframeReady, setIframeReady] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const instrFabRef = useRef<HTMLButtonElement | null>(null);
  const instructionInputRef = useRef<HTMLTextAreaElement | null>(null);
  const iframeBoxRef = useRef<HTMLDivElement | null>(null);

  // Draggable FAB state (must be declared before effects that use it)
  const [fabPos, setFabPos] = useState<{ x: number; y: number } | null>(null);
  const fabDragRef = useRef<{ dragging: boolean; moved: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const [instructionOpen, setInstructionOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [instructionSubmitting, setInstructionSubmitting] = useState(false);
  const [locators, setLocators] = useState<
    Array<{ selector_type: string; selector_value: string }>
  >([]);
  const [autoClick, setAutoClick] = useState(false); // default OFF; enable to auto click first match after highlight
  // Floating instruction panel position (opens near the FAB icon)
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const clampPanel = (x: number, y: number, w: number, h: number) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const margin = 8;
    const nx = Math.max(margin, Math.min(x, vw - w - margin));
    const ny = Math.max(margin, Math.min(y, vh - h - margin));
    return { x: nx, y: ny };
  };

  useEffect(() => {
    if (!instructionOpen) return;
    const approxW = 520; // panel max width
    const approxH = 360; // rough height estimate

    // Prefer the real DOM rect of the FAB; fallback to remembered drag pos; finally bottom-right
    const rect = instrFabRef.current?.getBoundingClientRect();
    let anchorLeft: number | null = null;
    let anchorTop: number | null = null;
    let btnW = 56, btnH = 56;
    if (rect) {
      anchorLeft = rect.left;
      anchorTop = rect.top;
      btnW = Math.round(rect.width || btnW);
      btnH = Math.round(rect.height || btnH);
    } else if (fabPos) {
      anchorLeft = fabPos.x;
      anchorTop = fabPos.y;
    } else {
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      anchorLeft = vw - 24 - btnW;
      anchorTop = vh - 24 - btnH;
    }

    // Place panel below the FAB (12px gap), then clamp to viewport
    const initial = clampPanel(anchorLeft!, anchorTop! + btnH + 12, approxW, approxH);
    setPanelPos(initial);

    // Refine using actual panel size next frame
    const raf = requestAnimationFrame(() => {
      const r = panelRef.current?.getBoundingClientRect();
      if (r) {
        const refined = clampPanel(initial.x, initial.y, Math.round(r.width), Math.round(r.height));
        setPanelPos(refined);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [instructionOpen, fabPos]);
  // Guided tour state
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState<1 | 2 | 3 | 4>(1);
  const [spotRect, setSpotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const lastRectRef = useRef<{ top: number; left: number; width: number; height: number } | null>(null);
  useEffect(() => {
    const seenVal = typeof window !== 'undefined' ? localStorage.getItem('playground_tour_done') : '1';
    if (seenVal !== '1') {
      setTourOpen(true);
      setTourStep(1);
    }
  }, []);

  useLayoutEffect(() => {
    const pickEl = (): HTMLElement | null => {
      if (tourStep === 1) return urlInputRef.current;
      if (tourStep === 2) return openBtnRef.current;
      if (tourStep === 3) return instrFabRef.current;
      if (tourStep === 4) return instructionInputRef.current;
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

  const ensureVisibleAndMeasure = () => {
    let el: HTMLElement | null = null;
    if (tourStep === 1) el = urlInputRef.current;
    else if (tourStep === 2) el = openBtnRef.current;
    else if (tourStep === 3) el = instrFabRef.current;
    else if (tourStep === 4) el = instructionInputRef.current;
    if (!el) { setSpotRect(null); return; }
    const vr = el.getBoundingClientRect();
    const fullyOut = vr.bottom < 0 || vr.top > window.innerHeight || vr.right < 0 || vr.left > window.innerWidth;
    if (fullyOut) { try { el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); } catch {} }
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

  useEffect(() => { if (tourOpen) ensureVisibleAndMeasure(); }, [tourOpen, tourStep, iframeReady]);
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
      return;
    }
    if (tourStep === 2) {
      const btn = openBtnRef.current;
      if (btn) {
        try { btn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch {}
        btn.click();
      }
      setTourStep(3);
      return;
    }
    if (tourStep === 3) {
      const fab = instrFabRef.current;
      if (fab) {
        try { fab.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch {}
        setInstructionOpen(true);
      }
      setTourStep(4);
      return;
    }
    if (tourStep === 4) {
      setTourOpen(false);
      try { localStorage.setItem('playground_tour_done', '1'); } catch {}
      return;
    }
  };
  // --- FAB drag logic ---
  const clampFab = (x: number, y: number) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const r = instrFabRef.current?.getBoundingClientRect();
    const w = Math.round(r?.width || 56);
    const h = Math.round(r?.height || 56);
    const margin = 8;
    const nx = Math.max(margin, Math.min(x, vw - w - margin));
    const ny = Math.max(margin, Math.min(y, vh - h - margin));
    return { x: nx, y: ny };
  };

  const onFabMove = (e: MouseEvent) => {
    if (!fabDragRef.current.dragging) return;
    e.preventDefault();
    const dx = e.clientX - fabDragRef.current.startX;
    const dy = e.clientY - fabDragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) fabDragRef.current.moved = true;
    const pos = clampFab(fabDragRef.current.origX + dx, fabDragRef.current.origY + dy);
    setFabPos(pos);
  };

  const onFabEnd = () => {
    if (!fabDragRef.current.dragging) return;
    fabDragRef.current.dragging = false;
    try { document.removeEventListener('mousemove', onFabMove as any); } catch {}
    try { document.removeEventListener('mouseup', onFabEnd as any); } catch {}
    try { document.body.style.userSelect = ''; } catch {}
    // If it was just a click (no move), open the panel
    if (!fabDragRef.current.moved) {
      setInstructionOpen(true);
    }
  };

  const onFabStart = (e: React.MouseEvent) => {
    const btn = instrFabRef.current;
    const rect = btn ? btn.getBoundingClientRect() : null;
    const btnW = rect ? rect.width : 56;
    const btnH = rect ? rect.height : 56;
    const startLeft = rect ? rect.left : 24;
    const startTop = rect ? rect.top : (typeof window !== 'undefined' ? window.innerHeight - 24 - btnH : 24);
    fabDragRef.current.dragging = true;
    fabDragRef.current.moved = false;
    fabDragRef.current.startX = e.clientX;
    fabDragRef.current.startY = e.clientY;
    fabDragRef.current.origX = fabPos ? fabPos.x : startLeft;
    fabDragRef.current.origY = fabPos ? fabPos.y : startTop;
    try { document.addEventListener('mousemove', onFabMove as any); } catch {}
    try { document.addEventListener('mouseup', onFabEnd as any); } catch {}
    try { document.body.style.userSelect = 'none'; } catch {}
  };

  useEffect(() => {
    return () => {
      try { document.removeEventListener('mousemove', onFabMove as any); } catch {}
      try { document.removeEventListener('mouseup', onFabEnd as any); } catch {}
      try { document.body.style.userSelect = ''; } catch {}
    };
  }, []);

  const handleTourBack = () => {
    if (tourStep === 4) { setTourStep(3); return; }
    if (tourStep === 3) { setTourStep(2); return; }
    if (tourStep === 2) { setTourStep(1); return; }
  };

  const TOOLTIP_MAX_W = 360;
  const TOOLTIP_EST_H = 180;
  const TOOLTIP_GAP = 12;
  const getTooltipStyle = (): React.CSSProperties => {
    if (!spotRect) return { bottom: 24, transform: 'translateX(-50%)' } as any;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const margin = 12;
    const spaceBelow = vh - (spotRect.top + spotRect.height);
    const placeBelow = spaceBelow >= (TOOLTIP_EST_H + margin);
    let top: number;
    if (placeBelow) top = spotRect.top + spotRect.height + TOOLTIP_GAP; else top = Math.max(margin, spotRect.top - TOOLTIP_EST_H - TOOLTIP_GAP);
    let left = Math.max(margin, spotRect.left);
    if (left + TOOLTIP_MAX_W > vw - margin) left = Math.max(margin, spotRect.left + spotRect.width - TOOLTIP_MAX_W);
    return { top, left } as any;
  };

  useEffect(() => {
    if (proxySrc || html) setIframeReady(false);
  }, [proxySrc, html]);

  const handleOpen = async () => {
    if (!url) { toast.error('Please enter a URL.'); return; }
    setIframeReady(false);
    setLoading(true);
    setLocators([]);
    setProxySrc("");
    setHtml("");
    try {
      const res = await fetch(`${DOMAIN}${PROXY_PATH}?url=${encodeURIComponent(url)}&rewrite=true`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'text/html, */*;q=0.1' },
      });
      if (!res.ok) {
        let msg = `Open failed (${res.status})`;
        try { msg = (await res.text()).slice(0, 200) || msg; } catch {}
        toast.error(msg);
        return;
      }
      const page = await res.text();

      // Inject <base> tag with origin of current URL into the HTML string
      const originHref = (() => {
        try { return new URL(url).origin + '/'; } catch { return ''; }
      })();

      let pageWithBase = page;
      if (originHref) {
        if (/<head\b[^>]*>/i.test(pageWithBase)) {
          pageWithBase = pageWithBase.replace(
            /<head\b([^>]*)>/i,
            (m, g1) => `<head${g1}><base href="${originHref}">`
          );
        } else if (/<html\b[^>]*>/i.test(pageWithBase)) {
          pageWithBase = pageWithBase.replace(
            /<html\b([^>]*)>/i,
            (m, g1) => `<html${g1}><head><base href="${originHref}"></head>`
          );
        } else {
          pageWithBase = `<head><base href="${originHref}"></head>` + pageWithBase;
        }
      }

      setHtml(pageWithBase);
    } catch (err: any) {
      console.error('Failed to open via proxy:', err);
      toast.error(typeof err?.message === 'string' ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInstruction = async () => {
    if (!instruction.trim()) {
      toast.error("Please enter an instruction.");
      return;
    }
    if (!html) {
      toast.error("Open a page first.");
      return;
    }
    const iframe = document.getElementById("rendered-iframe") as HTMLIFrameElement | null;
    if (!iframe) {
      toast.error("Preview is not ready.");
      return;
    }

    // Clear existing highlights immediately upon Run
    try {
      const doc = iframe.contentDocument;
      if (doc) {
        const old = doc.querySelectorAll('.locator-highlight-border');
        old.forEach((el) => el.classList.remove('locator-highlight-border'));
      }
    } catch {}
    // Also clear in state so effect won't re-apply old highlights
    setLocators([]);

    // Try to read the current iframe document/body and the true navigated URL
    let currentUrl = url;

    // Use the live iframe <body> HTML for the payload
    let bodyHtml = "";
    try {
      const liveDoc = iframe.contentDocument;
      if (liveDoc?.body) bodyHtml = liveDoc.body.outerHTML;
    } catch {}

    const payload = {
      user_instruction: instruction.trim(),
      url: currentUrl,
      html: bodyHtml,
    };

    setInstructionSubmitting(true);
    try {
      const res = await fetch(`${DOMAIN}${LOCATOR_PATH}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const errJson = await res.json();
          const cand = errJson?.detail ?? errJson?.error ?? errJson?.message;
          if (typeof cand === 'string') msg = cand;
        } catch (_) {}
        toast.error(msg);
        return;
      }

      const data = await res.json().catch(() => ({}));
      console.debug('Locator response:', data);

      // Normalize selenium-style selectors into our locators array
      const nextLocators: Array<{ selector_type: string; selector_value: string }> = [];
      if (Array.isArray(data?.selectors)) {
        data.selectors.forEach((s: any) => {
          const t = (s?.type || s?.selector_type || '').toString();
          const v = (s?.value || s?.selector_value || '').toString();
          if (t && v) nextLocators.push({ selector_type: t, selector_value: v });
        });
      } else if (data?.selector_type && data?.selector_value) {
        nextLocators.push({ selector_type: String(data.selector_type), selector_value: String(data.selector_value) });
      }
      if (nextLocators.length > 0) setLocators(nextLocators);

      toast.success("Instruction sent");
      setInstructionOpen(false);
    } catch (err: any) {
      console.error('Locator request error:', err);
      const msg = typeof err?.message === 'string' ? err.message : 'Network error';
      toast.error(msg);
    } finally {
      setInstructionSubmitting(false);
    }
  };

  useEffect(() => {
    const iframe = document.getElementById("rendered-iframe") as HTMLIFrameElement;
    if (!iframe || !html) return;

    const handleIframeLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc?.body) { setIframeReady(true); return; }

      // 注入网络守卫，屏蔽分析埋点请求
      if (!doc.getElementById('locator-net-guard')) {
        const guard = doc.createElement('script');
        guard.id = 'locator-net-guard';
        guard.textContent = `(() => {
          const blockRe = /^(?:\\/rb_|\\/akam\\b|\\/null\\/akam\\b|\\/box\\/|\\/authenticated\\b)/;

          if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const origBeacon = navigator.sendBeacon.bind(navigator);
            navigator.sendBeacon = function(url, data) {
              try { const u = typeof url === 'string' ? url : url?.href || ''; if (blockRe.test(u)) return true; } catch {}
              return origBeacon(url, data);
            };
          }

          if (typeof window.fetch === 'function') {
            const origFetch = window.fetch.bind(window);
            window.fetch = function(input, init) {
              try {
                const u = typeof input === 'string' ? input : (input && input.url) || '';
                if (blockRe.test(u)) return Promise.resolve(new Response('', { status: 204 }));
              } catch {}
              return origFetch(input, init);
            };
          }

          if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
            const origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
              try { if (typeof url === 'string' && blockRe.test(url)) { this.__t2dBlocked = true; return; } } catch {}
              return origOpen.apply(this, arguments);
            };
            const origSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(body) {
              if (this.__t2dBlocked) { try { this.abort(); } catch {} return; }
              return origSend.apply(this, arguments);
            };
          }

          try {
            const desc = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
            if (desc?.set) {
              const origSet = desc.set;
              Object.defineProperty(Image.prototype, 'src', {
                set(v) { if (typeof v === 'string' && blockRe.test(v)) return; return origSet.call(this, v); }
              });
            }
          } catch {}
        })();`;
        doc.head.prepend(guard);
      }

      // 注入样式
      if (!doc.getElementById("locator-style")) {
        const style = doc.createElement("style");
        style.id = "locator-style";
        style.textContent = `
    .locator-highlight-border {
      outline: 2px solid #ff3b30 !important; /* vivid red */
      outline-offset: 0 !important;
      box-shadow:
        0 0 0 2px #ffffff !important,                 /* white halo for dark backgrounds */
        0 0 0 4px rgba(255, 59, 48, 0.9) !important,  /* red ring */
        0 0 12px rgba(255, 59, 48, 0.8) !important;   /* glow */
      animation: t2d-pulse 1.1s ease-in-out infinite !important;
    }

    @keyframes t2d-pulse {
      0%, 100% {
        box-shadow:
          0 0 0 2px #ffffff,
          0 0 0 4px rgba(255, 59, 48, 0.9),
          0 0 10px rgba(255, 59, 48, 0.6);
        opacity: 1;
      }
      50% {
        box-shadow:
          0 0 0 2px #ffffff,
          0 0 0 6px rgba(255, 59, 48, 1),
          0 0 18px rgba(255, 59, 48, 0.9);
        opacity: 0.95;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .locator-highlight-border { animation: none !important; }
    }
  `;
        doc.head.appendChild(style);
      }

      // 清除旧框
      const oldHighlights = doc.querySelectorAll(".locator-highlight-border");
      oldHighlights.forEach((el) => el.classList.remove("locator-highlight-border"));

      // 添加红框（支持多元素高亮 + Selenium 类型）
      let scrolled = false;
      let clicked = false;
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
          case "link text": {
            const anchors = Array.from(doc.getElementsByTagName('a'));
            anchors.forEach(a => { if ((a.textContent || '').trim() === locator.selector_value) matched.push(a); });
            break;
          }
          case "partial link text": {
            const q = locator.selector_value;
            if (q) {
              const anchors = Array.from(doc.getElementsByTagName('a'));
              anchors.forEach(a => { if ((a.textContent || '').includes(q)) matched.push(a); });
            }
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
          // Optionally auto-click the very first matched element
          if (!clicked && autoClick) {
            try {
              const evt = new MouseEvent('click', { bubbles: true, cancelable: true });
              (el as HTMLElement).dispatchEvent(evt);
              // Fallback to direct .click() if no listener consumed the event
              if (typeof (el as HTMLElement).click === 'function') {
                (el as HTMLElement).click();
              }
              clicked = true;
            } catch {}
          }
        });
      });
      setIframeReady(true);
    };

    iframe.addEventListener("load", handleIframeLoad);
    // Apply immediately when html/locators/autoClick change, even if the iframe has already loaded
    try { handleIframeLoad(); } catch {}
    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [html, locators, autoClick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInstructionOpen(false);
    };
    if (instructionOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [instructionOpen]);

  const iframeClass =
    view === "mobile"
      ? "w-[360px] md:w-[390px] h-[640px] md:h-[844px] mx-auto border border-gray-300 dark:border-gray-700 rounded pointer-events-none"
      : "w-full md:w-[1280px] h-[70vh] md:h-[1024px] mx-auto border border-gray-300 dark:border-gray-700 rounded pointer-events-none";


  return (
    <SidebarLayout>
      <div className="flex flex-col gap-6 px-4 py-4 md:px-6 md:py-10">
        {/* Top Panel - Controls */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">Playground</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
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
            <button
              ref={openBtnRef}
              onClick={handleOpen}
              className="bg-primary text-primary-foreground px-5 py-2 rounded hover:bg-primary/90 transition flex items-center justify-center w-full md:w-40 h-[42px] cursor-pointer"
              disabled={loading}
              aria-label="Open URL in preview"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-gray-400 dark:text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                "Open"
              )}
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div className="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
              <button
                type="button"
                onClick={() => setView("desktop")}
                aria-pressed={view === "desktop"}
                title="Desktop view"
                className={
                  `px-3 py-2 flex items-center gap-2 focus:outline-none ${
                    view === 'desktop'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {/* Desktop icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v9A2.25 2.25 0 0 1 18.75 16.5H14.25v1.5h2.25a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 1 0-1.5h2.25v-1.5H5.25A2.25 2.25 0 0 1 3 14.25v-9Zm1.5 0v9c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75H5.25a.75.75 0 0 0-.75.75Z" />
                </svg>
                <span className="hidden md:inline text-sm">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setView("mobile")}
                aria-pressed={view === "mobile"}
                title="Mobile view"
                className={
                  `px-3 py-2 flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 focus:outline-none ${
                    view === 'mobile'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
              >
                {/* Mobile icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M7.5 3A1.5 1.5 0 0 0 6 4.5v15A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 16.5 3h-9Zm0 1.5h9a.5.5 0 0 1 .5.5v12.25H7V5a.5.5 0 0 1 .5-.5Zm9.5 14.75V19a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 7 19v.25h10Z" />
                </svg>
                <span className="hidden md:inline text-sm">Mobile</span>
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
        {/* Floating Action Button to open Instruction Panel (draggable) */}
        <button
          ref={instrFabRef}
          type="button"
          aria-label="Open instruction panel"
          onMouseDown={onFabStart}
          // prevent default click; we trigger open on mouseup when not dragged
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="fixed z-50 h-12 w-12 rounded-full shadow-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 cursor-grab active:cursor-grabbing"
          style={fabPos ? { left: fabPos.x, top: fabPos.y } : { right: 24, bottom: 24 }}
        >
          {/* Magic wand icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M8.25 3a.75.75 0 0 1 .75.75V5h1.25a.75.75 0 0 1 0 1.5H9v1.25a.75.75 0 0 1-1.5 0V6.5H6.25a.75.75 0 0 1 0-1.5H7.5V3.75A.75.75 0 0 1 8.25 3ZM17 4.5a.75.75 0 0 1 .75.75V6h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0V7.5h-.75a.75.75 0 0 1 0-1.5h.75V5.25A.75.75 0 0 1 17 4.5ZM5.25 12a.75.75 0 0 1 .75.75V14h1a.75.75 0 0 1 0 1.5H6v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1.25a.75.75 0 0 1 .75-.75Zm9.47-3.03a1.5 1.5 0 0 1 2.12 0l4.19 4.19a1.5 1.5 0 0 1 0 2.12l-6.63 6.63a1.5 1.5 0 0 1-2.12 0l-4.19-4.19a1.5 1.5 0 0 1 0-2.12l6.63-6.63Zm1.06 1.06-6.63 6.63 4.19 4.19 6.63-6.63-4.19-4.19Z" />
          </svg>
        </button>

        {/* Floating Instruction Panel */}
        {instructionOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setInstructionOpen(false)}
              aria-hidden
            />

            {/* Panel */}
            <div
              ref={panelRef}
              className="fixed w-[92vw] max-w-[520px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl"
              style={{ left: (panelPos?.x ?? 24), top: (panelPos?.y ?? 24) }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-gray-900 dark:text-gray-100">Instruction</div>
                <button
                  type="button"
                  aria-label="Close instruction panel"
                  onClick={() => setInstructionOpen(false)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="px-4 pt-3 pb-2">
                <textarea
                  ref={instructionInputRef}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Describe what you want to locate or do on the page..."
                  className="w-full h-32 resize-y border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Tip: Ask for an element (e.g., "Find the Add to Cart button") or an action.
                </div>
                <div className="flex items-center gap-2">
                  <label className="mr-2 inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 select-none">
                    <input
                      type="checkbox"
                      className="accent-indigo-600"
                      checked={autoClick}
                      onChange={(e) => setAutoClick(e.target.checked)}
                    />
                    Click first match
                  </label>
                  <button
                    type="button"
                    onClick={() => setInstructionOpen(false)}
                    className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitInstruction}
                    disabled={instructionSubmitting}
                    className="px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {instructionSubmitting ? 'Running…' : 'Run'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
                {tourStep === 1 && (<>
                  <div className="font-semibold mb-1">Step 1/4 · Enter a URL</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Paste a public page like <code>https://example.com</code>.</div>
                </>)}
                {tourStep === 2 && (<>
                  <div className="font-semibold mb-1">Step 2/4 · Open the page</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Click <strong>Open</strong> to render the page in the preview.</div>
                </>)}
                {tourStep === 3 && (<>
                  <div className="font-semibold mb-1">Step 3/4 · Open the instruction panel</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Click the instruction icon to bring up the command window.</div>
                </>)}
                {tourStep === 4 && (<>
                  <div className="font-semibold mb-1">Step 4/4 · Type your instruction</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Describe what to find (e.g., <em>Find the login button</em>), then run it.</div>
                </>)}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setTourOpen(false); try { localStorage.setItem('playground_tour_done', '1'); } catch {} }}
                    className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Close
                  </button>
                  {tourStep > 1 && (
                    <button
                      type="button"
                      onClick={handleTourBack}
                      className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Back
                    </button>
                  )}
                  {tourStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleTourNext}
                      className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { handleSubmitInstruction(); setTourOpen(false); try { localStorage.setItem('playground_tour_done', '1'); } catch {} }}
                      disabled={instructionSubmitting || !instruction.trim()}
                      className="px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {instructionSubmitting ? 'Running…' : 'Run'}
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