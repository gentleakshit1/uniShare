import AnimatedBackground from "@/components/animations/AnimatedBackground";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <AnimatedBackground />
      <HeroSection />
      <FeaturesSection />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md text-center text-zinc-500 dark:text-zinc-400 text-sm z-10 transition-colors duration-500">
        <p className="font-semibold text-zinc-800 dark:text-zinc-200">UniShare &copy; {new Date().getFullYear()}</p>
        <p className="mt-2 text-zinc-400 dark:text-zinc-500">Made for students, by students.</p>
      </footer>
    </div>
  );
}
