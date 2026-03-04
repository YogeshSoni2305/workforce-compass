import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import AnoAI from "@/components/ui/animated-shader-background";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="fixed inset-0 z-0">
        <AnoAI />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Index;
