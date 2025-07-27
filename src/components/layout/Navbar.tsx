"use client";

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export default function Navbar() {
  const { user } = useUser();
  const isLoggedIn = !!user;

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Talk2Dom Logo" className="h-8 w-auto" />
          <span className="text-2xl font-display text-gray-800">Talk2Dom</span>
        </Link>
        <div className="space-x-6 flex items-center">
          <a href="/pricing" className="text-gray-700 hover:text-black">Pricing</a>
          <a href="/docs" className="text-gray-700 hover:text-black">Docs</a>
          <a
            href="https://github.com/itbanque/talk2dom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-black text-2xl"
          >
            <FaGithub />
          </a>
          {isLoggedIn ? (
            <a href="/projects" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
              To App
            </a>
          ) : (
            <>
              <a href="/login" className="text-gray-700 hover:text-black">Login</a>
              <a href="/register" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}