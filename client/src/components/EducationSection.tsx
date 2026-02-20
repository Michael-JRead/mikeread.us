import { EDUCATION } from "@/data/siteContent";

export default function EducationSection() {
  return (
    <section id="education" className="site-section section-muted">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">03 / Education</p>
          <h2 className="section-title">Education</h2>
        </header>

        <div className="stack-grid">
          {EDUCATION.map((entry) => (
            <article key={`${entry.degree}-${entry.period}`} className="panel">
              <div className="timeline-head">
                <div>
                  <h3 className="card-title">{entry.degree}</h3>
                  <p className="card-subtitle">{entry.institution}</p>
                </div>
                <p className="time-pill">{entry.period}</p>
              </div>

              <ul className="bullet-list">
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}