"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/context/UserContext";


const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

const navItems: { label: string; href: string; external?: boolean }[] = [
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
  }, [user]);

  return (
    <div className="min-h-screen flex bg-white text-gray-800 fixed inset-0 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 border-r border-gray-200 p-6 flex flex-col h-screen">
        <div className="flex-grow">
          <h2 className="text-xl font-bold mb-6">Talk2Dom</h2>
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
                  className={`text-sm font-medium hover:text-black ${
                    pathname.startsWith(item.href)
                      ? "text-black font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
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
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            Docs
          </a>
        </div>
        <SidebarUserMenu />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-10">{children}</main>
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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
          {user?.name?.[0] || "U"}
        </div>
        <div className="text-sm font-medium text-gray-700">
          {user?.name || user?.email?.split("@")[0] || "Username"}
        </div>
      </button>
      {menuOpen && (
        <div className="absolute bottom-12 left-0 w-48 bg-white border border-gray-200 rounded shadow-lg">
          <div className="px-4 py-2 text-sm text-gray-700">{user?.email || "user@example.com"}</div>
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
  );
}