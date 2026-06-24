"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs'
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <div className="flex justify-center w-full z-50 fixed top-6 px-4 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-5xl px-6 py-3 flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full transition-all duration-500 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:bg-white/90">
      <Link href="/" className="flex items-center gap-2">
        <BookOpen className="text-blue-600 w-6 h-6" />
        <span className="text-xl font-bold tracking-tight text-zinc-900">UniShare</span>
      </Link>
      <div>
        <Show when="signed-in">
          <div className="flex gap-4 items-center">
            {pathname !== '/dashboard' && (
              <Link href="/dashboard">
                <Button variant="outline" className="hidden sm:flex">Dashboard</Button>
              </Link>
            )}
            {pathname !== '/upload' && pathname !== '/dashboard' && (
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">Upload</Button>
              </Link>
            )}
            <UserButton />
          </div>
        </Show>
        <Show when="signed-out">
          <div className="flex gap-2 items-center">
            <SignInButton mode="modal">
              <Button variant="ghost" className="font-semibold text-zinc-600 hover:text-zinc-900">Log In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">Sign Up</Button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </header>
    </div>
  );
}
