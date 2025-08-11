
"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DOMAIN } from "@/lib/constants";
import { FaChartBar, FaUsers, FaArrowLeft, FaRegClipboard, FaFile } from "react-icons/fa";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useUser } from "@/context/UserContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale, BarElement } from "chart.js";
ChartJS.register(BarElement);
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale);

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | undefined>("");
  const [members, setMembers] = useState<Array<{ user_id: string; name: string; email: string, role: string }> | null>(null);
  const [invites, setInvites] = useState<Array<{ id: string; email: string; accepted: boolean }> | null>(null);
  const { user } = useUser();
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [apiUsage, setApiUsage] = useState<Array<{ timestamp: string; count: number }>>([]);
  const [locatorCache, setLocatorCache] = useState<Array<{ id: string; url: string; user_instruction: string }>>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteLocatorId, setPendingDeleteLocatorId] = useState<string | null>(null);
  const [locatorDetail, setLocatorDetail] = useState<{ type: string; value: string; html: string } | null>(null);
  const [lcLimit, setLcLimit] = useState(10);
  const [lcOffset, setLcOffset] = useState(0);
  const [lcHasMore, setLcHasMore] = useState(false);
  const [lcLoading, setLcLoading] = useState(false);
  // Members & Invites modal/pagination states
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);

  const [memLimit, setMemLimit] = useState(10);
  const [memOffset, setMemOffset] = useState(0);
  const [memHasMore, setMemHasMore] = useState(false);
  const [memLoading, setMemLoading] = useState(false);

  const [invLimit, setInvLimit] = useState(10);
  const [invOffset, setInvOffset] = useState(0);
  const [invHasMore, setInvHasMore] = useState(false);
  const [invLoading, setInvLoading] = useState(false);
  // Reusable fetch functions for locator cache, members, and invites
  const fetchLocatorCachePage = async (limit: number, offset: number) => {
    if (!id) return { count: 0, hasNext: false };
    setLcLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const res = await fetch(`${DOMAIN}/api/v1/project/${id}/locator-cache?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch locator cache");
      const data = await res.json();
      const items = data?.items || [];
      setLocatorCache(items);
      setLcHasMore(!!data?.has_next);
      if (offset > 0 && items.length === 0) {
        setLcOffset(Math.max(offset - limit, 0));
      }
      return { count: items.length, hasNext: !!data?.has_next };
    } catch (err) {
      console.error("Locator cache fetch error:", err);
      setLocatorCache([]);
      setLcHasMore(false);
      return { count: 0, hasNext: false };
    } finally {
      setLcLoading(false);
    }
  };

  const fetchMembersPage = async (limit: number, offset: number) => {
    if (!id) return { count: 0, hasNext: false };
    setMemLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const res = await fetch(`${DOMAIN}/api/v1/project/${id}/members?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      const items = (data && Array.isArray(data.items)) ? data.items : [];
      setMembers(items);
      setMemHasMore(!!data?.has_next);
      if (offset > 0 && items.length === 0) {
        setMemOffset(Math.max(offset - limit, 0));
      }
      return { count: items.length, hasNext: !!data?.has_next };
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
      setMemHasMore(false);
      return { count: 0, hasNext: false };
    } finally {
      setMemLoading(false);
    }
  };

  const fetchInvitesPage = async (limit: number, offset: number) => {
    if (!id) return { count: 0, hasNext: false };
    setInvLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const res = await fetch(`${DOMAIN}/api/v1/project/${id}/invites?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invites");
      const data = await res.json();
      const items = (data && Array.isArray(data.items)) ? data.items : [];
      setInvites(items);
      setInvHasMore(!!data?.has_next);
      if (offset > 0 && items.length === 0) {
        setInvOffset(Math.max(offset - limit, 0));
      }
      return { count: items.length, hasNext: !!data?.has_next };
    } catch (error) {
      console.error("Error fetching invites:", error);
      setInvites([]);
      setInvHasMore(false);
      return { count: 0, hasNext: false };
    } finally {
      setInvLoading(false);
    }
  };

  useEffect(() => {
    fetchLocatorCachePage(lcLimit, lcOffset);
  }, [id, user, lcLimit, lcOffset]);

  const memberLimit =
    user?.plan === "enterprise"
      ? Infinity
      : user?.plan === "pro"
      ? 10
      : user?.plan === "developer"
      ? 2
      : 1;

  const canAddMoreMembers = members && members.length < memberLimit;

  useEffect(() => {
    setProjectId(id as string);
  }, [id]);

  useEffect(() => {
    if (id) {
      window.dataLayer?.push({
        event: "page_view",
        page_name: "project_detail",
        project_id: id,
      });
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchMembersPage(memLimit, memOffset);
  }, [id, memLimit, memOffset]);

  useEffect(() => {
    if (!id) return;
    fetchInvitesPage(invLimit, invOffset);
  }, [id, invLimit, invOffset]);

  useEffect(() => {

    const fetchUsage = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/project/${id}/api-usage`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch usage");
        const data = await res.json();
        setApiUsage(data);
      } catch (err) {
        console.error("API usage fetch error:", err);
      }
    };

    fetchUsage();
  }, [id, user]);

  const handleRemoveInvite = async (userId: string) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${DOMAIN}/api/v1/project/${projectId}/invites/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        let errorMsg = "Failed to remove invite.";
        try {
          const data = await res.json();
          errorMsg = data?.detail || errorMsg;
        } catch (e) {
          errorMsg = await res.text() || errorMsg;
        }
        toast.error(errorMsg);
        return;
      }
      toast.success("Invite removed");
      const r = await fetchInvitesPage(invLimit, invOffset);
      if (r.count === 0 && invOffset > 0) {
        await fetchInvitesPage(invLimit, Math.max(invOffset - invLimit, 0));
      }
    } catch (err) {
      toast.error(String(err));
    }
  };

  // Role rank for permission checks
  const ROLE_RANK: Record<string, number> = { owner: 3, admin: 2, member: 1 };
  // Get current user's project role
  const currentUserRole =
    members?.find((m) => m.user_id === user?.id)?.role ?? "member";

  // Remove member handler
  const handleRemoveMember = async (userId: string) => {
    if (!projectId) return;
    try {
      const res = await fetch(
        `${DOMAIN}/api/v1/project/${projectId}/members/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        let errorMsg = "Failed to remove member.";
        try {
          const data = await res.json();
          errorMsg = data?.detail || errorMsg;
        } catch (e) {
          errorMsg = (await res.text()) || errorMsg;
        }
        toast.error(errorMsg);
        return;
      }
      toast.success("Member removed");
      const r = await fetchMembersPage(memLimit, memOffset);
      if (r.count === 0 && memOffset > 0) {
        await fetchMembersPage(memLimit, Math.max(memOffset - memLimit, 0));
      }
    } catch (err) {
      toast.error(String(err));
    }
  };

  // Delete locator handler
  const handleDeleteLocator = async (locatorId: string) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${DOMAIN}/api/v1/project/${projectId}/locator-cache/${locatorId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete locator");
      toast.success("Locator deleted");
      const r = await fetchLocatorCachePage(lcLimit, lcOffset);
      if (r.count === 0 && lcOffset > 0) {
        await fetchLocatorCachePage(lcLimit, Math.max(lcOffset - lcLimit, 0));
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete locator");
    }
  };

  // Get locator detail handler
  const handleGetLocator = async (locatorId: string) => {
    if (!projectId) return;
    try {
      const res = await fetch(`${DOMAIN}/api/v1/project/${projectId}/locator-cache/${locatorId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch locator detail");
      const data = await res.json();
      setLocatorDetail({
        type: data.selector_type || "unknown",
        value: data.selector_value || "N/A",
        html: data.html || "<div>No HTML</div>",
      });
      // Delay highlight logic after DOM update
      setTimeout(() => {
        const container = document.getElementById("locator-html-preview");
        if (!container) return;

        const highlight = () => {
          const selectorType = data.selector_type?.toLowerCase();
          const selectorValue = data.selector_value;
          let target: Element | null = null;

          switch (selectorType) {
            case "id":
              target = container.querySelector(`#${CSS.escape(selectorValue)}`);
              break;
            case "tag name":
              target = container.getElementsByTagName(selectorValue)[0];
              break;
            case "name":
              target = container.querySelector(`[name="${CSS.escape(selectorValue)}"]`);
              break;
            case "class name":
              target = container.getElementsByClassName(selectorValue)[0];
              break;
            case "xpath":
              try {
                const xpathResult = document.evaluate(
                  selectorValue,
                  container,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                );
                target = xpathResult.singleNodeValue as Element | null;
              } catch (e) {
                console.error("Invalid XPath:", selectorValue, e);
              }
              break;
            case "css selector":
              target = container.querySelector(selectorValue);
              break;
            default:
              break;
          }

          if (target) {
            target.classList.add("locator-highlight");
            // Auto scroll to locator element
            if (target.scrollIntoView) {
              target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        };

        // Inject highlight CSS once
        if (!document.getElementById("locator-highlight-style")) {
          const style = document.createElement("style");
          style.id = "locator-highlight-style";
          style.innerHTML = `
            .locator-highlight {
              position: relative;
              outline: 3px solid red;
              outline-offset: 2px;
              transition: outline 0.3s ease-in-out;
              z-index: 9999;
            }

            .locator-highlight::after {
              content: "🔎 Matched Element";
              position: absolute;
              top: -28px;
              left: 0;
              background: red;
              color: white;
              padding: 2px 6px;
              font-size: 12px;
              font-weight: bold;
              border-radius: 4px;
              white-space: nowrap;
              z-index: 10000;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
          `;
          document.head.appendChild(style);
        }

        highlight();
      }, 100);
    } catch (err) {
      toast.error("Failed to load detail");
      console.error("Fetch locator detail error:", err);
    }
  };

  return (
    <SidebarLayout>
      <main className="min-h-screen bg-white text-gray-800 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="text-sm text-black hover:underline flex items-center gap-1 cursor-pointer hover:cursor-pointer"
            >
              <FaArrowLeft className="inline" />
              <span>Back</span>
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-1">Manage members, monitor API usage, and invite collaborators.</p>
          <div className="mb-8 flex justify-end items-center text-sm text-gray-600">
            <button
              className="flex items-center gap-2 bg-gray-100 text-black font-mono px-3 py-1 rounded border hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                if (projectId) {
                  navigator.clipboard.writeText(projectId);
                  window.dataLayer?.push({
                    event: "project_id_copied",
                    project_id: projectId,
                  });
                  toast.success("Project ID copied to clipboard");
                }
              }}
              aria-label="Copy Project ID"
            >
              {projectId}
              <FaRegClipboard />
            </button>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartBar /> API Usage (Last 30 Days)
            </h2>
            <div className="w-full min-h-[400px] bg-white border border-gray-200 shadow-sm rounded p-4">
              {apiUsage.length > 0 ? (
                <Bar
                  data={{
                    labels: apiUsage.map((u) => u.timestamp),
                    datasets: [
                      {
                        label: "API Calls",
                        data: apiUsage.map((u) => u.count),
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        type: "time",
                        time: {
                          unit: "day",
                        },
                        title: { display: true, text: "Date" },
                      },
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Count" },
                      },
                    },
                  }}
                />
              ) : (
                <div className="text-gray-500 text-sm text-center pt-10">No usage data yet.</div>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaFile className="w-5 h-5" /> Locator Records
            </h2>
            <div className="w-full bg-white border border-gray-200 shadow-sm rounded p-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-3">User Instruction</th>
                    <th className="py-2 px-3">URL</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locatorCache.length > 0 ? (
                    locatorCache.map((item) => (
                      <tr data-id={item.id} key={item.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <div className="max-w-[300px] truncate" title={item.user_instruction}>{item.user_instruction}</div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="max-w-[300px] truncate" title={item.url}>{item.url}</div>
                        </td>
                        <td className="py-2 px-3">
                          <button
                            onClick={async () => {
                              await handleGetLocator(item.id);
                            }}
                            className="text-blue-500 hover:text-blue-700 text-xs mr-3 cursor-pointer"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => {
                              setPendingDeleteLocatorId(item.id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 px-3 text-gray-500" colSpan={3}>
                        No usage records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Showing {lcOffset + 1}-{lcOffset + (locatorCache?.length || 0)}
                </div>
                <div className="flex gap-2 items-center">
                  {/* Page size selector */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Page size:</span>
                    <select
                      value={lcLimit}
                      onChange={(e) => {
                        setLcLimit(Number(e.target.value));
                        setLcOffset(0);
                      }}
                      className="border rounded px-2 py-1 ml-2 cursor-pointer"
                      aria-label="Select number of records per page"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setLcOffset(Math.max(lcOffset - lcLimit, 0))}
                    disabled={lcLoading || lcOffset === 0}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setLcOffset(lcOffset + lcLimit)}
                    disabled={lcLoading || !lcHasMore}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers /> Team & Invitations
            </h2>
            <div className="bg-white border border-gray-200 rounded shadow-sm p-4 text-gray-800">
              {(members === null || invites === null) ? (
                <p className="text-gray-500">Loading...</p>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer flex items-center gap-2"
                    onClick={() => setShowMembersModal(true)}
                  >
                    Members
                    <span className="ml-1 inline-flex items-center justify-center min-w-[22px] h-5 px-2 text-xs rounded-full bg-gray-200 text-gray-700">
                      {(members?.length ?? 0)}{memHasMore ? '+' : ''}
                    </span>
                  </button>
                  <button
                    className="px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200 text-sm cursor-pointer flex items-center gap-2"
                    onClick={() => setShowPendingModal(true)}
                  >
                    Pending
                    <span className="ml-1 inline-flex items-center justify-center min-w-[22px] h-5 px-2 text-xs rounded-full bg-gray-200 text-gray-700">
                      {invites?.filter(i => i.accepted === false).length ?? 0}{invHasMore ? '+' : ''}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </section>
          <div className="mt-6 border border-gray-200 rounded shadow-sm p-4">
            <h3 className="text-md font-medium mb-2">Invite New Member</h3>
            <div
              className="flex items-center gap-2 relative"
              onMouseEnter={() => {
                if (!canAddMoreMembers) setShowTooltip(true);
              }}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <input
                type="email"
                className="border border-gray-300 rounded px-3 py-1 flex-grow"
                placeholder="Enter email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button
                className="bg-black text-white px-3 py-1 rounded text-sm disabled:opacity-50 cursor-pointer"
                disabled={!inviteEmail || isInviting || !canAddMoreMembers}
                onClick={async () => {
                  if (!projectId) return;
                  setIsInviting(true);
                  try {
                    const res = await fetch(`${DOMAIN}/api/v1/project/${projectId}/invite`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      credentials: "include",
                      body: JSON.stringify({ email: inviteEmail, role: "member" }),
                    });
                    if (!res.ok) throw new Error(await res.text());
                    toast.success("Invitation sent!");
                    setInviteEmail("");
                  } catch (err) {
                    console.error("Invite error:", err);
                    if (err instanceof Error) {
                      toast.error(`Failed to invite user, ${err.message}`);
                    } else {
                      toast.error("Failed to invite user.");
                    }
                  } finally {
                    setIsInviting(false);
                  }
                }}
              >
                Invite
              </button>
              <span className={`absolute -top-20 left-0 w-96 max-w-xs text-xs text-white bg-gray-800 px-3 py-2 border border-gray-700 rounded shadow transition-opacity duration-200 ${showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="font-bold mb-1 text-white">Team Member Limit Exceeded</div>
                <div className="mb-2 text-gray-200">
                  Your team currently has {members?.length ?? 0} members, which exceeds your plan&apos;s limit ({memberLimit}). Please upgrade your plan or remove extra members to continue.
                </div>
                <button
                  className="bg-white text-black px-3 py-1 rounded text-xs cursor-pointer"
                  onClick={() => {
                    window.open("/pricing", "_blank");
                  }}
                >
                  Upgrade Plan
                </button>
              </span>
            </div>
          </div>
        </div>
      {/* Delete Locator Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete this locator?</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPendingDeleteLocatorId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                onClick={async () => {
                  if (pendingDeleteLocatorId) {
                    await handleDeleteLocator(pendingDeleteLocatorId);
                    setShowDeleteModal(false);
                    setPendingDeleteLocatorId(null);
                  }
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Locator Detail Modal */}
      {/* Members Modal */}
      {showMembersModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30">
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
                onClick={() => setShowMembersModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">Current Members</h3>
              {members && members.length > 0 ? (
                <ul className="divide-y">
                  {members.map((member) => {
                    const canRemove =
                      user?.id !== member.user_id &&
                      (ROLE_RANK[currentUserRole] ?? 0) > (ROLE_RANK[member.role ?? 'member'] ?? 0);
                    return (
                      <li key={member.user_id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        {canRemove && (
                          <button
                            className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                            onClick={() => handleRemoveMember(member.user_id)}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500">No members found.</p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Showing {memOffset + 1}-{memOffset + (members?.length || 0)}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Page size:</span>
                    <select
                      value={memLimit}
                      onChange={(e) => { setMemLimit(Number(e.target.value)); setMemOffset(0); }}
                      className="border rounded px-2 py-1 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setMemOffset(Math.max(memOffset - memLimit, 0))}
                    disabled={memLoading || memOffset === 0}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setMemOffset(memOffset + memLimit)}
                    disabled={memLoading || !memHasMore}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pending Modal */}
      {showPendingModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30">
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
                onClick={() => setShowPendingModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
              {invites && invites.filter((i) => i.accepted === false).length > 0 ? (
                <ul className="divide-y">
                  {invites.filter((i) => i.accepted === false).map((invite) => (
                    <li key={invite.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                        onClick={() => handleRemoveInvite(invite.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No pending invitations.</p>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Showing {invOffset + 1}-{invOffset + (invites?.filter(i => i.accepted === false).length || 0)}
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Page size:</span>
                    <select
                      value={invLimit}
                      onChange={(e) => { setInvLimit(Number(e.target.value)); setInvOffset(0); }}
                      className="border rounded px-2 py-1 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setInvOffset(Math.max(invOffset - invLimit, 0))}
                    disabled={invLoading || invOffset === 0}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setInvOffset(invOffset + invLimit)}
                    disabled={invLoading || !invHasMore}
                    className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {locatorDetail && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30">
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold z-50 cursor-pointer hover:text-gray-300"
            onClick={() => setLocatorDetail(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className="flex items-center justify-center h-full">
            <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto mt-12">
              <div className="sticky top-0 z-10 bg-white p-6 border-b">
                <h3 className="text-lg font-semibold">Locator Detail</h3>
                <p className="text-xs text-gray-500 mt-1">
                  * This is a partial page snapshot. Due to the lack of full web context, rendering issues may occur.
                </p>
                <div className="text-sm text-gray-700 mt-4">
                  <p>
                    <strong>Type:</strong> {locatorDetail.type}
                  </p>
                  <p>
                    <strong>Value:</strong> {locatorDetail.value}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="border p-3 rounded bg-gray-50 mb-4">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-0 z-10 bg-transparent" />
                    <div id="locator-html-preview" dangerouslySetInnerHTML={{ __html: locatorDetail.html }} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                    onClick={() => setLocatorDetail(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </main>
    </SidebarLayout>
  );
}