import Hero from "@/components/homeRoute/Hero";
import MainContentGrid from "@/components/homeRoute/MainContentGrid";
import BottomCTA from "@/components/homeRoute/BottomCTA";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <Hero />
      {/* Main Content Grid */}
      <MainContentGrid />
      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
