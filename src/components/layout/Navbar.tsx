"use client";

import { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import { usePathname } from "next/navigation";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function Navbar() {
  const { user } = useUser();
  const isLoggedIn = !!user;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <nav className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto px-6 py-4 space-y-4 sm:space-y-0">
        <div className="w-full flex justify-between items-center sm:w-auto">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Talk2Dom Logo" className="h-8 w-auto" />
            <span className="text-2xl font-semibold font-sans text-gray-800">Talk2Dom</span>
          </Link>
          <button
            className="sm:hidden text-gray-700 hover:text-black focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
        <div className={`flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 ${menuOpen ? "flex" : "hidden"} sm:flex`}>
          <a href="/pricing" className={`${pathname === "/pricing" ? "text-black font-semibold" : "text-gray-700"} hover:text-black`}>Pricing</a>
          <a href="/docs" className={`${pathname === "/docs" ? "text-black font-semibold" : "text-gray-700"} hover:text-black`}>Docs</a>
          <a href="/about" className={`${pathname === "/about" ? "text-black font-semibold" : "text-gray-700"} hover:text-black`}>About</a>
          <a
            href="https://github.com/itbanque/talk2dom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-black text-2xl"
          >
            <FaGithub />
          </a>
          {isLoggedIn ? (
            <a href="/projects" className={`${pathname === "/projects" ? "text-black font-semibold" : "bg-black text-white"} px-4 py-2 rounded hover:bg-gray-900`}>
              To App
            </a>
          ) : (
            <>
              <a href="/login" className={`${pathname === "/login" ? "text-black font-semibold" : "text-gray-700"} hover:text-black`}>Login</a>
              <a href="/register" className={`${pathname === "/register" ? "text-black font-semibold" : "bg-black text-white"} px-4 py-2 rounded hover:bg-gray-900`}>
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}