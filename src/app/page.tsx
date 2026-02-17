import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import AgeGroups from "@/components/sections/AgeGroups";
import SubjectsSection from "@/components/sections/SubjectsSection";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Header locale="ar" />
      <HeroSection locale="ar" />
      <StatsSection locale="ar" />
      <FeaturesSection locale="ar" />
      <AgeGroups locale="ar" />
      <SubjectsSection locale="ar" />
      <HowItWorks locale="ar" />
      <TestimonialsSection locale="ar" />
      <PricingSection locale="ar" />
      <FAQSection locale="ar" />
      <DownloadCTA locale="ar" />
      <Footer locale="ar" />
    </main>
  );
}
