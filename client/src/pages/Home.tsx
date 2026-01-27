import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { PerfumeList } from "@/components/PerfumeList";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-black pt-16">
      <Navbar />
      <Hero />
      <About />
      <PerfumeList />
      <Footer />
    </main>
  );
}
