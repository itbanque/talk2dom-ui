"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

export default function Navbar({ addSpacer = true, spacerClassName = "h-16" }: { addSpacer?: boolean; spacerClassName?: string }) {
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Docs" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-sm dark:border-white/10 dark:bg-black/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 rounded-full px-2 py-1 text-left transition hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <img src="/logo.png" alt="Talk2Dom Logo" className="h-8 w-auto" />
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">Talk2Dom</span>
            </button>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition hover:text-gray-900 dark:hover:text-white ${
                  isActive(item.href) ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 text-xl text-gray-600 dark:text-gray-300">
              <a
                href="https://github.com/itbanque/talk2dom"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gray-900 dark:hover:text-white"
              >
                <FaGithub />
              </a>
              <a
                href="https://discord.gg/8EU6QxhB"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gray-900 dark:hover:text-white"
              >
                <FaDiscord />
              </a>
            </div>
            {isLoggedIn ? (
              <Link
                href="/projects"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                To App
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition hover:text-gray-900 dark:hover:text-white ${
                    isActive("/login") ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/30 dark:hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            type="button"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        <div
          className={`md:hidden transition-[max-height,opacity] ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden border-t border-gray-200/70 bg-white/95 px-4 pb-4 shadow-sm dark:border-white/10 dark:bg-black/80`}
        >
          <div className="flex flex-col gap-3 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold transition hover:text-gray-900 dark:hover:text-white ${
                  isActive(item.href) ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 text-xl text-gray-600 dark:text-gray-300">
              <a
                href="https://github.com/itbanque/talk2dom"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gray-900 dark:hover:text-white"
              >
                <FaGithub />
              </a>
              <a
                href="https://discord.gg/8EU6QxhB"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-gray-900 dark:hover:text-white"
              >
                <FaDiscord />
              </a>
            </div>
            {isLoggedIn ? (
              <Link
                href="/projects"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                To App
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition hover:text-gray-900 dark:hover:text-white ${
                    isActive("/login") ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {addSpacer && <div className={spacerClassName} />}
    </>
  );
}
