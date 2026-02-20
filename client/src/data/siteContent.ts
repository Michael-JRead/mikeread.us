export interface NavItem {
  label: string;
  href: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface ProjectItem {
  title: string;
  summary: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  status: "Active" | "In Progress" | "Planned";
}

export const SITE_META = {
  canonicalUrl: "https://www.mikeread.us/",
  shareTitle: "Michael Read | Information Security Manager | Security Engineer",
  shareDescription:
    "Marine Corps veteran with 9 years of cybersecurity experience across AWS, DoD programs, cloud security engineering, and risk-driven architecture.",
  shareImageUrl: "https://www.mikeread.us/assets/og-preview-v1.png",
  shareImageAlt:
    "Michael Read cybersecurity portfolio preview with headshot and security engineering title.",
  fullName: "Michael Read",
  initials: "MR",
  role: "Information Security Manager | Security Engineer",
  location: "Celina, TX",
  availability: "Open to remote, hybrid, and cleared opportunities",
  email: "public.michaelread@gmail.com",
  headline:
    "Marine Corps veteran with 9 years of cybersecurity and cloud security engineering experience.",
  summary:
    "I secure cloud deployments and sensitive data by aligning technical controls with business goals, leading cross-functional execution, and driving measurable risk reduction in regulated environments.",
  social: {
    github: "https://github.com/Michael-JRead/MichaelJRead",
    linkedin: "https://www.linkedin.com/in/michael-j-read99/",
  },
  requiredPhotoSrc: "/assets/profile-photo.png",
  requiredResumeSrc: "/assets/MichaelReadResumeFeb2026.pdf",
  heroBackgroundSrc: "/assets/hero-bg.jpg",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#portfolio" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export const HERO_STATS = [
  { value: "9 Years", label: "Cybersecurity and network engineering" },
  { value: "AWS", label: "Cloud security architecture and compliance" },
  { value: "Secret", label: "Active security clearance" },
];

export const ABOUT_PARAGRAPHS = [
  "I am a cybersecurity engineer with a background spanning AWS, DoD programs, and high-impact cloud modernization efforts. My focus is securing enterprise-scale systems without slowing delivery.",
  "I have led security architecture, incident response, compliance hardening, and automation initiatives across organizations where reliability, audit readiness, and mission continuity are non-negotiable.",
  "I work closely with technical and executive stakeholders to prioritize risk, align resources, and deliver outcomes with accountability.",
];

export const CORE_SKILLS = [
  "Cloud Security",
  "Security Governance",
  "Risk Management",
  "Security Architecture",
  "Security Assessment and Testing",
  "Incident Management",
  "Threat Intelligence",
  "Identity and Access Management",
  "Compliance Management",
  "Business Continuity and DR",
  "Python",
  "LAN/WAN and Cloud Networking",
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Solutions Architect Security Specialist",
    company: "Amazon Web Services",
    period: "Dec 2024 - Jun 2025",
    location: "Dallas, TX",
    summary:
      "Designed and implemented secure, scalable AWS architectures for mission-critical environments with strict compliance and resiliency requirements.",
    highlights: [
      "Delivered AWS architectures aligned to NIST, ISO 27001, and DoD standards protecting 50M+ in digital assets.",
      "Led security assessments with ACAS and AWS Config and remediated 95% of high-severity findings.",
      "Integrated security controls into CI/CD workflows improving deployment efficiency by 20%.",
      "Built CloudWatch, Lambda, and GuardDuty monitoring flows that reduced incident response time by 40%.",
    ],
    tags: ["AWS", "CloudWatch", "Lambda", "GuardDuty", "ACAS", "NIST"],
  },
  {
    role: "Principal Cloud Security Engineer",
    company: "Science Applications International Corporation",
    period: "Dec 2023 - Dec 2024",
    location: "Dallas, TX",
    summary:
      "Orchestrated secure cloud infrastructure design and optimization for USAF AFMS and broader DoD workloads.",
    highlights: [
      "Secured cloud infrastructure supporting 1M+ users with 99.5% uptime.",
      "Drove STIG compliance and reduced risk by remediating 95% of high-severity vulnerabilities in six months.",
      "Built AWS cost visibility tooling that saved 750K annually through tagging-based optimization.",
      "Improved operational efficiency by 50% through containerized workloads and infrastructure automation.",
    ],
    tags: ["AWS", "STIG", "DoD", "IaC", "Fargate", "ServiceNow"],
  },
  {
    role: "Cloud Security Engineer",
    company: "Amazon Web Services",
    period: "May 2022 - Dec 2023",
    location: "Dallas, TX",
    summary:
      "Enforced AWS Acceptable Use Policy and led abuse mitigation, threat analysis, and secure architecture guidance for customer environments.",
    highlights: [
      "Reduced abuse incidents by 30% while maintaining rapid handling across a high-volume case queue.",
      "Handled roughly 200 cases weekly at 99% quality assurance and exceeded targets by 20%.",
      "Improved fraud prevention by strengthening identity verification and reducing fraudulent activity by 15%.",
      "Delivered architecture guidance and workshops that reduced customer infrastructure costs by 120K monthly.",
    ],
    tags: ["AUP", "Threat Analysis", "AWS", "IAM", "Security Operations"],
  },
  {
    role: "Satellite Network Engineer",
    company: "United States Marine Corps",
    period: "Sep 2017 - May 2022",
    location: "United States, Japan, South Korea",
    summary:
      "Integrated, assessed, and troubleshot secure multi-channel communications systems for classified and unclassified network operations.",
    highlights: [
      "Conducted 350+ infrastructure evaluations while maintaining a 94% approval rate.",
      "Led 30 personnel and increased network security proficiency by 25% over two years.",
      "Managed 12M equipment inventory with strict security and accountability controls.",
      "Improved daily mission productivity by 30% through workflow optimization and standards.",
    ],
    tags: ["Network Security", "Communications", "Operations", "Leadership", "DoD"],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Master of Science, Information Security Engineering",
    institution: "SANS Technology Institute",
    period: "Expected May 2027",
    details: [
      "Graduate-level focus on applied information security engineering and defensive operations.",
    ],
  },
  {
    degree: "Graduate Certificate, Penetration Testing and Ethical Hacking",
    institution: "SANS Technology Institute",
    period: "Mar 2025",
    details: [
      "Specialized training in offensive testing methods and adversarial security techniques.",
    ],
  },
  {
    degree: "Master of Science, Cybersecurity Technology",
    institution: "University of Maryland",
    period: "May 2023",
    details: ["Graduated Summa Cum Laude."],
  },
  {
    degree: "Bachelor of Science, Cybersecurity and Networking",
    institution: "University of Maryland",
    period: "Dec 2021",
    details: ["Graduated Magna Cum Laude."],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: "AWS Security Architecture Reference Library",
    summary:
      "Security-first architecture patterns for implementing IAM, KMS, network controls, and monitoring in regulated AWS environments.",
    tags: ["AWS", "IAM", "KMS", "Compliance"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Cloud Compliance Automation Toolkit",
    summary:
      "Automated checks and reporting templates for continuous control validation across cloud workloads.",
    tags: ["Automation", "Compliance", "Security Engineering", "Python"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Threat and Incident Response Playbooks",
    summary:
      "Operational playbooks for triage, escalation, and containment built to improve consistency and response speed.",
    tags: ["Incident Response", "Threat Intel", "Operations", "Runbooks"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Infrastructure Hardening Baselines",
    summary:
      "Baseline hardening controls and implementation guidance aligned with STIG and cloud best practices.",
    tags: ["STIG", "Hardening", "Cloud", "Security Baselines"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  { name: "Certified Information Security Manager (CISM)", issuer: "ISACA", year: "Active", status: "Active" },
  { name: "Certified Information Systems Security Professional (CISSP)", issuer: "ISC2", year: "Active", status: "Active" },
  { name: "Certified Cloud Security Professional (CCSP)", issuer: "ISC2", year: "Active", status: "Active" },
  { name: "GIAC Certified Incident Handler (GCIH)", issuer: "SANS", year: "Active", status: "Active" },
  { name: "GIAC Penetration Tester (GPEN)", issuer: "SANS", year: "Active", status: "Active" },
  { name: "GIAC Cloud Penetration Tester (GCPN)", issuer: "SANS", year: "Active", status: "Active" },
  { name: "GIAC Web Application Penetration Tester (GWAPT)", issuer: "SANS", year: "Active", status: "Active" },
  { name: "GIAC Security Essentials (GSEC)", issuer: "SANS", year: "Active", status: "Active" },
  { name: "AWS Certified Solutions Architect - Professional", issuer: "AWS", year: "Active", status: "Active" },
  { name: "AWS Advanced Networking - Specialty", issuer: "AWS", year: "Active", status: "Active" },
  { name: "AWS Security - Specialty", issuer: "AWS", year: "Active", status: "Active" },
  { name: "CompTIA CASP+", issuer: "CompTIA", year: "Active", status: "Active" },
  { name: "CompTIA CySA+", issuer: "CompTIA", year: "Active", status: "Active" },
  { name: "CompTIA Security+", issuer: "CompTIA", year: "Active", status: "Active" },
  { name: "CompTIA Network+", issuer: "CompTIA", year: "Active", status: "Active" },
  { name: "CompTIA Linux+", issuer: "CompTIA", year: "Active", status: "Active" },
];
