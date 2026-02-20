import { ExternalLink, Github } from "lucide-react";
import { PROJECTS } from "@/data/siteContent";

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="site-section">
      <div className="container">
        <header className="section-header">
          <p className="section-eyebrow">04 / Projects</p>
          <h2 className="section-title">Featured Work</h2>
        </header>

        <div className="project-grid">
          {PROJECTS.map((project) => (
            <article key={project.title} className="panel project-card">
              <h3 className="card-title">{project.title}</h3>
              <p className="body-copy">{project.summary}</p>

              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-pill tag-pill-accent">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="project-links">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                    aria-label={`Open source code for ${project.title}`}
                  >
                    <Github size={15} />
                    Source
                  </a>
                ) : null}

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                    aria-label={`Open live demo for ${project.title}`}
                  >
                    <ExternalLink size={15} />
                    Live Demo
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}