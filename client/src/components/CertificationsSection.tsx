import { ShieldCheck } from "lucide-react";
import { CERTIFICATIONS } from "@/data/siteContent";

export default function CertificationsSection() {
  return (
    <section id="certifications" className="site-section section-muted">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">05 / Certifications</p>
          <h2 className="section-title">Certifications</h2>
        </header>

        <div className="cert-grid">
          {CERTIFICATIONS.map((certification) => (
            <article key={certification.name} className="panel cert-card">
              <div className="cert-icon" aria-hidden="true">
                <ShieldCheck size={18} />
              </div>

              <div className="cert-copy">
                <h3 className="card-title">{certification.name}</h3>
                <p className="card-subtitle">
                  {certification.issuer} | {certification.year}
                </p>
              </div>

              <span className="time-pill">{certification.status}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}