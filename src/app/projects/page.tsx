"use client";

// app/projects/page.tsx
import { FaFolderOpen, FaCog } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { toast } from "react-hot-toast";


const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";


export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const { user } = useUser();
  const maxProjects = user?.plan === "free" ? 2 : user?.plan === "developer" ? 10 : Infinity;
  const canCreateProject = projects.length < maxProjects;

  const refs = useRef({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/project`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId !== null) {
        const ref = refs.current[openDropdownId];
        if (ref && ref.current && !ref.current.contains(event.target)) {
          setOpenDropdownId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${DOMAIN}/api/v1/project/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setOpenDropdownId(null);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <SidebarLayout>
      <main className="min-h-screen bg-white px-6 py-12 text-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-bold">Your Projects</h1>
            <div
              className="relative"
              onMouseEnter={() => !canCreateProject && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={() => canCreateProject && setShowModal(true)}
                className={`px-5 py-2 rounded-md transition ${
                  canCreateProject
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canCreateProject}
                aria-describedby={!canCreateProject ? "project-limit-tooltip" : undefined}
              >
                + Create Project
              </button>
              {showTooltip && !canCreateProject && (
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-96 max-w-xs text-xs text-white bg-gray-800 px-3 py-2 border border-gray-700 rounded shadow transition-opacity duration-200 z-20">
                  <div className="font-bold mb-1 text-white">Project Limit Reached</div>
                  <div className="mb-2 text-gray-200">
                    You have reached the maximum number of projects ({projects.length}/{maxProjects}) allowed by your plan. Please upgrade your plan to create more projects.
                  </div>
                  <button
                    className="bg-white text-black px-3 py-1 rounded text-xs"
                    onClick={() => window.open("/pricing", "_blank")}
                  >
                    Upgrade Plan
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((p) => {
              if (!refs.current[p.id]) {
                refs.current[p.id] = { current: null };
              }
              return (
                <div
                  key={p.id}
                  className="relative bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-5"
                  ref={(el) => (refs.current[p.id].current = el)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FaFolderOpen className="text-gray-500 text-xl" />
                      <h2 className="text-lg font-semibold text-gray-900">{p.name}</h2>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === p.id ? null : p.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={openDropdownId === p.id}
                      >
                        <FaCog className="text-xl" />
                      </button>
                      {openDropdownId === p.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-sm text-gray-600 hover:text-black underline"
                  >
                    Open Project →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <input
                type="text"
                placeholder="Project name"
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/v1/project/`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                          name: projectName,
                          description: "", // optionally allow input if needed
                        }),
                      });
                      if (!res.ok) throw new Error(await res.text());
                      const newProject = await res.json();
                      setProjects((prev) => [...prev, newProject]);
                      setShowModal(false);
                      setProjectName("");
                    } catch (err) {
                      toast.error(`Failed to create project: ${err.message || err}`);
                      console.error("Error creating project:", err);
                    }
                  }}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </SidebarLayout>
  );
}