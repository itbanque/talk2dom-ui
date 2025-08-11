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
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

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

  return (
    <SidebarLayout>
      <main className="min-h-screen bg-white text-gray-800 px-4 py-4 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">API Keys</h1>

        <div className="mb-6 md:mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer w-full md:w-auto"
          >
            + Create API Key
          </button>
        </div>

        <div className="grid gap-4">
          {apiKeys.length === 0 ? (
            <div className="relative w-full overflow-hidden rounded" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/n6a6qqpZq3o"
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            apiKeys.map((keyObj) => (
              <div
                key={keyObj.id}
                className="bg-white p-4 rounded shadow-sm border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-900">
                    {keyObj.name || "Unnamed Key"}
                  </span>
                  <span className="font-mono text-sm text-gray-700 mt-1">
                    {keyObj.key ? `${keyObj.key.slice(0, 6)}••••••••••••` : "sk-xxxxxx••••••"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Created at: {keyObj.created_at} • Status:{" "}
                    <span
                      className={
                        keyObj.is_active ? "text-green-600" : "text-red-500"
                      }
                    >
                      {keyObj.is_active ? "Active" : "Inactive"}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 w-full md:w-auto md:justify-end">
                  <button
                    onClick={() => handleCopy(keyObj.key!, keyObj.id)}
                    className="text-sm px-3 py-2 border rounded hover:bg-gray-100 cursor-pointer w-full md:w-auto"
                  >
                    {copiedKeyId === keyObj.id ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setKeyToDelete(keyObj.id)}
                    className="text-sm px-3 py-2 border rounded hover:bg-red-50 text-red-600 border-red-300 cursor-pointer w-full md:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-3 mt-6 px-2">
          <button
            onClick={() => fetchApiKeys(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className={`px-4 py-2 border rounded ${
              currentPage === 1 || loading
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            } w-full md:w-auto`}
          >
            Previous
          </button>
          <button
            onClick={() => fetchApiKeys(currentPage + 1)}
            disabled={!hasNextPage || loading}
            className={`px-4 py-2 border rounded ${
              !hasNextPage || loading
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            } w-full md:w-auto`}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create New API Key</h2>
            <p className="mb-4">Are you sure you want to create a new API key?</p>
            <input
              type="text"
              placeholder="Enter API key name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateKey}
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {keyToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete API Key</h2>
            <p className="mb-4">Are you sure you want to delete this API key?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setKeyToDelete(null)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteKey(keyToDelete);
                  setKeyToDelete(null);
                }}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </SidebarLayout>
  );
}