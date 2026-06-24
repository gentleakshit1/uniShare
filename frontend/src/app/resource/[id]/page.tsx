import { fetchResourceById } from "@/lib/api";
import { ArrowLeft, Download, ThumbsUp, ThumbsDown, FileText, User, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { getToken } = await auth();
  
  // Await params if it's a promise (Next.js 15+)
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let resource;
  try {
    const token = await getToken();
    resource = await fetchResourceById(id, token);
  } catch (error) {
    console.error("Failed to fetch resource details", error);
    notFound();
  }

  if (!resource) {
    notFound();
  }

  // Format the date
  const dateStr = new Date(resource.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Resources
        </Link>

        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Left Side: Preview Thumbnail */}
            <div className="bg-zinc-100 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-200/60 min-h-[400px] relative group">
              {resource.preview_url ? (
                <img 
                  src={resource.preview_url} 
                  alt={`Preview of ${resource.title}`} 
                  className="max-w-full max-h-[600px] object-contain rounded-xl shadow-lg border border-zinc-200 group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400">
                  <FileText className="w-24 h-24 mb-4 opacity-50" />
                  <p className="font-medium">No preview available</p>
                </div>
              )}
              
              {/* Overlay Download Button for Quick Access */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <a 
                  href={resource.file_url || resource.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-zinc-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Download className="w-5 h-5" /> Open File
                </a>
              </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="p-10 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {resource.type}
                </span>
                <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Semester {resource.semester}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 leading-tight">
                {resource.title}
              </h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-zinc-600">
                  <Tag className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium">{resource.course} - {resource.subject}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <User className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium">Shared by <span className="text-zinc-900">{resource.uploaded_by_name || 'Anonymous'}</span></span>
                </div>
                <div className="flex items-center gap-3 text-zinc-600">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium">Uploaded on {dateStr}</span>
                </div>
              </div>

              {/* Stats & Actions Area */}
              <div className="mt-auto pt-8 border-t border-zinc-100">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  
                  {/* Voting Stats */}
                  <div className="flex items-center gap-6 text-zinc-500">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-1">Downloads</span>
                      <span className="text-2xl font-black text-zinc-900">{resource.downloads_count}</span>
                    </div>
                    <div className="w-px h-10 bg-zinc-200"></div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-green-600">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-bold text-lg">{resource.upvotes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-500">
                        <ThumbsDown className="w-5 h-5" />
                        <span className="font-bold text-lg">{resource.downvotes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Action */}
                  <a 
                    href={resource.file_url || resource.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 w-full md:w-auto justify-center"
                  >
                    <Download className="w-5 h-5" /> Download Resource
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
