"use client";

import { Download, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { voteResource, downloadResource } from "@/lib/api";
import Link from "next/link";

export default function ResourceCard({ resource }: { resource: any }) {
  const { getToken, isSignedIn } = useAuth();
  
  const [upvotes, setUpvotes] = useState(resource.upvotes || 0);
  const [downvotes, setDownvotes] = useState(resource.downvotes || 0);
  const [downloads, setDownloads] = useState(resource.downloads_count || 0);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: 'UP' | 'DOWN', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) {
      alert("Please log in to vote!");
      return;
    }
    if (isVoting) return;

    try {
      setIsVoting(true);
      const token = await getToken();
      if (!token) return;

      const res = await voteResource(resource.id, type, token);
      setUpvotes(res.upvotes);
      setDownvotes(res.downvotes);
    } catch (err) {
      console.error("Voting failed", err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloads(prev => prev + 1); // Optimistic UI update
      const res = await downloadResource(resource.id);
      setDownloads(res.downloads_count);
    } catch (err) {
      console.error("Download tracking failed", err);
    }
  };

  const voteScore = upvotes - downvotes;

  return (
    <Link href={`/resource/${resource.id}`} className="block h-full">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-zinc-200/60 dark:border-zinc-800 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full min-h-[300px] overflow-hidden">
        
        {/* Optional Image Preview Area */}
        <div className="h-32 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center border-b border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden">
          {resource.preview_url ? (
            <img src={resource.preview_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500" />
          ) : (
            <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
          )}
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
              {resource.type}
            </span>
            <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              Sem {resource.semester}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {resource.title}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium line-clamp-1 mb-1">
            {resource.course}
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 line-clamp-1">
            Topic: {resource.subject}
          </p>
          <div className="mt-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            By: <span className="text-zinc-600 dark:text-zinc-400">{resource.uploaded_by_name || 'Anonymous'}</span>
          </div>
        </div>

        {/* Card Footer (Action) */}
        <div className="mt-auto px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          
          {/* Voting UI */}
          <div className="flex items-center bg-white dark:bg-zinc-950 rounded-full border border-zinc-200 dark:border-zinc-800 p-1 shadow-sm">
            <button 
              onClick={(e) => handleVote('UP', e)}
              disabled={isVoting}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors disabled:opacity-50"
              aria-label="Upvote"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            
            <span className="px-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 min-w-[2ch] text-center">
              {voteScore}
            </span>
            
            <button 
              onClick={(e) => handleVote('DOWN', e)}
              disabled={isVoting}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
              aria-label="Downvote"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
              {downloads} dl{downloads !== 1 ? 's' : ''}
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(resource.file_url || resource.file, '_blank', 'noopener,noreferrer');
                handleDownload(e);
              }}
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
