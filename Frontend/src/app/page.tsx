import BackgroundEffects from "@/components/background-effects";
import Navbar from "@/components/navbar";
import FloatingNav from "@/components/floating-nav";
import HeroSection from "@/components/hero-section";
import FeatureSection from "@/components/feature-section";
import DashboardPreview from "@/components/dashboard-preview";
import DsaSheetSection from "@/components/dsa-sheet-section";
import Testimonials from "@/components/testimonials";
import PricingSection from "@/components/pricing-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BackgroundEffects />
      <Navbar />
      <FloatingNav />
      <HeroSection />
      <FeatureSection />
      <DashboardPreview />
      <DsaSheetSection />
      <Testimonials />
      <PricingSection />
      <Footer />
    </main>
  );
}
