const featuredProjects = [
  {
    title: 'Production Analytics Dashboard',
    description:
      'Designed a role-based dashboard for leadership teams with real-time KPI reporting and anomaly alerts.',
    stack: 'React, TypeScript, Java Spring Boot, PostgreSQL',
  },
  {
    title: 'Developer Self-Service Platform',
    description:
      'Built internal tooling that reduced release setup time by automating provisioning, audit logs, and approvals.',
    stack: 'Java, Spring Cloud, Docker, GitHub Actions',
  },
  {
    title: 'Customer Experience Redesign',
    description:
      'Delivered a conversion-focused UX refresh with a modern component system and improved accessibility baseline.',
    stack: 'React, Design Tokens, Cypress, REST APIs',
  },
];

const skills = [
  'Java / Spring Boot',
  'React / Front-End Architecture',
  'REST API Design',
  'Cloud & CI/CD',
  'System Design',
  'Technical Leadership',
];

function App() {
  return (
    <>
      <header className="hero">
        <nav className="top-nav">
          <span className="brand">mike.read.us</span>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Software Engineer · Java + React</p>
          <h1>Hi, I&apos;m Mike Read.</h1>
          <p className="lead">
            I build reliable backend systems and polished web experiences that help businesses move faster.
            This site highlights my resume, selected projects, and ways to connect.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary">
              View Projects
            </a>
            <a href="#resume" className="btn btn-secondary">
              Resume Snapshot
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="resume" className="panel">
          <h2>Resume Snapshot</h2>
          <p>
            I specialize in full-stack delivery with an emphasis on Java services and modern React interfaces.
            I enjoy solving complex problems, mentoring teammates, and shipping features that are measurable
            and user-centered.
          </p>
          <ul className="skill-grid">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>

        <section id="projects" className="panel">
          <h2>Featured Projects</h2>
          <div className="project-grid">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span>{project.stack}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="panel panel-contact">
          <h2>Let&apos;s Connect</h2>
          <p>Looking for a software engineer to help ship high-impact products? I&apos;d love to chat.</p>
          <div className="contact-links">
            <a href="mailto:mike@example.com">mike@example.com</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
