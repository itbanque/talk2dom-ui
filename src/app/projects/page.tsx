"use client";

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

// app/projects/page.tsx
import { FiBox, FiSettings, FiGrid, FiList, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useUser } from "@/context/UserContext";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { toast } from "react-hot-toast";


const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";


type Project = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
  owner_email: string;
  member_count: number;
  api_calls: number;
  is_active: boolean;
};
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState<string>("");

  const [viewMode, setViewMode] = useState<'card' | 'list'>(() => {
    if (typeof window === 'undefined') return 'card';
    const v = window.localStorage.getItem('projects_view');
    return v === 'list' ? 'list' : 'card';
  });

  const [limit, setLimit] = useState(9);
  const [offset, setOffset] = useState(0);

  const { user } = useUser();
  const maxProjects = user?.plan === "free" ? 2 : user?.plan === "developer" ? 10 : Infinity;
  const canCreateProject = projects.length < maxProjects;

  const refs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});

  // fetchProjects 支持 limit 和 offset 参数
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const fetchProjects = async (limit: number, offset: number) => {
    setProjectsLoaded(false);
    try {
      const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
      const res = await fetch(`${DOMAIN}/api/v1/project?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      // Expect API to return { items: Project[], has_next: boolean }
      if (data && data.items) {
        setProjects(data.items);
        setHasMore(!!data.has_next);
        setTotal(null);
        // Edge case: if not first page and API returns empty (e.g., after deletions), jump back a page
        if (offset > 0 && data.items.length === 0) {
          setOffset(Math.max(offset - limit, 0));
        }
      } else {
        setProjects([]);
        setHasMore(false);
        setTotal(null);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setProjectsLoaded(true);
    }
  };

  useEffect(() => {
    fetchProjects(limit, offset);
  }, [limit, offset]);

  useEffect(() => {
    window.dataLayer?.push({
      event: "page_view",
      page_name: "project_list",
    });
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem('projects_view', viewMode); } catch {}
  }, [viewMode]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (openDropdownId !== null) {
          const ref = refs.current[openDropdownId];
          if (ref && ref.current && !ref.current.contains(event.target as Node)) {
            setOpenDropdownId(null);
          }
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openDropdownId]);

  // Step-by-step guided tour (coach marks)
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState<1 | 2 | 3>(1);
  const createBtnRef = useRef<HTMLButtonElement | null>(null);
  // Analytics: fire an event on each step change while the tour is open
  useEffect(() => {
    if (!tourOpen) return;
    window.dataLayer?.push({
      event: 'first_project_tour_step',
      step: tourStep,
    });
  }, [tourStep, tourOpen]);
  const modalNameRef = useRef<HTMLInputElement | null>(null);
  const modalCreateRef = useRef<HTMLButtonElement | null>(null);
  const [spotRect, setSpotRect] = useState<{top:number;left:number;width:number;height:number} | null>(null);

  useEffect(() => {
    if (!projectsLoaded) return; // wait until projects have been fetched
    if (projects.length === 0) {
      setTourOpen(true);
      setTourStep(1);
    } else {
      setTourOpen(false);
    }
  }, [projects.length, projectsLoaded]);

  useEffect(() => {
    if (tourOpen && showModal) {
      setTourStep(2);
    }
  }, [tourOpen, showModal]);


  useEffect(() => {
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
  }, [tourStep, tourOpen, showModal]);

  // --- Stabilized measurement for spotlight/tour ---
  const lastRectRef = useRef<{top:number;left:number;width:number;height:number} | null>(null);

  const ensureVisibleAndMeasure = () => {
    let el: HTMLElement | null = null;
    if (tourStep === 1) el = createBtnRef.current || null;
    else if (tourStep === 2) el = (modalNameRef.current as HTMLElement | null);
    else if (tourStep === 3) el = (modalCreateRef.current as HTMLElement | null);
    if (!el) {
      setSpotRect(null);
      return;
    }
    // If element is outside viewport, bring it to center first
    const vr = el.getBoundingClientRect();
    const fullyOut = vr.bottom < 0 || vr.top > window.innerHeight || vr.right < 0 || vr.left > window.innerWidth;
    if (fullyOut) {
      try { el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' }); } catch {}
    }

    // Measure with rAF until stable to dodge late layout shifts (fonts/SSR hydration)
    let attempts = 0;
    const measure = () => {
      attempts += 1;
      const r = el!.getBoundingClientRect();
      const next = { top: r.top, left: r.left, width: r.width, height: r.height };
      const prev = lastRectRef.current;
      const stable = prev && Math.abs(prev.top - next.top) < 0.5 && Math.abs(prev.left - next.left) < 0.5 && Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5;
      lastRectRef.current = next;
      setSpotRect(next);
      if (!stable && attempts < 6) {
        requestAnimationFrame(measure);
      }
    };
    requestAnimationFrame(measure);
  };

  useEffect(() => {
    if (!tourOpen) return;
    ensureVisibleAndMeasure();
  }, [tourOpen, tourStep, showModal, projects.length, viewMode]);

  useEffect(() => {
    if (!tourOpen) return;
    const target = document.body;
    const obs = new MutationObserver(() => ensureVisibleAndMeasure());
    obs.observe(target, { childList: true, subtree: true, attributes: true });
    return () => obs.disconnect();
  }, [tourOpen, tourStep]);


  // Guided tour Next/Back handlers
  const handleTourNext = () => {
    if (tourStep === 1) {
      if (!showModal) setShowModal(true);
      setTourStep(2);
      window.dataLayer?.push({ event: 'first_project_tour_next', from: 1, to: 2 });
      return;
    }
    if (tourStep === 2) {
      if (!projectName.trim()) {
        toast.error('Please enter a project name.');
        modalNameRef.current?.focus();
        return;
      }
      setTourStep(3);
      modalCreateRef.current?.focus();
      window.dataLayer?.push({ event: 'first_project_tour_next', from: 2, to: 3 });
      return;
    }
  };

  const handleTourBack = () => {
    if (tourStep === 3) {
      setTourStep(2);
      window.dataLayer?.push({ event: 'first_project_tour_prev', from: 3, to: 2 });
      return;
    }
    if (tourStep === 2) {
      setTourStep(1);
      if (showModal) setShowModal(false);
      window.dataLayer?.push({ event: 'first_project_tour_prev', from: 2, to: 1 });
      return;
    }
  };

  // Focus helper for guided tour step 3
  const handleForceCreate = () => {
    // Ensure modal visible and on step 3
    if (!showModal) setShowModal(true);
    if (tourStep !== 3) setTourStep(3);

    // Try multiple frames until the button mounts, then click it
    let tries = 0;
    const attempt = () => {
      const btn = modalCreateRef.current;
      if (btn) {
        try { btn.scrollIntoView({ block: 'center', inline: 'nearest' }); } catch {}
        // If name is empty, let the original onClick handler show the toast
        btn.click();
        window.dataLayer?.push({ event: 'first_project_tour_force_create_click' });
        return;
      }
      if (tries++ < 10) requestAnimationFrame(attempt);
    };
    requestAnimationFrame(attempt);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${DOMAIN}/api/v1/project/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects(limit, offset);
      setOpenDropdownId(null);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <SidebarLayout>
      <main className="min-h-screen px-4 py-4 md:px-6 md:py-12 text-gray-900 dark:text-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl font-bold">Your Projects</h1>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden md:flex items-center rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden" role="tablist" aria-label="Toggle view">
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  aria-pressed={viewMode === 'card'}
                  className={`px-3 py-2 text-sm flex items-center gap-2 ${
                    viewMode === 'card'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title="Card view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  className={`px-3 py-2 text-sm flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 ${
                    viewMode === 'list'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  title="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* Create Project */}
              <div
                className="relative"
                onMouseEnter={() => !canCreateProject && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  ref={createBtnRef}
                  onClick={() => canCreateProject && setShowModal(true)}
                  className={`px-5 py-2 rounded-md transition w-full md:w-auto ${
                    canCreateProject
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!canCreateProject}
                  aria-describedby={!canCreateProject ? 'project-limit-tooltip' : undefined}
                >
                  + Create Project
                </button>
                {showTooltip && !canCreateProject && (
                  <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 max-w-xs text-xs text-white bg-gray-800 px-3 py-2 border border-gray-700 rounded shadow transition-opacity duration-200 z-20" id="project-limit-tooltip">
                    <div className="font-bold mb-1 text-white">Project Limit Reached</div>
                    <div className="mb-2 text-gray-200">
                      You have reached the maximum number of projects ({projects.length}/{maxProjects}) allowed by your plan. Please upgrade your plan to create more projects.
                    </div>
                    <button
                      className="bg-white text-black px-3 py-1 rounded text-xs"
                      onClick={() => window.open('/pricing', '_blank')}
                    >
                      Upgrade Plan
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>



          {/* Card View */}
          {projects.length > 0 && viewMode === 'card' && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {projects.map((p) => {
                if (!refs.current[p.id]) {
                  refs.current[p.id] = React.createRef<HTMLDivElement>();
                }
                return (
                  <div
                    key={p.id}
                    ref={refs.current[p.id]}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (!refs.current[p.id]?.current?.querySelector('.settings-button')?.contains(target)) {
                        window.dataLayer?.push({
                          event: 'project_card_click',
                          project_id: p.id,
                          project_name: p.name,
                        });
                        window.location.href = `/project/${p.id}`;
                      }
                    }}
                    className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-gray-800 p-6 shadow hover:shadow-xl transition duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center group-hover:ring-indigo-300/60 transition">
                          <FiBox className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition">{p.name}</h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Created on {new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="relative settings-button">
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          aria-haspopup="true"
                          aria-expanded={openDropdownId === p.id}
                        >
                          <FiSettings className="text-xl" />
                        </button>
                        {openDropdownId === p.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-10">
                            <button
                              onClick={() => { setEditProjectId(p.id); setEditProjectName(p.name); setShowEditModal(true); setOpenDropdownId(null); }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteProjectId(p.id);
                                setDeleteProjectName(p.name);
                                setConfirmDeleteOpen(true);
                                setOpenDropdownId(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      <p>👑 Owner: {p.owner_email}</p>
                      <p>👥 Members: {p.member_count}</p>
                      <p>📊 API Calls: {p.api_calls}</p>
                      <p>📌 Status:
                        {p.is_active ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 ml-1">Active</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 ml-1">Inactive</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {projects.length > 0 && viewMode === 'list' && (
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="text-left text-sm">
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Owner</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Members</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">API Calls</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Created</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <Link href={`/project/${p.id}`} className="flex items-center gap-2 group">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-gradient-to-br from-indigo-500/10 to-purple-500/10 ring-1 ring-gray-200 dark:ring-gray-700">
                            <FiBox className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          </span>
                          <span className="text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">{p.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.owner_email}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.member_count}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.api_calls}</td>
                      <td className="px-4 py-3">
                        {p.is_active ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Active</span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditProjectId(p.id); setEditProjectName(p.name); setShowEditModal(true); }}
                            className="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => { setDeleteProjectId(p.id); setDeleteProjectName(p.name); setConfirmDeleteOpen(true); }}
                            className="px-3 py-1.5 text-xs rounded border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="fixed bottom-4 md:bottom-6 left-0 md:left-64 right-0 z-40 pointer-events-none">
          <div className="mx-auto w-fit px-2 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60 shadow pointer-events-auto flex flex-row items-center justify-center gap-2">
            <button
              onClick={() => setOffset(Math.max(offset - limit, 0))}
              disabled={offset === 0}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              aria-label="Previous"
              title="Previous"
            >
              <FiChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              aria-label="Next"
              title="Next"
            >
              <FiChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-6 shadow-lg w-full max-w-lg mx-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Project</h2>
              <input
                type="text"
                placeholder="New project name"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={editProjectName}
                onChange={(e) => setEditProjectName(e.target.value)}
              />
              <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditProjectId(null);
                    setEditProjectName("");
                  }}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const name = editProjectName.trim();
                    if (!name) {
                      toast.error("Project name cannot be empty.");
                      return;
                    }
                    if (!editProjectId) {
                      toast.error("Missing project id.");
                      return;
                    }
                    try {
                      const res = await fetch(`${DOMAIN}/api/v1/project/${editProjectId}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({ name }),
                      });
                      if (!res.ok) throw new Error(await res.text());
                      window.dataLayer?.push({
                        event: "project_renamed",
                        project_id: editProjectId,
                        project_name: name,
                      });
                      await fetchProjects(limit, offset);
                      toast.success("Project name updated.");
                      setShowEditModal(false);
                      setEditProjectId(null);
                      setEditProjectName("");
                    } catch (err) {
                      if (err instanceof Error) {
                        toast.error(`Failed to update project: ${err.message}`);
                      } else {
                        toast.error("Failed to update project.");
                      }
                      console.error("Error updating project:", err);
                    }
                  }}
                  className="px-4 py-2 rounded cursor-pointer w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-6 shadow-lg w-full max-w-lg mx-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Create New Project</h2>
              <input
                ref={modalNameRef}
                type="text"
                placeholder="Project name"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  ref={modalCreateRef}
                  onClick={async () => {
                    if (!projectName.trim()) {
                      toast.error("Project name cannot be empty.");
                      return;
                    }
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/project`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                          name: projectName,
                          description: "",
                        }),
                      });
                      if (!res.ok) throw new Error(await res.text());
                      const newProject = await res.json();
                      window.dataLayer?.push({
                        event: "project_created",
                        project_name: projectName,
                      });
                      await fetchProjects(limit, offset);
                      setShowModal(false);
                      setProjectName("");
                    } catch (err) {
                      if (err instanceof Error) {
                        toast.error(`Failed to create project: ${err.message}`);
                      } else {
                        toast.error("Failed to create project.");
                      }
                      console.error("Error creating project:", err);
                    }
                  }}
                  className="px-4 py-2 rounded cursor-pointer w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        {confirmDeleteOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-6 shadow-lg w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-3">Delete Project</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete <span className="font-semibold">{deleteProjectName || 'this project'}</span>? This action cannot be undone.
              </p>
              <div className="flex flex-col-reverse md:flex-row justify-end gap-2">
                <button
                  onClick={() => {
                    setConfirmDeleteOpen(false);
                    setDeleteProjectId(null);
                    setDeleteProjectName("");
                  }}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!deleteProjectId) return;
                    await handleDelete(deleteProjectId);
                    setConfirmDeleteOpen(false);
                    setDeleteProjectId(null);
                    setDeleteProjectName("");
                  }}
                  className="px-4 py-2 rounded w-full md:w-auto bg-red-600 text-white hover:bg-red-700 cursor-pointer dark:bg-red-500 dark:hover:bg-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Guided tour overlay */}
        {tourOpen && (
          <div className="fixed inset-0 z-[70] pointer-events-none">
            {/* Spotlight */}
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
            {/* Tooltip card (clickable) */}
            <div
              role="dialog"
              aria-live="polite"
              className={`pointer-events-auto fixed ${spotRect ? '' : 'left-1/2'} `}
              style={spotRect ? { top: spotRect.top + spotRect.height + 12, left: Math.max(12, spotRect.left) } : { bottom: 24, transform: 'translateX(-50%)' }}
            >
              <div className="max-w-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow p-4 text-sm">
                {tourStep === 1 && (
                  <>
                    <div className="font-semibold mb-1">Step 1/3 · Create your first project</div>
                    <div className="text-gray-600 dark:text-gray-300 mb-3">Click the <strong>+ Create Project</strong> button to start.</div>
                  </>
                )}
                {tourStep === 2 && (
                  <>
                    <div className="font-semibold mb-1">Step 2/3 · Name your project</div>
                    <div className="text-gray-600 dark:text-gray-300 mb-3">Give it a clear name. You can change it later.</div>
                    {!showModal && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mb-2">Opening the form… if it doesn't appear, click "+ Create Project".</div>
                    )}
                  </>
                )}
                {tourStep === 3 && (
                  <>
                    <div className="font-semibold mb-1">Step 3/3 · Create</div>
                    <div className="text-gray-600 dark:text-gray-300 mb-3">Hit <strong>Create</strong>. You can add members and API keys afterwards.</div>
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
                  {tourStep === 1 && (
                    <span className="text-xs text-gray-500">(You can also just click the highlighted button)</span>
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