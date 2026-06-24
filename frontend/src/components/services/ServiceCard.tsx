"use client";

import { UserCircle, Mail, DollarSign } from "lucide-react";

export default function ServiceCard({ service }: { service: any }) {
  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-200/60 dark:border-zinc-800 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full overflow-hidden">
      
      {/* Top Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600/80 dark:to-indigo-800/80 p-4 relative">
        <div className="absolute -bottom-8 left-6 w-16 h-16 bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-md overflow-hidden">
          {service.provider_image_url ? (
            <img src={service.provider_image_url} alt={service.provider_display_name || "Provider"} className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
          )}
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-white font-bold shadow-sm">
          <DollarSign className="w-4 h-4" />
          {service.price}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 pt-12 flex flex-col">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {service.title}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {service.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-2">
          <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Provider: <span className="text-zinc-700 dark:text-zinc-300">{service.provider_display_name || service.provider_name}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
        <a 
          href={`mailto:${service.contact_info}`} 
          className="w-full bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl px-4 py-3 font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Mail className="w-5 h-5" /> Contact Provider
        </a>
      </div>

    </div>
  );
}
