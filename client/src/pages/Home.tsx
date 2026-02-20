import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import PortfolioSection from "@/components/PortfolioSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#050810",
        backgroundImage: `
          linear-gradient(135deg, rgba(5, 8, 16, 0.98) 0%, rgba(10, 15, 35, 0.95) 50%, rgba(15, 23, 42, 0.92) 100%),
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed",
        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
        backgroundRepeat: "no-repeat",
        color: "#e0e7ff"
      }}
    >
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <PortfolioSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
