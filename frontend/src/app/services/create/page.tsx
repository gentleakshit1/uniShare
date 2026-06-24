"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/api";
import { useAuth, useUser } from "@clerk/nextjs";

export default function CreateServicePage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMessage("");

    if (!title || !description || !price || !contactInfo) {
      return setErrorMessage("Please fill out all required fields.");
    }
    
    if (!isSignedIn) {
      return setErrorMessage("You must be signed in to offer a service.");
    }

    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication error. Please log in again.");

      const serviceData = {
        title,
        description,
        price,
        contact_info: contactInfo,
        provider_display_name: user?.fullName || user?.username || "Service Provider",
        provider_image_url: user?.imageUrl || ""
      };

      await createService(serviceData, token);

      // Navigate back to services catalogue
      router.push("/services");
      
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center pt-32 pb-12 px-4 relative transition-colors duration-500">
      <Link href="/services" className="absolute top-28 left-8 flex items-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
      </Link>
      
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-800">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 text-center">Offer a Service</h2>
        <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">List your skills and start earning from your peers.</p>
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-700 dark:text-zinc-300 font-medium">Service Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Expert Python Debugging" 
              className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-700 dark:text-zinc-300 font-medium">Description</Label>
            <textarea 
              id="description" 
              placeholder="Describe what you will do..." 
              className="flex min-h-[100px] w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-zinc-700 dark:text-zinc-300 font-medium">Price (INR)</Label>
              <Input 
                id="price" 
                placeholder="e.g. 500" 
                type="number"
                min="0"
                step="0.01"
                className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-zinc-700 dark:text-zinc-300 font-medium">Contact Info</Label>
              <Input 
                id="contact" 
                placeholder="Email or Phone" 
                className="bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100" 
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !isLoaded}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-6 rounded-xl mt-4 transition-all hover:shadow-lg disabled:opacity-70"
          >
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : "Publish Service"}
          </Button>
        </form>
      </div>
    </div>
  );
}
