"use client";

import Link from "next/link";
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-violet-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">CoFoundersHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              How it works
            </Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#stories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Success Stories
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm shadow-brand-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Start matching free
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {["Features", "How it works", "Pricing", "Success Stories"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="block text-sm text-gray-600 hover:text-gray-900 py-2 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
            {isSignedIn ? (
              <Link href="/dashboard" className="text-sm font-medium text-brand-600 py-2">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-gray-700 py-2 text-left">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-violet-600 py-2.5 px-4 rounded-lg w-full">
                    Start matching free
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
