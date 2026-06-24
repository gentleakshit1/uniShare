"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-32 pb-20 z-10"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight max-w-4xl drop-shadow-sm">
        Elevate your learning with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">UniShare</span>
      </h1>
      
      <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
        The ultimate academic vault. Discover, organize, and download beautifully structured previous year papers, handwritten notes, and assignments shared by your peers.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/dashboard" className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 transition-all hover:-translate-y-1 shadow-lg shadow-zinc-900/20 dark:shadow-white/10">
          Explore Resources <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/services" className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 px-8 py-4 rounded-full text-lg font-semibold transition-all hover:-translate-y-1 shadow-sm">
          Hire Freelancers
        </Link>
      </div>
    </motion.section>
  );
}
