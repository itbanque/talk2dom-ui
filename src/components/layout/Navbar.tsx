"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function Navbar({ addSpacer = true, spacerClassName = "h-16" }: { addSpacer?: boolean; spacerClassName?: string }) {
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 w-full border-b z-50 border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
        <nav className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-4 space-y-4 sm:space-y-0">
          <div className="w-full flex justify-between items-center sm:w-auto">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
              <img src="/logo.png" alt="Talk2Dom Logo" className="h-8 w-auto" />
              <span className="text-2xl font-semibold font-sans text-gray-800 dark:text-gray-100">Talk2Dom</span>
            </button>
            <button
              className="sm:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
          <div className={`flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 ${menuOpen ? "flex" : "hidden"} sm:flex`}>
            <a
              href="/pricing"
              className={`${pathname === "/pricing"
                ? "text-gray-900 dark:text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
              } hover:text-black dark:hover:text-white`}
            >
              Pricing
            </a>
            <a
              href="/docs"
              className={`${pathname === "/docs"
                ? "text-gray-900 dark:text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
              } hover:text-black dark:hover:text-white`}
            >
              Docs
            </a>
            <a
              href="/about"
              className={`${pathname === "/about"
                ? "text-gray-900 dark:text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
              } hover:text-black dark:hover:text-white`}
            >
              About
            </a>
            <a
              href="https://github.com/itbanque/talk2dom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl"
            >
              <FaGithub />
            </a>
            {isLoggedIn ? (
              <a
                href="/projects"
                className={`${pathname === "/projects" ? "font-semibold" : ""} px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary`}
              >
                To App
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className={`${pathname === "/login"
                    ? "text-gray-900 dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                  } hover:text-black dark:hover:text-white`}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className={`${pathname === "/register" ? "font-semibold" : ""} px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary`}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </nav>
      </header>
      {addSpacer && <div className={spacerClassName} />}
    </>
  );
}