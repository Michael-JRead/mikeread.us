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
        backgroundColor: "#120607",
        backgroundImage: `
          linear-gradient(135deg, rgba(18, 6, 7, 0.98) 0%, rgba(33, 8, 11, 0.95) 50%, rgba(45, 11, 14, 0.92) 100%),
          radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed",
        backgroundPosition: "0 0, 0 0, 0 0, 0 0",
        backgroundRepeat: "no-repeat",
        color: "#f5f5f5"
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
