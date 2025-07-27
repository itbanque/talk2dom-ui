"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DOMAIN } from "@/lib/constants";
import { FaChartBar, FaUsers, FaArrowLeft } from "react-icons/fa";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useUser } from "@/context/UserContext";
import { Line } from "react-chartjs-2";
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
    if (!id) return;
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/project/${id}/members`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
        setMembers([]);
      }
    };
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchInvites = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/project/${id}/invites`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch invites");
        const data = await res.json();
        setInvites(data);
      } catch (error) {
        console.error("Error fetching invites:", error);
        setInvites([]);
      }
    };
    fetchInvites();
  }, [id]);

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
      setInvites((prev) => prev ? prev.filter(invite => invite.id !== userId) : null);
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
      setMembers((prev) =>
        prev ? prev.filter((m) => m.user_id !== userId) : null
      );
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <SidebarLayout>
      <main className="min-h-screen bg-white text-gray-800 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none border border-gray-300 text-gray-600"
              aria-label="Back"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold">Project Dashboard</h1>
          </div>
          <div className="mb-8 text-sm text-gray-600 flex items-center gap-2">
            <span>Project ID:</span>
            <span className="font-mono text-black">{projectId}</span>
            <button
              className="text-blue-600 text-xs border border-blue-600 px-2 py-0.5 rounded hover:bg-blue-50"
              onClick={() => {
                if (projectId) {
                  navigator.clipboard.writeText(projectId);
                  toast.success("Project ID copied to clipboard");
                }
              }}
            >
              Copy
            </button>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaChartBar /> API Usage (Last 30 Days)
            </h2>
            <div className="w-full min-h-[400px] bg-white border border-gray-300 rounded p-4">
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

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers /> Team Members
            </h2>
        <div className="bg-white border border-gray-200 rounded p-4 text-gray-800">
          {(members === null || invites === null) ? (
            <p className="text-gray-500">Loading members...</p>
          ) : members.length === 0 && invites.filter(invite => invite.accepted === false).length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((member) => {
                // Only allow removing if:
                // - not self
                // - current user's role is higher than member's role
                const canRemove =
                  user?.id !== member.user_id &&
                  (ROLE_RANK[currentUserRole] ?? 0) > (ROLE_RANK[member.role ?? "member"] ?? 0);
                return (
                  <li key={member.user_id} className="flex justify-between items-center border-b py-2">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                    <span className="flex items-center gap-2 text-xs text-gray-500 italic">
                      {member.role ?? "member"}
                      {canRemove && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveMember(member.user_id)}
                          aria-label="Remove member"
                        >
                          Remove
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
              {invites.filter(invite => invite.accepted === false).map((invite) => (
                <li key={invite.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <p className="font-medium">{invite.email}</p>
                  </div>
                  <span className="flex items-center gap-2 text-xs text-gray-500 italic">
                    pending
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveInvite(invite.id)}
                      aria-label="Remove invite"
                    >
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
          </section>
          <div className="mt-6">
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
                className="bg-black text-white px-3 py-1 rounded text-sm disabled:opacity-50"
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
                    toast.error(`Failed to invite user, ${err.message || err}`);
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
                  className="bg-white text-black px-3 py-1 rounded text-xs"
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
      </main>
    </SidebarLayout>
  );
}