import { Download } from "lucide-react";

export default function ResourceCard({ resource }: { resource: any }) {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200 p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full min-h-[250px] cursor-pointer">
      {/* Card Header (Badges) */}
      <div className="flex justify-between items-start mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
          {resource.type}
        </span>
        <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
          Sem {resource.semester}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex-1 mb-6 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-zinc-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        <p className="text-zinc-500 font-medium line-clamp-1 mb-1">
          {resource.course}
        </p>
        <p className="text-sm text-zinc-400 line-clamp-1">
          Topic: {resource.subject}
        </p>
      </div>

      {/* Card Footer (Action) */}
      <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="text-xs text-zinc-400">
          Added recently
        </div>
        <a href={resource.file} target="_blank" rel="noopener noreferrer" className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
        </a>
      </div>
    </div>
  );
}
