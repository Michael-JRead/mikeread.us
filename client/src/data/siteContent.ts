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
  fullName: "Mike Read",
  initials: "MR",
  role: "Cybersecurity Professional",
  location: "United States",
  availability: "Open to remote and hybrid opportunities",
  email: "mike@mikeread.us",
  headline:
    "Security engineering focused on resilient cloud and enterprise systems.",
  summary:
    "I design practical security programs that combine cloud hardening, incident response, and automation so teams can ship quickly without sacrificing defense.",
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
  { value: "Cloud", label: "AWS and Azure security controls" },
  { value: "SOC", label: "Detection and incident response" },
  { value: "Automation", label: "Python and IaC workflows" },
];

export const ABOUT_PARAGRAPHS = [
  "I work across cloud and on-prem environments to reduce attack surface, improve visibility, and turn security requirements into repeatable engineering outcomes.",
  "My approach balances architecture, tooling, and process. I care about measurable risk reduction, clear communication, and systems that remain usable for the teams that depend on them.",
  "I continue to sharpen my skills through labs, offensive security practice, and active research into modern threat tradecraft.",
];

export const CORE_SKILLS = [
  "Cloud Security (AWS, Azure)",
  "SIEM and Detection Engineering",
  "Zero Trust Architecture",
  "Identity and Access Management",
  "Vulnerability Management",
  "Incident Response",
  "Security Automation",
  "Risk and Compliance",
  "Network Security",
  "Threat Intelligence",
  "Python and Bash",
  "Infrastructure as Code",
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Security Engineer",
    company: "Enterprise Technology Team",
    period: "2024 - Present",
    location: "Remote",
    summary:
      "Built cloud-native guardrails and hardened IAM boundaries across production environments to improve preventive controls and reduce drift.",
    highlights: [
      "Shipped policy-as-code workflows for repeatable baseline enforcement.",
      "Partnered with platform teams to standardize secure deployment patterns.",
      "Reduced manual review time with automation and targeted telemetry.",
    ],
    tags: ["AWS", "Azure", "Terraform", "Python"],
  },
  {
    role: "SOC Analyst II",
    company: "Security Operations Center",
    period: "2022 - 2024",
    location: "On-site",
    summary:
      "Led triage and investigation across high-volume alert pipelines, with focus on detection quality and faster containment playbooks.",
    highlights: [
      "Improved signal-to-noise ratio through rule tuning and threat mapping.",
      "Created incident response runbooks to shorten responder handoffs.",
      "Supported post-incident reviews with practical remediation guidance.",
    ],
    tags: ["Splunk", "KQL", "Incident Response", "MITRE ATT&CK"],
  },
  {
    role: "Security Analyst",
    company: "Infrastructure and Risk Team",
    period: "2021 - 2022",
    location: "Hybrid",
    summary:
      "Performed vulnerability assessments and supported remediation planning across web applications, endpoints, and network infrastructure.",
    highlights: [
      "Documented prioritized findings with risk-based remediation actions.",
      "Coordinated with engineering owners to verify closure of key issues.",
      "Expanded internal testing coverage for common misconfiguration paths.",
    ],
    tags: ["Nessus", "Burp Suite", "Nmap", "Risk Assessment"],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "B.S. in Cybersecurity",
    institution: "University Program in Information Security",
    period: "2018 - 2022",
    details: [
      "Concentration in network defense, cryptography, and secure architecture.",
      "Participated in collegiate cyber competitions and blue-team exercises.",
      "Built practical labs for incident response and vulnerability analysis.",
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: "Cloud Security Baseline Toolkit",
    summary:
      "A controls-first toolkit for validating account configuration against internal baselines and turning drift into actionable tasks.",
    tags: ["Python", "AWS", "IaC", "Compliance"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Detection Engineering Playbook",
    summary:
      "Versioned detection lifecycle templates for developing, testing, and deploying SIEM rules with measurable quality gates.",
    tags: ["SIEM", "Detection", "ATT&CK", "CI/CD"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Zero Trust Lab Environment",
    summary:
      "Hands-on lab that models segmented access, identity-aware controls, and continuous verification in a practical learning environment.",
    tags: ["Zero Trust", "Identity", "Networking", "Lab"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
  {
    title: "Threat Intel Triage Dashboard",
    summary:
      "Dashboard workflow for correlating external indicators with internal telemetry to speed analyst prioritization.",
    tags: ["Threat Intel", "Dashboards", "Automation", "SOC"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: "CompTIA Security+",
    issuer: "CompTIA",
    year: "2021",
    status: "Active",
  },
  {
    name: "CompTIA CySA+",
    issuer: "CompTIA",
    year: "2022",
    status: "Active",
  },
  {
    name: "AWS Certified Security - Specialty",
    issuer: "Amazon Web Services",
    year: "2023",
    status: "Active",
  },
  {
    name: "Certified Ethical Hacker",
    issuer: "EC-Council",
    year: "2022",
    status: "Active",
  },
];