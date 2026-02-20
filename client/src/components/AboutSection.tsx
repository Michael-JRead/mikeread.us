import { ABOUT_PARAGRAPHS, CORE_SKILLS } from "@/data/siteContent";

export default function AboutSection() {
  return (
    <section id="about" className="site-section section-muted">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">01 / About</p>
          <h2 className="section-title">Security Approach</h2>
        </header>

        <div className="about-grid">
          <article className="panel">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="body-copy">
                {paragraph}
              </p>
            ))}
          </article>

          <aside className="panel">
            <h3 className="subheading">Core Skills</h3>
            <div className="skill-grid" aria-label="Core cybersecurity skills">
              {CORE_SKILLS.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}