"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadResource } from "@/lib/api";
import { useAuth, useUser } from "@clerk/nextjs";

export default function UploadPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // 1. State variables to hold the form data
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // 2. The function that runs when the user clicks Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMessage(""); // Clear previous errors

    if (!title || !course || !semester || !subject || !file) {
      return setErrorMessage("Please fill out all required fields.");
    }

    setIsSubmitting(true);

    try {
      const token = await getToken();
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("course", course);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("type", "notes"); // Defaulting to notes for now
      formData.append("file", file);
      formData.append("is_anonymous", isAnonymous.toString());
      
      // Send the actual Google name!
      const displayName = user?.fullName || user?.username || "Anonymous User";
      formData.append("uploader_display_name", displayName);

      // Call our modular API function with the authentication token
      await uploadResource(formData, token);

      // If no error was thrown, it succeeded!
      router.push("/dashboard");
      
    } catch (error: any) {
      // Catch meaningul errors thrown from our API module and display them gracefully
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center pt-32 pb-12 px-4 relative transition-colors duration-500">
      <Link href="/" className="absolute top-28 left-8 flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>
      
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 text-center">Share Knowledge</h2>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">Upload a resource to help your peers.</p>
        
        {/* Display meaningful error messages directly in the UI instead of annoying alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-700 dark:text-zinc-300 font-medium">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Intro to CS Midterm 2023" 
              className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course" className="text-zinc-700 dark:text-zinc-300 font-medium">Course</Label>
              <Input 
                id="course" 
                placeholder="e.g. CS101" 
                className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester" className="text-zinc-700 dark:text-zinc-300 font-medium">Semester</Label>
              <Input 
                id="semester" 
                placeholder="e.g. 1" 
                className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-zinc-700 dark:text-zinc-300 font-medium">Subject</Label>
            <Input 
              id="subject" 
              placeholder="e.g. Data Structures" 
              className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file" className="text-zinc-700 dark:text-zinc-300 font-medium">File (PDF/Image)</Label>
            <Input 
              id="file" 
              type="file" 
              className="cursor-pointer bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="checkbox" 
              id="isAnonymous" 
              checked={isAnonymous} 
              onChange={(e) => setIsAnonymous(e.target.checked)} 
              className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-blue-600 focus:ring-blue-600 dark:focus:ring-blue-500"
            />
            <Label htmlFor="isAnonymous" className="text-zinc-700 dark:text-zinc-300 font-medium cursor-pointer">
              Upload Anonymously <span className="text-xs text-zinc-500 dark:text-zinc-500 font-normal ml-1 block sm:inline mt-1 sm:mt-0">(Your name will be hidden from the public)</span>
            </Label>
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-xl mt-4 transition-all hover:shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Resource"}
          </Button>
        </form>
      </div>
    </div>
  );
}
