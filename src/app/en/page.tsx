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

export default function EnglishHomePage() {
  return (
    <main>
      <Header locale="en" />
      <HeroSection locale="en" />
      <StatsSection locale="en" />
      <FeaturesSection locale="en" />
      <AgeGroups locale="en" />
      <SubjectsSection locale="en" />
      <HowItWorks locale="en" />
      <TestimonialsSection locale="en" />
      <PricingSection locale="en" />
      <FAQSection locale="en" />
      <DownloadCTA locale="en" />
      <Footer locale="en" />
    </main>
  );
}
