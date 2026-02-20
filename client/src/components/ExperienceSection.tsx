import { EXPERIENCES } from "@/data/siteContent";

export default function ExperienceSection() {
  return (
    <section id="experience" className="site-section">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">02 / Experience</p>
          <h2 className="section-title">Professional Experience</h2>
        </header>

        <div className="timeline">
          {EXPERIENCES.map((experience) => (
            <article key={`${experience.role}-${experience.period}`} className="timeline-item panel">
              <div className="timeline-head">
                <div>
                  <h3 className="card-title">{experience.role}</h3>
                  <p className="card-subtitle">
                    {experience.company} | {experience.location}
                  </p>
                </div>
                <p className="time-pill">{experience.period}</p>
              </div>

              <p className="body-copy">{experience.summary}</p>

              <ul className="bullet-list">
                {experience.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="tag-row" aria-label="Technologies used">
                {experience.tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}