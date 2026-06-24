import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, Download, ArrowUpCircle } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import { fetchMyResources } from "@/lib/api";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { getToken, userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }

  let data = { resources: [], stats: { total_uploads: 0, total_downloads: 0, total_upvotes: 0 } };
  let errorMessage = "";

  try {
    const token = await getToken();
    if (token) {
      data = await fetchMyResources(token);
    }
  } catch (error: any) {
    errorMessage = error.message;
  }

  const { resources, stats } = data;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 pt-32 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Vault
            </Link>
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">My Profile</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your uploaded resources and track your impact.</p>
          </div>
          <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2.5 font-semibold transition-colors shadow-lg shadow-blue-500/30 text-center">
            Upload New File
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-6 border border-zinc-200/50 flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500">Total Uploads</p>
                <div className="text-2xl font-black text-zinc-900">{stats.total_uploads}</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-6 border border-zinc-200/50 flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500">Total Downloads</p>
                <div className="text-2xl font-black text-zinc-900">{stats.total_downloads}</div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-6 border border-zinc-200/50 flex items-center gap-4 hover:-translate-y-1 transition-all">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                <ArrowUpCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500">Total Upvotes</p>
                <div className="text-2xl font-black text-zinc-900">{stats.total_upvotes}</div>
              </div>
            </div>
          </div>

          {/* Uploads Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-sm p-8 border border-zinc-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-800">My Uploads</h2>
              </div>
              
              {errorMessage ? (
                <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center text-red-600">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Failed to load data</h3>
                  <p>{errorMessage}</p>
                </div>
              ) : resources.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="bg-zinc-100 p-4 rounded-full mb-4">
                    <FileText className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-1">No resources yet</h3>
                  <p className="text-zinc-500 mb-6">You haven't uploaded any study materials. Start sharing to help others!</p>
                  <Link href="/upload" className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-5 py-2.5 font-medium transition-colors">
                    Upload your first file
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resources.map((resource: any) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
