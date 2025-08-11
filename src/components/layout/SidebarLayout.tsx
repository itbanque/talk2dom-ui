"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";
import { BeakerIcon, FolderIcon, KeyIcon, CreditCardIcon, DocumentTextIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";


const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

const navItems: { label: string; href: string; external?: boolean }[] = [
  { label: "Playground", href: "/playground" },
  { label: "Projects", href: "/projects" },
  { label: "API Keys", href: "/apikeys" },
  { label: "Billing", href: "/billing" },
];

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarLayoutInner>{children}</SidebarLayoutInner>
    </UserProvider>
  );
}

function SidebarLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Checking login status...</span>
      </div>
    );
  }

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user && (user as any).is_active === false) {
      router.push("/verify-email");
    }
  }, [user, router]);

  return (
    <div className="h-screen overflow-hidden flex bg-white text-gray-800">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <button
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <Link href="/projects" className="text-base font-bold">
          Talk2Dom
        </Link>
        <div className="w-6" />
      </div>

      {/* Mobile sidebar (drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-white text-gray-800 p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/projects"
                className="inline-block text-lg font-bold px-3 py-1 rounded hover:bg-gray-100 transition"
                onClick={() => setMobileOpen(false)}
              >
                Talk2Dom
              </Link>
              <button
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-500 hover:text-black"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium rounded px-2 py-1 transition ${
                      pathname.startsWith(item.href)
                        ? "bg-gray-100 text-black font-semibold"
                        : "text-gray-600 hover:text-black hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <>
                      {item.label === "Playground" && (
                        <>
                          <BeakerIcon className="w-5 h-5 inline mr-2" />
                          {item.label}
                        </>
                      )}
                      {item.label === "Projects" && (
                        <>
                          <FolderIcon className="w-5 h-5 inline mr-2" />
                          {item.label}
                        </>
                      )}
                      {item.label === "API Keys" && (
                        <>
                          <KeyIcon className="w-5 h-5 inline mr-2" />
                          {item.label}
                        </>
                      )}
                      {item.label === "Billing" && (
                        <>
                          <CreditCardIcon className="w-5 h-5 inline mr-2" />
                          {item.label}
                        </>
                      )}
                    </>
                  </Link>
                )
              )}
            </nav>
            <div className="mt-auto">
              <div className="mt-4 mb-6">
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 hover:text-black flex items-center space-x-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Docs</span>
                </a>
              </div>
              <SidebarUserMenu />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-white text-gray-800 p-6 flex-col h-screen shadow-xl flex-shrink-0">
        <div className="flex-grow">
          <Link
            href="/projects"
            className="inline-block text-xl font-bold px-4 py-2 mb-8 rounded hover:bg-gray-100 transition hover:shadow-md"
          >
            Talk2Dom
          </Link>
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-500 hover:text-black"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium rounded px-2 py-1 transition ${
                    pathname.startsWith(item.href)
                      ? "bg-gray-100 text-black font-semibold"
                      : "text-gray-600 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <>
                    {item.label === "Playground" && (
                      <>
                        <BeakerIcon className="w-5 h-5 inline mr-2" />
                        {item.label}
                      </>
                    )}
                    {item.label === "Projects" && (
                      <>
                        <FolderIcon className="w-5 h-5 inline mr-2" />
                        {item.label}
                      </>
                    )}
                    {item.label === "API Keys" && (
                      <>
                        <KeyIcon className="w-5 h-5 inline mr-2" />
                        {item.label}
                      </>
                    )}
                    {item.label === "Billing" && (
                      <>
                        <CreditCardIcon className="w-5 h-5 inline mr-2" />
                        {item.label}
                      </>
                    )}
                  </>
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="mt-4 mb-6">
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-black flex items-center space-x-2"
          >
            <DocumentTextIcon className="w-5 h-5" />
            <span>Docs</span>
          </a>
        </div>
        <SidebarUserMenu />
      </aside>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto">
        <main className="p-10 pt-16 md:pt-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarUserMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-auto">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center space-x-3 focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.[0] || "U"}
          </div>
          <div className="text-sm font-medium text-black">
            {user?.name || user?.email?.split("@")[0] || "Username"}
          </div>
        </button>
        {menuOpen && (
          <div className="absolute bottom-12 left-0 w-48 bg-white text-black border border-gray-700 rounded shadow-lg z-50">
            <div className="px-4 py-2 text-sm text-black">{user?.email || "user@example.com"}</div>
            <hr className="border-gray-200" />
            <a
              href={`${DOMAIN}/api/v1/user/logout`}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    </div>
  );
}