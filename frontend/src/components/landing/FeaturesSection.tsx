"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, FileText } from "lucide-react";

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-lg border-t border-zinc-200/50 dark:border-zinc-800/50 z-10 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Why use UniShare?</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">Everything you need to ace your semesters, completely crowd-sourced by your classmates.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Premium Notes</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Access high-quality, verified study materials tailored to your specific courses.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group">
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Community Driven</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Collaborate with peers, upvote the best resources, and help each other succeed.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 group">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Secure Vault</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Your files are safely stored in our secure cloud platform. Access them anytime, anywhere.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
