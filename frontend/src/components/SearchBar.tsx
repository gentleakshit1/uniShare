"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // useTransition helps us show a loading state while Next.js fetches new data
  const [isPending, startTransition] = useTransition();
  
  // Local state for instant typing feel
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    // Debounce: Wait 300ms after the user stops typing before hitting the API
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      
      // Soft navigation: This updates the URL and fetches new data WITHOUT reloading the browser
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="w-full max-w-xl relative flex items-center shadow-2xl rounded-2xl bg-white border border-zinc-200 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
      {/* The search icon will pulse blue while we are fetching data from Django */}
      <Search className={`absolute left-4 w-6 h-6 transition-colors ${isPending ? "text-blue-500 animate-pulse" : "text-zinc-400"}`} />
      
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for course code (e.g., CS101) or subject..." 
        className="w-full h-16 pl-14 pr-4 text-lg rounded-2xl border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-zinc-400"
      />
    </div>
  );
}
