import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

const Index = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default Index;
