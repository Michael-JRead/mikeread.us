import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SITE_META } from "@/data/siteContent";

export default function ContactSection() {
  return (
    <>
      <section id="contact" className="site-section contact-section">
        <div className="container">
          <header className="section-header">
            <p className="section-eyebrow">06 / Contact</p>
            <h2 className="section-title">Let&apos;s Connect</h2>
          </header>

          <p className="body-copy contact-copy">
            If you are hiring for cybersecurity roles, collaborating on a project, or just want to connect,
            feel free to reach out.
          </p>

          <div className="contact-actions">
            <a className="button button-primary" href={`mailto:${SITE_META.email}`}>
              <Mail size={16} />
              {SITE_META.email}
            </a>

            <a
              className="button button-ghost"
              href={SITE_META.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} />
              LinkedIn
            </a>

            <a
              className="button button-ghost"
              href={SITE_META.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>

          <p className="location-row">
            <MapPin size={14} />
            {SITE_META.location} | {SITE_META.availability}
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-row">
          <span className="brand-mark brand-mark-small">{SITE_META.initials}</span>
          <p className="footer-copy">Copyright {new Date().getFullYear()} {SITE_META.fullName}</p>
          <div className="footer-socials">
            <a
              className="icon-button"
              href={SITE_META.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile"
            >
              <Linkedin size={16} />
            </a>
            <a
              className="icon-button"
              href={SITE_META.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}