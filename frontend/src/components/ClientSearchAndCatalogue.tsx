"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Library } from "lucide-react";
import Link from "next/link";
import ResourceCard from "@/components/ResourceCard";

export default function ClientSearchAndCatalogue({ initialResources }: { initialResources: any[] }) {
  const [query, setQuery] = useState("");

  // Optimal Client-Side Search Algorithm (Memoized Multi-Token Match)
  // This is significantly faster than hitting an API on every keystroke.
  const filteredResources = useMemo(() => {
    if (!query.trim()) return initialResources;

    // 1. Tokenize: Break the query into individual words (e.g., "cs101 midterm" -> ["cs101", "midterm"])
    const searchTokens = query.toLowerCase().trim().split(/\s+/);

    return initialResources.filter((resource) => {
      // 2. Index: Create a single searchable text blob for this resource
      const searchableText = `${resource.title} ${resource.course} ${resource.subject} ${resource.type}`.toLowerCase();
      
      // 3. Match: Ensure EVERY token is found somewhere in the text (AND logic)
      return searchTokens.every(token => searchableText.includes(token));
    });
  }, [query, initialResources]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Lightning Fast Local Search Bar */}
      <div className="w-full max-w-xl relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus-within:ring-4 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20 z-10">
        <Search className="absolute left-4 w-6 h-6 text-zinc-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for course code (e.g., CS101) or subject..." 
          className="w-full h-16 pl-14 pr-4 text-lg rounded-2xl border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {query && (
        <div className="mt-6 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 z-10">
          Showing results for: <span className="font-semibold text-zinc-900 dark:text-zinc-100">"{query}"</span>
          <button onClick={() => setQuery("")} className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Clear search</button>
        </div>
      )}

      {/* Live Resources Catalogue Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950/50 py-20 px-6 border-t border-zinc-100 dark:border-zinc-800/50 w-full mt-12 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <Library className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">Recent Study Materials</h2>
          </div>

          {filteredResources.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center max-w-3xl mx-auto shadow-sm">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-5 rounded-full inline-block mb-6">
                <span className="text-4xl text-zinc-400 dark:text-zinc-500">📄</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No resources found</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
                {query 
                  ? "We couldn't find any materials matching your search. Try a different course code!" 
                  : "The database is currently empty. Be the first to share your notes!"}
              </p>
              <Link href="/upload">
                <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-8">Be the first to Upload</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource: any) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
