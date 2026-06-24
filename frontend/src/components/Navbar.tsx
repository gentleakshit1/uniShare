"use client";

import { BookOpen, Moon, Sun, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure theme toggle only renders on client to prevent hydration mismatch
  useEffect(() => setMounted(true), []);

  // Shrink the navbar slightly when scrolling down
  const { scrollY } = useScroll();
  const navWidth = useTransform(scrollY, [0, 100], ["100%", "90%"]);
  const navY = useTransform(scrollY, [0, 100], [24, 16]);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50 px-4 pointer-events-none">
      <motion.header 
        style={{ width: navWidth, y: navY, maxWidth: "1200px" }}
        className="pointer-events-auto flex justify-between items-center px-6 py-4 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-blue-900/5 dark:shadow-blue-500/5 rounded-full transition-colors duration-500"
      >
        
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">Uni<span className="text-blue-600 dark:text-blue-400">Share</span></span>
        </Link>

        {/* Right: Links, Actions & Auth */}
        <div className="flex items-center gap-6">
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
              Vault
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link href="/services" className="hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
              Marketplace
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </nav>

          <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

          {/* Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <Show when="signed-in">
            <div className="flex items-center gap-4">
              {pathname !== '/upload' && (
                <Link href="/upload" className="hidden sm:flex items-center gap-2 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-md">
                  Upload <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200 dark:border-zinc-800">
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
              </div>
            </div>
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

        </div>
      </motion.header>
    </div>
  );
}
