"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="max-w-3xl mx-auto pt-32 pb-20 px-6 text-left">
        <h1 className="text-4xl font-bold mb-6">About Talk2Dom</h1>

        <p className="mb-6 text-lg leading-relaxed">
          <strong>Talk2Dom</strong> is my solo-built product. I believe a focused one‑person company, armed with the right tools and habits, can deliver enterprise‑grade quality faster and more sustainably.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Why I built Talk2Dom</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li><strong>Reduce fragility.</strong> UI tests fail too often because of brittle locators. Talk2Dom helps teams find elements more reliably and maintain suites with less churn.</li>
          <li><strong>Ship quality, not just code.</strong> Automation should amplify QA coverage and shorten feedback loops—so teams catch issues earlier and ship with confidence.</li>
          <li><strong>Keep it lean.</strong> Simple, composable APIs over heavy platforms. Practical AI where it helps, not AI for AI’s sake.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Who I am</h2>
        <p className="mb-4 text-lg leading-relaxed">
          With over <strong>15+ years</strong> of experience in software across front‑end, back‑end, data analysis, and AI‑related projects, I bring a broad, cross‑disciplinary perspective to building robust and user‑focused solutions. I care deeply about reliability, observability, and developer ergonomics.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li>Built and maintained automation at scale; reduced flaky tests and CI noise.</li>
          <li>Hands-on across the stack: React/Next.js, Python, DevOps, CI/CD, MLOps, model training, fine-tuning, and model evaluation (Eval).</li>
          <li>Data‑driven quality: metrics, tracing, and regression safeguards.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-3">How I work</h2>
        <ul className="list-disc pl-6 space-y-2 text-lg leading-relaxed">
          <li><strong>Quality first.</strong> Clear SLAs, reproducible pipelines, and testable designs.</li>
          <li><strong>Automation over repetition.</strong> Codify processes; remove manual toil.</li>
          <li><strong>Own the outcome.</strong> I partner closely with teams and stay accountable to results.</li>
        </ul>

        <p className="mt-10 mb-4 text-lg leading-relaxed">
          If you’re exploring a lean path to stronger QA—whether with Talk2Dom, custom integrations, or advisory support—let’s talk.
        </p>
        <div className="mt-2">
          <a href="mailto:contact@itbanque.com" className="text-blue-600 underline hover:text-blue-800">contact@itbanque.com</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}