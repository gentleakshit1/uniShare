import { AlertTriangle, GraduationCap } from "lucide-react";
import { fetchResources } from "@/lib/api";
import ClientSearchAndCatalogue from "@/components/ClientSearchAndCatalogue";

export default async function Home() {
  let resources = [];
  let errorMessage = "";

  try {
    // We fetch ALL resources EXACTLY ONCE on the server.
    resources = await fetchResources();
  } catch (error: any) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pt-40 pb-20 relative overflow-hidden bg-white">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 text-blue-700 text-sm font-semibold mb-6 border border-blue-100 hover:bg-blue-100 hover:scale-105 transition-all duration-300 cursor-pointer">
          <GraduationCap className="w-5 h-5" />
          <span>The #1 Student Resource Marketplace</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight max-w-4xl">
          Elevate your learning with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">UniShare</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mb-10 leading-relaxed">
          The ultimate academic vault for students. Find, organize, and download beautifully structured previous year question papers, handwritten notes, and assignments from your peers.
        </p>

        {errorMessage ? (
          <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center text-red-600 max-w-2xl mx-auto mt-10">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Failed to load the catalogue</h3>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <ClientSearchAndCatalogue initialResources={resources} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-12 bg-white text-center text-zinc-500 text-sm">
        <p>Built with Next.js, Django, and TailwindCSS.</p>
        <p className="mt-2 text-zinc-400">Made for students, by students.</p>
      </footer>
    </div>
  );
}
