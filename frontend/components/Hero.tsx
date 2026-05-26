"use client";

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const badges = [
  { icon: Shield, text: "GitHub & Google OAuth" },
  { icon: Zap, text: "AI-Powered Matching" },
  { icon: Sparkles, text: "12,000+ Founders" },
];

const sampleProfiles = [
  {
    name: "Priya K.",
    role: "Full-Stack Engineer",
    seeking: "Business Co-Founder",
    skills: ["React", "Node.js", "AWS"],
    score: 98,
    color: "from-brand-400 to-violet-500",
    avatar: "PK",
    online: true,
  },
  {
    name: "Tom B.",
    role: "GTM & Sales Lead",
    seeking: "Technical Co-Founder",
    skills: ["B2B Sales", "Fundraising", "GTM"],
    score: 95,
    color: "from-emerald-400 to-brand-500",
    avatar: "TB",
    online: true,
  },
  {
    name: "Sarah M.",
    role: "ML Researcher",
    seeking: "Product Co-Founder",
    skills: ["Python", "LLMs", "MLOps"],
    score: 92,
    color: "from-violet-400 to-pink-500",
    avatar: "SM",
    online: false,
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-medium rounded-full border border-brand-100 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              AI-powered co-founder matching
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Find the co-founder{" "}
              <span className="text-gradient">you&apos;ve been</span>
              <br />
              <span className="text-gradient">waiting for</span>
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              CoFoundersHub uses AI to match you with complementary founders based on skills, work style, values, and vision — not just a LinkedIn keyword search.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
              {badges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-brand-500" />
                  {text}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <SignUpButton mode="modal">
                <button className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25 text-base">
                  Get matched for free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
              <Link
                href="#how-it-works"
                className="flex items-center justify-center px-7 py-3.5 text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-base"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-400 text-center lg:text-left">
              No credit card required · Free forever for basic matching
            </p>
          </div>

          {/* Right: Match cards UI */}
          <div className="flex-1 lg:flex-none lg:w-[460px] relative">
            {/* Main match card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-brand-500/10 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-600 to-violet-700 p-4 flex items-center justify-between">
                <span className="text-white text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI Match Score
                </span>
                <span className="text-white text-xl font-bold">98%</span>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                    PK
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Priya Krishnamurthy</h3>
                    <p className="text-sm text-gray-500">Full-Stack Engineer · Ex-Google · SF Bay Area</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                      <span className="text-xs text-gray-500">Active today</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  &ldquo;Looking for a business-minded co-founder to build the future of developer tooling. I have the technical foundation, you bring the GTM and fundraising experience.&rdquo;
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {["React", "Node.js", "PostgreSQL", "AWS", "System Design"].map((sk) => (
                    <span key={sk} className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full font-medium">{sk}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                  {[
                    { label: "Values Fit", value: "99%" },
                    { label: "Skills Match", value: "97%" },
                    { label: "Vision Align", value: "98%" },
                  ].map((m) => (
                    <div key={m.label} className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-sm font-bold text-gray-900">{m.value}</p>
                      <p className="text-xs text-gray-500">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity">
                    Connect
                  </button>
                  <button className="flex-1 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="absolute -left-6 top-24 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-3.5 animate-float w-44">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold">TB</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Tom B.</p>
                  <p className="text-xs text-gray-500">GTM Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" />
                <span className="text-xs font-bold text-brand-600">95% match</span>
              </div>
            </div>

            <div className="absolute -right-4 bottom-24 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-3.5 animate-float w-44" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">SM</div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Sarah M.</p>
                  <p className="text-xs text-gray-500">ML Researcher</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" />
                <span className="text-xs font-bold text-brand-600">92% match</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
