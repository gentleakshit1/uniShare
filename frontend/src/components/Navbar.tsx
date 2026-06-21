import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  // Dummy auth state for now
  const isLoggedin = false; 

  return (
    <div className="flex justify-center w-full z-50 fixed top-6 px-4 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl px-6 py-3 flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full transition-all duration-500 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:bg-white/90">
      <Link href="/" className="flex items-center gap-2">
        <BookOpen className="text-blue-600 w-6 h-6" />
        <span className="text-xl font-bold tracking-tight text-zinc-900">UniShare</span>
      </Link>
      <div>
        {isLoggedin ? (
          <div className="flex gap-4 items-center">
            <Link href="/dashboard">
              <Button variant="outline" className="hidden sm:flex">Dashboard</Button>
            </Link>
            <Link href="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">Upload</Button>
            </Link>
            <Button variant="ghost" className="rounded-full w-10 h-10 bg-zinc-200">U</Button>
          </div>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700">Log In / Sign Up</Button>
        )}
      </div>
    </header>
    </div>
  );
}
