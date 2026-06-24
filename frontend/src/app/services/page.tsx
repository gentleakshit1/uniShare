import { fetchServices } from "@/lib/api";
import ServiceCard from "@/components/services/ServiceCard";
import Link from "next/link";
import { Briefcase, PlusCircle } from "lucide-react";

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 pt-32 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Freelance Marketplace
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
              Hire your peers for assignments, tutoring, and project collaborations.
            </p>
          </div>
          <Link href="/services/create" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2.5 font-semibold transition-colors shadow-lg shadow-indigo-500/30 text-center flex items-center gap-2">
            <PlusCircle className="w-5 h-5" /> Offer a Service
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm mt-12">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-full inline-block mb-6">
              <Briefcase className="w-12 h-12 text-indigo-400 dark:text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No active services</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
              There are no freelance services listed right now. Be the first to offer your skills!
            </p>
            <Link href="/services/create" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-3 font-semibold transition-all hover:scale-105">
              Offer your skills
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
