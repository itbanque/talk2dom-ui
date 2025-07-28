"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { DOMAIN } from "@/lib/constants";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";



export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/projects");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <div className="h-screen w-screen bg-white" />;
  }

  
  const handleGoogleLogin = () => {
    window.location.href = `${DOMAIN}/api/v1/auth/google/login`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${DOMAIN}/api/v1/auth/email/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
    <Navbar />
      <main>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center text-black">Create an Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-black placeholder:text-gray-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Register
            </button>
          </form>
          <div className="my-6 flex items-center justify-center">
            <div className="h-px bg-gray-300 flex-grow" />
            <span className="mx-3 text-sm text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-grow" />
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition text-black"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account? <a href="/login" className="text-black hover:underline">Log in</a>
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}