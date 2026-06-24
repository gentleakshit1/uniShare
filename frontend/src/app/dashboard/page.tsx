import { AlertTriangle, Library } from "lucide-react";
import { fetchResources } from "@/lib/api";
import ClientSearchAndCatalogue from "@/components/ClientSearchAndCatalogue";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardCataloguePage() {
  const { getToken } = await auth();
  
  let resources = [];
  let errorMessage = "";

  try {
    const token = await getToken();
    resources = await fetchResources("", token);
  } catch (error: any) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 pt-32 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Resource Vault</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">Search, discover, and download materials shared by your peers.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/profile" className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full px-6 py-2.5 font-semibold transition-colors shadow-sm text-center">
              My Profile
            </Link>
            <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 font-semibold transition-colors shadow-lg shadow-blue-500/30 text-center">
              Share Resource
            </Link>
          </div>
        </div>
        
        {errorMessage ? (
          <div className="border border-red-200 bg-red-50 rounded-3xl p-8 text-center text-red-600 max-w-2xl mx-auto mt-10">
            <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Failed to load the catalogue</h3>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <ClientSearchAndCatalogue initialResources={resources} />
        )}
      </div>
    </div>
  );
}
