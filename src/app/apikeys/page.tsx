"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import SidebarLayout from "@/components/layout/SidebarLayout";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { toast } from "react-hot-toast";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";


type ApiKey = {
  id: string;
  name?: string;
  key?: string;
  created_at: string;
  is_active: boolean;
};

export default function ApiKeyPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Guided tour state for first API key creation
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState<1 | 2 | 3>(1);
  const [spotRect, setSpotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Targets for spotlighting
  const createBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalNameRef = useRef<HTMLInputElement | null>(null);
  const modalCreateRef = useRef<HTMLButtonElement | null>(null);

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    window.dataLayer?.push({
      event: "api_key_copied",
      api_key_id: id,
    });
    toast.success("API key copied to clipboard");
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const response = await fetch(`${DOMAIN}/api/v1/user/api-keys/${keyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      const result = await fetchApiKeys(currentPage);
      // If the current page becomes empty and it's not the first page, go back one page
      if (result && result.count === 0 && currentPage > 1) {
        await fetchApiKeys(currentPage - 1);
      }
      window.dataLayer?.push({
        event: "api_key_deleted",
        api_key_id: keyId,
      });
      toast.success("API key deleted");
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  // Move fetchApiKeys outside useEffect for reuse
  const fetchApiKeys = async (page: number = 1) => {
    setLoading(true);
    try {
      const limit = 10;
      const offset = (page - 1) * limit;
      const response = await fetch(`${DOMAIN}/api/v1/user/api-keys?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      const data = await response.json();
      setApiKeys(data.items);
      setHasNextPage(data.has_next);
      setCurrentPage(page);
      return { count: data.items.length, hasNext: !!data.has_next };
    } catch (error) {
      console.error("Error fetching API keys:", error);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      const response = await fetch(`${DOMAIN}/api/v1/user/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newKeyName),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create API key");
      }

      await response.json();
      setShowModal(false);
      window.dataLayer?.push({
        event: "api_key_created",
        key_name: newKeyName,
      });
      toast.success("API key created");
      if (tourOpen) {
        setTourOpen(false);
        setTourStep(1);
      }
      fetchApiKeys(currentPage); // refresh keys after modal closes
    } catch (error) {
      console.error("Error creating API key:", error);
      toast.error("Failed to create API key");
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "apikey_page",
    });
  }, []);

  useEffect(() => {
    // Start tour if user has no keys
    if (apiKeys.length === 0) {
      setTourOpen(true);
      setTourStep(1);
    } else {
      setTourOpen(false);
    }
  }, [apiKeys]);

  useEffect(() => {
    if (!tourOpen) return;
    window.dataLayer?.push({ event: 'first_apikey_tour_step', step: tourStep });
  }, [tourOpen, tourStep]);

  useLayoutEffect(() => {
    const updateRect = () => {
      let el: HTMLElement | null = null;
      if (tourStep === 1) el = createBtnRef.current;
      else if (tourStep === 2) el = modalNameRef.current as HTMLElement | null;
      else if (tourStep === 3) el = modalCreateRef.current as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      } else {
        setSpotRect(null);
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [tourOpen, tourStep, showModal]);

  const lastRectRef = useRef<{ top: number; left: number; width: number; height: number } | null>(null);
  const ensureVisibleAndMeasure = () => {
    let el: HTMLElement | null = null;
    if (tourStep === 1) el = createBtnRef.current || null;
    else if (tourStep === 2) el = (modalNameRef.current as HTMLElement | null);
    else if (tourStep === 3) el = (modalCreateRef.current as HTMLElement | null);
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
  }, [tourOpen, tourStep, showModal]);

  useEffect(() => {
    if (!tourOpen) return;
    const obs = new MutationObserver(() => ensureVisibleAndMeasure());
    obs.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => obs.disconnect();
  }, [tourOpen, tourStep]);

  const handleTourNext = () => {
    if (tourStep === 1) {
      if (!showModal) setShowModal(true);
      setTourStep(2);
      window.dataLayer?.push({ event: 'first_apikey_tour_next', from: 1, to: 2 });
      return;
    }
    if (tourStep === 2) {
      if (!newKeyName.trim()) {
        toast.error('Please enter a key name.');
        modalNameRef.current?.focus();
        return;
      }
      setTourStep(3);
      window.dataLayer?.push({ event: 'first_apikey_tour_next', from: 2, to: 3 });
      return;
    }
  };

  const handleTourBack = () => {
    if (tourStep === 3) {
      setTourStep(2);
      window.dataLayer?.push({ event: 'first_apikey_tour_prev', from: 3, to: 2 });
      return;
    }
    if (tourStep === 2) {
      setTourStep(1);
      if (showModal) setShowModal(false);
      window.dataLayer?.push({ event: 'first_apikey_tour_prev', from: 2, to: 1 });
      return;
    }
  };

  const handleForceCreate = () => {
    if (!showModal) setShowModal(true);
    if (tourStep !== 3) setTourStep(3);
    let tries = 0;
    const attempt = () => {
      const btn = modalCreateRef.current;
      if (btn) {
        try { btn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch {}
        btn.click();
        window.dataLayer?.push({ event: 'first_apikey_tour_force_create_click' });
        return;
      }
      if (tries++ < 10) requestAnimationFrame(attempt);
    };
    requestAnimationFrame(attempt);
  };

  return (
    <SidebarLayout>
      <main className="min-h-screen text-gray-900 dark:text-gray-100 px-4 py-4 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-gray-100">API Keys</h1>

        <div className="mb-6 md:mb-8">
          <button
            ref={createBtnRef}
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded cursor-pointer w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            + Create API Key
          </button>
        </div>

        <div className="grid gap-4">
          {apiKeys.length === 0 ? null : (
            apiKeys.map((keyObj) => (
              <div
                key={keyObj.id}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {keyObj.name || "Unnamed Key"}
                  </span>
                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {keyObj.key ? `${keyObj.key.slice(0, 6)}••••••••••••` : "sk-xxxxxx••••••"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created at: {keyObj.created_at} • Status:{" "}
                    <span
                      className={
                        keyObj.is_active ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-400"
                      }
                    >
                      {keyObj.is_active ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 w-full md:w-auto md:justify-end">
                  <button
                    onClick={() => handleCopy(keyObj.key!, keyObj.id)}
                    className="text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full md:w-auto"
                  >
                    {copiedKeyId === keyObj.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setKeyToDelete(keyObj.id)}
                    className="text-sm px-3 py-2 border rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 cursor-pointer w-full md:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <div className="fixed bottom-4 md:bottom-6 left-0 md:left-64 right-0 z-40 pointer-events-none">
        <div className="mx-auto w-fit px-2 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60 shadow pointer-events-auto flex flex-row items-center justify-center gap-2">
          <button
            onClick={() => fetchApiKeys(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="Previous"
            title="Previous"
          >
            <FiChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            onClick={() => fetchApiKeys(currentPage + 1)}
            disabled={!hasNextPage || loading}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-label="Next"
            title="Next"
          >
            <FiChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Create New API Key</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to create a new API key?</p>
            <input
              ref={modalNameRef}
              type="text"
              placeholder="Enter API key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                ref={modalCreateRef}
                onClick={handleCreateKey}
                className="px-4 py-2 text-sm rounded cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {keyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Delete API Key</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this API key?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setKeyToDelete(null)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteKey(keyToDelete);
                  setKeyToDelete(null);
                }}
                className="px-4 py-2 text-sm rounded cursor-pointer bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
              >
                Delete
              </button>
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
            style={spotRect ? { top: spotRect.top + spotRect.height + 12, left: Math.max(12, spotRect.left) } : { bottom: 24, transform: 'translateX(-50%)' }}
          >
            <div className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow p-4 text-sm">
              {tourStep === 1 && (
                <>
                  <div className="font-semibold mb-1">Step 1/3 · Create your first API key</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Click <strong>+ Create API Key</strong> to start.</div>
                </>
              )}
              {tourStep === 2 && (
                <>
                  <div className="font-semibold mb-1">Step 2/3 · Name your key</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Give it a clear name. You can change it later.</div>
                </>
              )}
              {tourStep === 3 && (
                <>
                  <div className="font-semibold mb-1">Step 3/3 · Confirm</div>
                  <div className="text-gray-600 dark:text-gray-300 mb-3">Hit <strong>Confirm</strong> to create the key.</div>
                </>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTourOpen(false)}
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
                {tourStep < 3 && (
                  <button
                    type="button"
                    onClick={handleTourNext}
                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Next
                  </button>
                )}
                {tourStep === 3 && (
                  <button
                    type="button"
                    onClick={handleForceCreate}
                    className="px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Force Create
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </SidebarLayout>
  );
}