import { ArrowDownRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { HERO_STATS, SITE_META } from "@/data/siteContent";

export default function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <div
        className="hero-background"
        style={{
          backgroundImage: `linear-gradient(118deg, rgba(5, 8, 16, 0.95) 0%, rgba(5, 8, 16, 0.75) 46%, rgba(5, 8, 16, 0.52) 100%), url("${SITE_META.heroBackgroundSrc}")`,
        }}
      />
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="container hero-layout">
        <div className="hero-content reveal-up">
          <p className="section-eyebrow">Cybersecurity Portfolio</p>
          <h1 className="hero-name">{SITE_META.fullName}</h1>
          <p className="hero-role">{SITE_META.role}</p>
          <p className="hero-headline">{SITE_META.headline}</p>
          <p className="hero-summary">{SITE_META.summary}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              <Mail size={16} />
              Contact
            </a>

            <a className="button button-ghost" href={SITE_META.requiredResumeSrc} download>
              <Download size={16} />
              Resume
            </a>
          </div>

          <div className="hero-social-row" aria-label="Social links">
            <a
              className="icon-button"
              href={SITE_META.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
            >
              <Github size={17} />
            </a>
            <a
              className="icon-button"
              href={SITE_META.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile"
            >
              <Linkedin size={17} />
            </a>
            <a
              className="icon-button"
              href={`mailto:${SITE_META.email}`}
              aria-label="Send email"
            >
              <Mail size={17} />
            </a>
          </div>
        </div>

        <div className="hero-visual reveal-right">
          <div className="portrait-shell" aria-label="Profile image">
            <div className="portrait-ring" aria-hidden="true" />
            <div className="portrait-inner">
              <img
                src={SITE_META.requiredPhotoSrc}
                alt={SITE_META.fullName}
                className="portrait-image"
              />
            </div>
          </div>

          <div className="hero-stat-grid">
            {HERO_STATS.map((item) => (
              <article key={item.label} className="hero-stat-card">
                <p className="hero-stat-value">{item.value}</p>
                <p className="hero-stat-label">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <a
        className="hero-scroll-cue"
        href="#about"
        onClick={(event) => {
          event.preventDefault();
          document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Explore
        <ArrowDownRight size={14} />
      </a>
    </section>
  );
}