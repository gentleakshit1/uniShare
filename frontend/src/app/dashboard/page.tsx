import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { fetchResources } from "@/lib/api";

// In Next.js App Router, pages are Server Components by default. 
// This means we can make the function async and fetch data directly on the server before sending HTML to the browser!
export default async function DashboardPage() {
  let resources = [];
  let errorMessage = "";

  // Use meaningful try-catch to handle server downtime or fetch failures
  try {
    resources = await fetchResources();
  } catch (error: any) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link href="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Link>
            <h1 className="text-4xl font-extrabold text-zinc-900">Dashboard</h1>
            <p className="text-zinc-500 mt-2">Manage your uploaded resources and profile.</p>
          </div>
          <Link href="/upload" className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 py-2 font-medium transition-colors">
            Upload New
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-zinc-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-800">My Uploads</h2>
              </div>
              
              {errorMessage ? (
                <div className="border border-red-200 bg-red-50 rounded-xl p-8 text-center text-red-600">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Failed to load data</h3>
                  <p>{errorMessage}</p>
                </div>
              ) : resources.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="bg-zinc-100 p-4 rounded-full mb-4">
                    <FileText className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">No resources yet</h3>
                  <p className="text-zinc-500 mb-6">You haven't uploaded any study materials. Start sharing to help others!</p>
                  <Link href="/upload" className="border border-zinc-300 hover:bg-zinc-100 rounded-full px-4 py-2 font-medium transition-colors">
                    Upload a File
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {resources.map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2 opacity-90">Total Resources</h3>
              {/* Dynamically show count */}
              <div className="text-5xl font-extrabold mb-1">{resources.length}</div>
              <p className="text-sm opacity-80">Available in the database</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
