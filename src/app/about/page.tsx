"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="max-w-3xl mx-auto pt-32 pb-20 px-6 text-left">
        <h1 className="text-4xl font-bold mb-6">About Talk2Dom</h1>
        <p className="mb-4 text-lg leading-relaxed">
          <strong>Talk2Dom</strong> is a one-person company built by a passionate software engineer who believes AI can redefine how we interact with the web.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Unlike traditional UI automation tools, Talk2Dom lets you describe what you want in natural language — and the AI figures out how to do it.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          One-person companies are thriving like never before. Thanks to AI, what once took a team of engineers can now be built, shipped, and maintained by a single developer. Tools like ChatGPT, Copilot, and open-source AI models dramatically lower the cost of development and speed up iteration cycles.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          This project is handcrafted and maintained by a solo developer who obsesses over quality, developer experience, and real-world usability.
        </p>
        <p className="mb-4 text-lg leading-relaxed">
          Talk2Dom is part of this new wave — lean, fast, and laser-focused. I'm excited to build in public and help others automate their work in ways they never imagined possible.
        </p>
        <div className="mt-8">
          <a href="mailto:contact@itbanque.com" className="text-blue-600 underline hover:text-blue-800">
            contact@itbanque.com
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}