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
  details?: string;
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
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  impact?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  status: "Active" | "In Progress" | "Planned";
  category?: string;
}

export const SITE_META = {
  canonicalUrl: "https://www.mikeread.us/",
  shareTitle: "Michael Read | Cybersecurity Leader",
  shareDescription:
    "Information Security Manager and Security Engineer focused on AWS, compliance, and measurable risk reduction.",
  shareImageUrl: "https://www.mikeread.us/assets/og-preview-v4.jpg",
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
  "I am a cybersecurity engineer with a background spanning AWS, DoD programs, and high-impact cloud modernization efforts. My focus is securing enterprise-scale systems without slowing delivery. I bring a unique combination of military discipline, technical depth, and strategic thinking to every engagement.",
  "I have led security architecture, incident response, compliance hardening, and automation initiatives across organizations where reliability, audit readiness, and mission continuity are non-negotiable. My expertise spans cloud security, risk management, security governance, and threat intelligence, with a proven track record of translating complex security requirements into actionable, scalable solutions.",
  "I work closely with technical and executive stakeholders to prioritize risk, align resources, and deliver outcomes with accountability. I am passionate about building secure, resilient systems that enable business growth while maintaining the highest standards of security and compliance.",
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
    details:
      "As a Solutions Architect Security Specialist at AWS, I partnered with enterprise customers to design and deploy secure cloud architectures aligned with NIST, ISO 27001, and DoD standards. I led comprehensive security assessments using ACAS and AWS Config, identifying and remediating critical vulnerabilities. I integrated security controls into CI/CD pipelines, improving deployment efficiency while maintaining security posture. I built advanced monitoring solutions using CloudWatch, Lambda, and GuardDuty that reduced incident response time by 40%.",
    highlights: [
      "Delivered AWS architectures aligned to NIST, ISO 27001, and DoD standards protecting 50M+ in digital assets.",
      "Led security assessments with ACAS and AWS Config and remediated 95% of high-severity findings.",
      "Integrated security controls into CI/CD workflows improving deployment efficiency by 20%.",
      "Built CloudWatch, Lambda, and GuardDuty monitoring flows that reduced incident response time by 40%.",
      "Provided architecture guidance to 30+ enterprise customers on secure cloud design patterns.",
    ],
    tags: ["AWS", "CloudWatch", "Lambda", "GuardDuty", "ACAS", "NIST", "CI/CD", "Security Architecture"],
  },
  {
    role: "Principal Cloud Security Engineer",
    company: "Science Applications International Corporation",
    period: "Dec 2023 - Dec 2024",
    location: "Dallas, TX",
    summary:
      "Orchestrated secure cloud infrastructure design and optimization for USAF AFMS and broader DoD workloads.",
    details:
      "As Principal Cloud Security Engineer at SAIC, I led the security architecture and compliance strategy for cloud infrastructure supporting 1M+ users. I drove STIG compliance initiatives, remediating 95% of high-severity vulnerabilities in six months. I designed and implemented AWS cost visibility tooling using tagging-based optimization, achieving $750K in annual savings. I orchestrated containerized workload migrations and infrastructure automation, improving operational efficiency by 50%.",
    highlights: [
      "Secured cloud infrastructure supporting 1M+ users with 99.5% uptime.",
      "Drove STIG compliance and reduced risk by remediating 95% of high-severity vulnerabilities in six months.",
      "Built AWS cost visibility tooling that saved 750K annually through tagging-based optimization.",
      "Improved operational efficiency by 50% through containerized workloads and infrastructure automation.",
      "Led security architecture reviews for 15+ DoD programs, ensuring compliance with federal security standards.",
    ],
    tags: ["AWS", "STIG", "DoD", "IaC", "Fargate", "ServiceNow", "Compliance", "Cost Optimization"],
  },
  {
    role: "Cloud Security Engineer",
    company: "Amazon Web Services",
    period: "May 2022 - Dec 2023",
    location: "Dallas, TX",
    summary:
      "Enforced AWS Acceptable Use Policy and led abuse mitigation, threat analysis, and secure architecture guidance for customer environments.",
    details:
      "As a Cloud Security Engineer in AWS's Security Operations team, I managed a high-volume case queue handling roughly 200 cases weekly. I investigated abuse incidents, conducted threat analysis, and provided secure architecture guidance. I reduced abuse incidents by 30% while maintaining 99% quality assurance. I strengthened identity verification processes, reducing fraudulent activity by 15%. I delivered architecture guidance and workshops that helped customers reduce infrastructure costs by 120K monthly.",
    highlights: [
      "Reduced abuse incidents by 30% while maintaining rapid handling across a high-volume case queue.",
      "Handled roughly 200 cases weekly at 99% quality assurance and exceeded targets by 20%.",
      "Improved fraud prevention by strengthening identity verification and reducing fraudulent activity by 15%.",
      "Delivered architecture guidance and workshops that reduced customer infrastructure costs by 120K monthly.",
      "Developed threat intelligence reports used by AWS security teams to identify emerging attack patterns.",
    ],
    tags: ["AUP", "Threat Analysis", "AWS", "IAM", "Security Operations", "Fraud Prevention"],
  },
  {
    role: "Satellite Network Engineer",
    company: "United States Marine Corps",
    period: "Sep 2017 - May 2022",
    location: "United States, Japan, South Korea",
    summary:
      "Integrated, assessed, and troubleshot secure multi-channel communications systems for classified and unclassified network operations.",
    details:
      "As a Satellite Network Engineer in the Marine Corps, I managed secure communications infrastructure across multiple operational theaters. I conducted 350+ infrastructure evaluations with a 94% approval rate, ensuring compliance with security standards. I led 30 personnel, increasing network security proficiency by 25% over two years. I managed 12M in equipment inventory with strict security and accountability controls. I optimized daily mission productivity by 30% through workflow improvements and standards development.",
    highlights: [
      "Conducted 350+ infrastructure evaluations while maintaining a 94% approval rate.",
      "Led 30 personnel and increased network security proficiency by 25% over two years.",
      "Managed 12M equipment inventory with strict security and accountability controls.",
      "Improved daily mission productivity by 30% through workflow optimization and standards.",
      "Maintained 99.8% uptime for critical communications systems supporting military operations.",
    ],
    tags: ["Network Security", "Communications", "Operations", "Leadership", "DoD", "Compliance"],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "Master of Science, Information Security Engineering",
    institution: "SANS Technology Institute",
    period: "Expected May 2027",
    details: [
      "Graduate-level focus on applied information security engineering and defensive operations.",
      "Advanced coursework in secure system design, threat modeling, and security operations.",
    ],
  },
  {
    degree: "Graduate Certificate, Penetration Testing and Ethical Hacking",
    institution: "SANS Technology Institute",
    period: "Mar 2025",
    details: [
      "Specialized training in offensive testing methods and adversarial security techniques.",
      "Hands-on labs covering web application testing, network penetration testing, and exploitation techniques.",
    ],
  },
  {
    degree: "Master of Science, Cybersecurity Technology",
    institution: "University of Maryland",
    period: "May 2023",
    details: [
      "Graduated Summa Cum Laude.",
      "Advanced coursework in cryptography, secure systems design, and security management.",
    ],
  },
  {
    degree: "Bachelor of Science, Cybersecurity and Networking",
    institution: "University of Maryland",
    period: "Dec 2021",
    details: [
      "Graduated Magna Cum Laude.",
      "Foundational coursework in network security, system administration, and security principles.",
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: "AWS Security Architecture Reference Library",
    summary:
      "Security-first architecture patterns for implementing IAM, KMS, network controls, and monitoring in regulated AWS environments.",
    description:
      "A comprehensive reference library documenting security-first architecture patterns for AWS. Covers identity and access management (IAM) best practices, encryption key management (KMS), network segmentation, and advanced monitoring. Designed for organizations implementing compliance frameworks like NIST, ISO 27001, and DoD standards. Includes Terraform modules, CloudFormation templates, and implementation guides.",
    tags: ["AWS", "IAM", "KMS", "Compliance", "Infrastructure as Code", "NIST"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
    impact: "Used by 50+ enterprise customers to accelerate secure cloud deployments",
  },
  {
    title: "Cloud Compliance Automation Toolkit",
    summary:
      "Automated checks and reporting templates for continuous control validation across cloud workloads.",
    description:
      "A Python-based toolkit for automating compliance validation across AWS, Azure, and GCP environments. Implements continuous compliance monitoring for NIST, CIS Benchmarks, and STIG standards. Generates automated reports, tracks remediation progress, and integrates with SIEM solutions. Reduces manual compliance assessment time by 80%.",
    tags: ["Automation", "Compliance", "Security Engineering", "Python", "AWS"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
    impact: "Reduced compliance assessment time from weeks to hours",
  },
  {
    title: "Threat and Incident Response Playbooks",
    summary:
      "Operational playbooks for triage, escalation, and containment built to improve consistency and response speed.",
    description:
      "A collection of incident response playbooks covering common attack scenarios, triage procedures, escalation workflows, and containment strategies. Includes templates for incident documentation, communication protocols, and post-incident analysis. Designed to improve MTTR and ensure consistent response across security teams.",
    tags: ["Incident Response", "Threat Intel", "Operations", "Runbooks", "Security Operations"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
    impact: "Improved mean time to response (MTTR) by 40%",
  },
  {
    title: "Infrastructure Hardening Baselines",
    summary:
      "Baseline hardening controls and implementation guidance aligned with STIG and cloud best practices.",
    description:
      "Comprehensive hardening baselines for Linux, Windows, and cloud infrastructure aligned with DISA STIG standards and CIS Benchmarks. Includes automated scanning scripts, remediation playbooks, and configuration management templates. Covers OS hardening, service hardening, and security monitoring configuration.",
    tags: ["STIG", "Hardening", "Cloud", "Security Baselines", "Infrastructure"],
    githubUrl: "https://github.com/Michael-JRead/MichaelJRead",
    impact: "Reduced vulnerability count by 85% across infrastructure",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  // ISACA Certifications
  { name: "Certified Information Security Manager (CISM)", issuer: "ISACA", year: "Active", status: "Active", category: "Management" },
  
  // ISC2 Certifications
  { name: "Certified Information Systems Security Professional (CISSP)", issuer: "ISC2", year: "Active", status: "Active", category: "Professional" },
  { name: "Certified Cloud Security Professional (CCSP)", issuer: "ISC2", year: "Active", status: "Active", category: "Cloud" },
  
  // SANS/GIAC Certifications
  { name: "GIAC Certified Incident Handler (GCIH)", issuer: "SANS", year: "Active", status: "Active", category: "Incident Response" },
  { name: "GIAC Penetration Tester (GPEN)", issuer: "SANS", year: "Active", status: "Active", category: "Offensive" },
  { name: "GIAC Cloud Penetration Tester (GCPN)", issuer: "SANS", year: "Active", status: "Active", category: "Cloud" },
  { name: "GIAC Web Application Penetration Tester (GWAPT)", issuer: "SANS", year: "Active", status: "Active", category: "Offensive" },
  { name: "GIAC Security Essentials (GSEC)", issuer: "SANS", year: "Active", status: "Active", category: "Fundamentals" },
  
  // AWS Certifications
  { name: "AWS Certified Solutions Architect - Professional", issuer: "AWS", year: "Active", status: "Active", category: "Cloud" },
  { name: "AWS Advanced Networking - Specialty", issuer: "AWS", year: "Active", status: "Active", category: "Cloud" },
  { name: "AWS Security - Specialty", issuer: "AWS", year: "Active", status: "Active", category: "Cloud" },
  
  // CompTIA Certifications
  { name: "CompTIA CASP+", issuer: "CompTIA", year: "Active", status: "Active", category: "Professional" },
  { name: "CompTIA CySA+", issuer: "CompTIA", year: "Active", status: "Active", category: "Professional" },
  { name: "CompTIA Security+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals" },
  { name: "CompTIA Network+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals" },
  { name: "CompTIA Linux+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals" },
];

export const CERTIFICATION_CATEGORIES = [
  { name: "Management", color: "bg-red-900/30 text-red-200", count: 1 },
  { name: "Professional", color: "bg-rose-900/30 text-rose-200", count: 3 },
  { name: "Cloud", color: "bg-orange-900/30 text-orange-200", count: 5 },
  { name: "Incident Response", color: "bg-red-900/30 text-red-200", count: 1 },
  { name: "Offensive", color: "bg-amber-900/30 text-amber-200", count: 3 },
  { name: "Fundamentals", color: "bg-slate-800 text-slate-200", count: 5 },
];

