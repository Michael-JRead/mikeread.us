import Navbar from "@/components/Navbar";
import SkipLink from "@/components/SkipLink";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import PortfolioSection from "@/components/PortfolioSection";
import OffensiveSecuritySection from "@/components/OffensiveSecuritySection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import CertificationsSection from "@/components/CertificationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="page-gradient min-h-screen flex flex-col">
      <SkipLink />
      <div className="site-grid" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <EducationSection />
        <PortfolioSection />
        <OffensiveSecuritySection />
        <CaseStudiesSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
