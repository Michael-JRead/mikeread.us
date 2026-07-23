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
  /** Optional extra labeled links (e.g. individual PRs) rendered as buttons. */
  links?: { label: string; url: string }[];
}

export interface CertificationItem {
  name: string;
  shortName: string;
  issuer: string;
  year: string;
  status: "Active" | "In Progress" | "Planned";
  category?: string;
  badgeSrc?: string;
}

export type CaseStudyFormat = "Report" | "Policy" | "Presentation" | "Document";

export interface CaseStudyItem {
  title: string;
  category: string;
  format: CaseStudyFormat;
  url: string;
  description?: string;
}

export interface Walkthrough {
  name: string;
  platform: string; // e.g. "Hack The Box"
  kind: "Machine" | "Challenge" | "Sherlock" | "Fortress";
  os?: string; // "Linux" | "Windows" | ...
  difficulty?: "Easy" | "Medium" | "Hard" | "Insane";
  date?: string; // e.g. "Mar 2025"
  tags: string[];
  summary: string;
  url?: string; // link to the full write-up
}

// Social/OG share metadata lives in client/index.html (home page defaults) and is
// rewritten per route by scripts/postbuild-pages.mjs — it is intentionally not
// duplicated here, so there is nothing to keep in sync.
export const SITE_META = {
  canonicalUrl: "https://www.mikeread.us/",
  fullName: "Michael Read",
  initials: "MR",
  role: "Information Security Manager | Security Engineer",
  location: "Dallas, TX",
  availability: "Open to remote, hybrid, and cleared opportunities",
  email: "public.michaelread@gmail.com",
  summary:
    "I secure cloud deployments and sensitive data by aligning technical controls with business goals, leading cross-functional execution, and driving measurable risk reduction in regulated environments.",
  social: {
    github: "https://github.com/Michael-JRead",
    linkedin: "https://www.linkedin.com/in/michael-j-read99/",
    hackthebox: "https://app.hackthebox.com/users/1704613",
  },
  requiredPhotoSrc: "/assets/profile-photo.webp",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#portfolio" },
  { label: "Offensive Security", href: "#offensive-security" },
  { label: "Case Studies", href: "#case-studies" },
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
  "Offensive Security",
  "LAN/WAN and Cloud Networking",
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    role: "Senior Security Engineer",
    company: "JPMorganChase",
    period: "2025 - Present",
    location: "Plano, TX",
    summary:
      "Lead threat modeling and secure architecture reviews for cloud and application initiatives across the JPMorgan Chase Cybersecurity organization.",
    details:
      "As a Senior Security Engineer at JPMorganChase, I lead threat modeling engagements across cloud and application initiatives, identifying architectural weaknesses, abuse paths, trust boundary violations, and control gaps before production release. I embed threat modeling into the SDLC across engineering teams and review Terraform pull requests for AWS infrastructure deployments, enforcing least-privilege access. I built a threat modeling application adopted by the Cybersecurity organization that automates STRIDE analysis, MITRE ATT&CK mapping, control gap identification, threat actor profiling, mitigation recommendations, and cost-benefit assessments.",
    highlights: [
      "Lead threat modeling engagements across 12 cloud and application initiatives, identifying architectural weaknesses, abuse paths, trust boundary violations, and control gaps before production release.",
      "Embed threat modeling into the SDLC for 3 engineering teams, reducing late-stage security findings by 27% and strengthening secure design adoption across enterprise platforms.",
      "Review and approve 40+ Terraform pull requests monthly for AWS infrastructure deployments, enforcing least-privilege IAM and preventing 25+ high-risk permission issues per quarter, reducing access-related findings by 30%.",
      "Built a threat modeling application adopted by the JPMorgan Chase Cybersecurity organization, reducing threat model turnaround time by 83% (6 weeks to 1 week) through automation of STRIDE analysis, MITRE ATT&CK mapping, control gap identification, threat actor profiling, mitigation recommendations, and cost-benefit assessments.",
      "Engineered a cloud-native threat modeling tool using AWS vendor documentation and security guidance to identify control gaps, improving assessment consistency by 20% and reducing manual review effort by 10 hours per assessment.",
    ],
    tags: ["Threat Modeling", "STRIDE", "MITRE ATT&CK", "AWS", "Terraform", "IAM", "SDLC", "Secure Architecture"],
  },
  {
    role: "Solutions Architect Security Specialist",
    company: "Amazon Web Services",
    period: "2024 - 2025",
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
    period: "2023 - 2024",
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
    period: "2022 - 2023",
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
    period: "2017 - 2022",
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
    title: "Quarkus Security Contributions",
    summary:
      "Source-level security review and vulnerability research contributed to Quarkus, the Red Hat–backed Supersonic Subatomic Java framework used across enterprise cloud-native workloads.",
    description:
      "Reviewing Quarkus at the source level, I discovered and reported six security weaknesses that were fixed upstream and now ship to every downstream application. I found Dev MCP endpoints exposed without the localhost, CORS, and Host-header checks that guard the framework's other development-mode endpoints — the lockdown fix landed with credit to me (PR #55353, milestone 3.27.5). I also flagged that the same scoping gap left sibling dev-mode endpoints (`/q/arc/*`, `/q/quarkus-oidc/*`, `/q/open-in-ide/*`, `/q/dev-mcp`) reachable via DNS rebinding or an off-loopback bind, and Quarkus responded with a new global Host-validation filter that covers every dev-mode route (PR #55431). I reported an unauthenticated memory-exhaustion denial of service in the SmallRye GraphQL extension, where deeply nested queries against cyclic schemas could balloon into multi-gigabyte heap allocation from a single request, resolved with a sensible default query-depth limit (PR #55361). I found the Pulsar extension silently skipping TLS hostname verification even when it was explicitly configured — a man-in-the-middle exposure — fixed by properly enabling verification and honoring the trust-all setting (PR #55308). I reported that the Micrometer HTTP-server binding tagged its metrics with the raw request-line `method` token, letting an unauthenticated attacker mint a permanent Timer per unique method string — an unbounded, never-evicted meter leak — closed by folding the tag to a bounded allowlist of known HTTP methods (PR #55030). And I reported two flaws in remote dev mode: a path-traversal escape from the application root via unnormalized path resolution, and unsafe deserialization of network input through a raw ObjectInputStream with no filter — both hardened in one backported fix (PR #55380). Separately, I discovered and responsibly disclosed an unauthenticated denial-of-service vulnerability in Quarkus that the Quarkus and Red Hat security team has confirmed and fixed — a CVE advisory is pending publication, and I am honoring the coordinated-disclosure window before releasing details.",
    tags: ["Java", "Quarkus", "Vulnerability Research", "Secure Code Review", "CVE", "Denial of Service", "TLS", "Deserialization", "Responsible Disclosure"],
    githubUrl: "https://github.com/quarkusio/quarkus",
    links: [
      { label: "PR #55030", url: "https://github.com/quarkusio/quarkus/pull/55030" },
      { label: "PR #55308", url: "https://github.com/quarkusio/quarkus/pull/55308" },
      { label: "PR #55353", url: "https://github.com/quarkusio/quarkus/pull/55353" },
      { label: "PR #55361", url: "https://github.com/quarkusio/quarkus/pull/55361" },
      { label: "PR #55380", url: "https://github.com/quarkusio/quarkus/pull/55380" },
      { label: "PR #55431", url: "https://github.com/quarkusio/quarkus/pull/55431" },
    ],
    impact:
      "Six merged fixes hardening Quarkus defaults for every downstream app, plus a confirmed, responsibly disclosed CVE (advisory pending).",
  },
  {
    title: "SecretHound",
    summary:
      "An offline credential and secret analyzer for offensive-security engagements — pure local analysis with no network calls, no scanning, and no exploitation.",
    description:
      "SecretHound triages the loot you already hold during a pentest or OSCP-style engagement — other tools' output files, your own notes, Hashcat and John potfiles, SSH material, configs, databases, archives, and RDP session files — entirely offline. Fourteen analyzers (Shannon entropy, regex pattern matching, credential-pair extraction, encoded-secret decoding, SQLite triage, keyword and inventory sweeps, and more) classify every finding by severity, from CRITICAL decoded credentials and user/password pairs down to low-entropy leads, then assemble an ATTACK PATH panel that points you at the highest-value next move. It is deliberately air-gapped by design: it reads files you already have, never opens a network connection, and never attempts exploitation — making it safe to run against sensitive engagement data.",
    tags: ["Python", "Offensive Security", "OSCP", "Credential Analysis", "DFIR", "CLI"],
    githubUrl: "https://github.com/Michael-JRead/Secrethound",
    impact:
      "Turns scattered engagement loot into a ranked, offline attack path in a single pass — zero network exposure of sensitive data.",
  },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  // Threat Modeling
  {
    title: "Mobile Application Threat Model",
    category: "Threat Modeling",
    format: "Report",
    url: "https://drive.google.com/file/d/13fa8S2QdARld-aRrK2LXDzagzouQzL2w/view?usp=sharing",
    description:
      "Threat-models Instagram's mobile app against the OWASP Top 10, mapping attack surfaces across iOS, Android, and AWS backends to MFA, obfuscation, and CI/CD controls.",
  },

  // Enterprise Key Management
  {
    title: "What is Enterprise Key Management",
    category: "Enterprise Key Management",
    format: "Document",
    url: "https://drive.google.com/file/d/1xdx2bMyKnVHr5_SldNObIlOHSvWpPd8P/view?usp=sharing",
    description:
      "Designs an enterprise key management overhaul for a healthcare provider, comparing AWS KMS, CloudHSM, and Certificate Manager against Azure Key Vault for HIPAA workloads.",
  },
  {
    title: "Enterprise Key Management Policy",
    category: "Enterprise Key Management",
    format: "Policy",
    url: "https://drive.google.com/file/d/1KtaZ3n_wIihTexb4HQ39cf9oKGvBiHMg/view?usp=sharing",
    description:
      "Establishes a cryptographic key lifecycle policy for a healthcare enterprise, governing AWS Certificate Manager, FIPS 140-2 CloudHSM backups, CRLs, and CloudTrail auditing.",
  },

  // Security Assessment Report (SAR)
  {
    title: "Office of Personnel Management (OPM) Breach",
    category: "Security Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1r0ZgMN1lbi3BYCQGNbHjDy7p2CucPQ_x/view?usp=sharing",
    description:
      "Dissects the 2015 OPM breach of 4.2 million federal personnel records, then applies Nmap, Wireshark, and OpenVAS findings to harden ports, databases, and authentication.",
  },
  {
    title: "APT28 & APT29",
    category: "Security Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1C9N3ELT7SeH1zbRqYEMi47-nPmL6MBWX/view?usp=sharing",
    description:
      "Profiles Russian APT28 and APT29 — HAMMERTOSS steganography, spear phishing, and the SolarWinds compromise — mapping CISA-documented TTPs across US critical infrastructure.",
  },
  {
    title: "Hybrid Cloud Implementation",
    category: "Security Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1MubpOqCJ6miXpLU2eqruKwJey7koceG7/view?usp=sharing",
    description:
      "Assesses Windows, Linux, and macOS vulnerabilities with OpenVAS under the NIST Cybersecurity Framework, driving port hardening and a shift to hybrid cloud IaaS.",
  },

  // After Action Reports (AAR)
  {
    title: "APT28 & APT29 After Action Report",
    category: "After Action",
    format: "Report",
    url: "https://drive.google.com/file/d/1eTBo-e7KhUWYSJT7cnSBJyyjt39uDrBY/view?usp=sharing",
    description:
      "Analyzes a simulated APT28/APT29 breach of U.S. financial-sector infrastructure and prescribes DevOps, firewall logging, RBAC, DMZs, and GnuPG/IPsec encryption controls.",
  },

  // Risk Assessment Reports (RAR)
  {
    title: "Simulation of Organization with Vulnerabilities",
    category: "Risk Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1I4KK98iVWLDzUkL8d0nGl9ckfLB3zFBv/view?usp=sharing",
    description:
      "Applies MITRE's Mission Assurance Engineering framework to OpenVAS, Nessus, and Wireshark scans of a simulated network, mapping open-port and weak-cipher risks to a timed POA&M.",
  },
  {
    title: "Nations Behaving Badly",
    category: "Risk Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1oLtP0WJznlf12BBKG66ELdv4-Qsoe2KA/view?usp=drive_link",
    description:
      "Responds to nation-state data exfiltration at a multilateral summit with a NIST-based incident response plan for Canada, FVEY threat sharing, and Snort DoS detection rules.",
  },
  {
    title: "Protecting the Homeland",
    category: "Risk Assessment",
    format: "Report",
    url: "https://drive.google.com/file/d/1y4Fxzkw3xdHaTnwDFYLeQbpLJYZBhbYE/view?usp=sharing",
    description:
      "Advocates international cyber capacity building through public-private partnerships, the Budapest Convention, and volunteer SMEs to close developing nations' skills gaps.",
  },

  // AWS Solutions Architect Case Studies
  {
    title: "Highly Available Web Application in AWS",
    category: "AWS Architecture",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1vVF7xj0RGlBPyRExCpIZQaEj7STOA9JN/edit?usp=sharing&ouid=117836549247985822423&rtpof=true&sd=true",
    description:
      "Presents an AWS proof of concept for a highly available web app, demonstrating EC2 Auto Scaling launch templates and policies with ELB, Route 53, and RDS across AZs.",
  },
  {
    title: "Cloud Migration for Data Analytics Company",
    category: "AWS Architecture",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1gi50cEvxLsh6X96w_38ZfmRSulBPkxLV/edit?usp=sharing",
    description:
      "Charts a 40 TB AWS migration for a legal analytics firm using Snowball, DMS, and Kinesis Firehose feeding S3, Glue, Redshift, OpenSearch, Aurora, and SageMaker ML.",
  },
  {
    title: "Security Architecture for AWS Infrastructure",
    category: "AWS Architecture",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1Q3I5oirZgeer08_61nHbUfy-e3XpR8FN/edit?usp=sharing",
    description:
      "Architects automated incident response to an EC2 crypto-mining compromise using Security Hub, GuardDuty, Inspector, AWS Config, Lambda, and Slack alerts aligned to CIS benchmarks.",
  },
  {
    title: "Telehealth Platform to AWS",
    category: "AWS Architecture",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1hc_re3RFxUCFiiso6E5yLVVjg4NKBI7C/edit?usp=sharing",
    description:
      "Charts a HIPAA-compliant migration of a monolithic Java telehealth platform to AWS microservices on ECS/Fargate, adding Comprehend Medical PII redaction and a 12-month roadmap.",
  },
  {
    title: "On-Prem to AWS Migration",
    category: "AWS Architecture",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1z9eAV_quyTLkegRjyY6nXQkUZVYVR4eP/edit?usp=sharing",
    description:
      "Designs a highly available, PCI-DSS-compliant migration to AWS spanning CloudFront, Fargate, ElastiCache, and RDS, plus managed CI/CD, WAF, Shield, and GuardDuty.",
  },

  // Advanced Cyber Exploitation & Mitigation Methodologies
  {
    title: "Strategic Plan for Data Loss Prevention",
    category: "Exploitation & Mitigation",
    format: "Document",
    url: "https://docs.google.com/document/d/1hqhKzXhclBSX-fgDCY9t8eMg71ySIfMa/edit?usp=sharing",
    description:
      "Maps a five-year data loss prevention strategy for a media enterprise via SWOT analysis, IPv6/IoT adoption, tokenization, masking, blockchain, and context-aware security.",
  },
  {
    title: "Secure Video Conferencing Communications",
    category: "Exploitation & Mitigation",
    format: "Document",
    url: "https://docs.google.com/document/d/1yDmfYas6hccSJk46o5Tjs6gj-oC2DLjU/edit?usp=sharing",
    description:
      "Compares Zoom, Google Meet, and Microsoft Teams on CVE history, GDPR compliance, encryption, and MFA/SSO, recommending Teams for a 90% remote media workforce.",
  },
  {
    title: "System Security Report",
    category: "Exploitation & Mitigation",
    format: "Document",
    url: "https://docs.google.com/document/d/1PZvayMaVWCp1RncwT3vrRDMfEnz5dsep/edit?usp=sharing",
    description:
      "Assesses a media-streaming acquisition through PCI DSS gap analysis, MITRE ATT&CK threat mapping, RTSP/RTP protocol review, and NIST SP 800-161 supply chain mitigations.",
  },

  // Digital Forensics
  {
    title: "Digital Forensics Overview",
    category: "Digital Forensics",
    format: "Report",
    url: "https://drive.google.com/file/d/1158WeWxdbQiBsCnubMZGyPnCvGu_RXH5/view?usp=sharing",
    description:
      "Explains the NIST four-phase forensic methodology and applies FTK Imager and EnCase to create hash-verified disk images while preserving evidence integrity and chain of custody.",
  },
  {
    title: "Network Intrusion",
    category: "Digital Forensics",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/16Vw_i2JEL427uLxsC4IDrWn7YJfIOdFR/edit?usp=sharing",
    description:
      "Recreates a Kali Linux attack using dirb to brute-force a hidden IIS directory of stored credentials on Windows Server 2019, then decodes the Base64 secrets in CyberChef.",
  },
  {
    title: "Data Exfiltration Walkthrough",
    category: "Digital Forensics",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1MtTFtQOvkwqN46zCUIJeKTAV4IO53xV_/edit?usp=sharing",
    description:
      "Traces an attack chain — Nmap port scanning, SSH login, a spoofed 'Administrator' account, and scheduled-task persistence — ending in theft of the server's private SSH key.",
  },
  {
    title: "Forensic Analysis of an Intrusion",
    category: "Digital Forensics",
    format: "Presentation",
    url: "https://docs.google.com/presentation/d/1IjwaexTztnmmHZOL943JJE5e0IFb2Xqd/edit?usp=sharing",
    description:
      "Reconstructs an intrusion at Mercury USA from IIS logs, Autoruns, Task Scheduler ncat backdoors, and Event Viewer account-creation events, confirming RSA private-key exfiltration.",
  },

  // Cryptography
  {
    title: "Cryptography Report",
    category: "Cryptography",
    format: "Report",
    url: "https://drive.google.com/file/d/1j_IUFM1J6XaDY-vuSiDau5aWWGTUCWfM/view?usp=sharing",
    description:
      "Proposes an enterprise crypto architecture comparing Caesar, one-time pad, RSA, and AES, plus steganography, PKI, PGP/GPG email, and CAC smart-card access built on AWS services.",
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  // ISACA
  { name: "Certified Information Security Manager", shortName: "CISM", issuer: "ISACA", year: "Active", status: "Active", category: "Management", badgeSrc: "/assets/certs/cism.png" },

  // ISC2
  { name: "Certified Information Systems Security Professional", shortName: "CISSP", issuer: "ISC2", year: "Active", status: "Active", category: "Professional", badgeSrc: "/assets/certs/cissp.png" },
  { name: "Certified Cloud Security Professional", shortName: "CCSP", issuer: "ISC2", year: "Active", status: "Active", category: "Cloud", badgeSrc: "/assets/certs/ccsp.png" },

  // GIAC (SANS)
  { name: "GIAC Strategic Planning, Policy, and Leadership", shortName: "GSTRT", issuer: "GIAC", year: "Active", status: "Active", category: "Management", badgeSrc: "/assets/certs/gstrt.png" },
  { name: "GIAC Defensible Security Architect", shortName: "GDSA", issuer: "GIAC", year: "Active", status: "Active", category: "Professional", badgeSrc: "/assets/certs/gdsa.png" },
  { name: "GIAC Certified Incident Handler", shortName: "GCIH", issuer: "GIAC", year: "Active", status: "Active", category: "Incident Response", badgeSrc: "/assets/certs/gcih.png" },
  { name: "GIAC Penetration Tester", shortName: "GPEN", issuer: "GIAC", year: "Active", status: "Active", category: "Offensive", badgeSrc: "/assets/certs/gpen.png" },
  { name: "GIAC Cloud Penetration Tester", shortName: "GCPN", issuer: "GIAC", year: "Active", status: "Active", category: "Cloud", badgeSrc: "/assets/certs/gcpn.png" },
  { name: "GIAC Web Application Penetration Tester", shortName: "GWAPT", issuer: "GIAC", year: "Active", status: "Active", category: "Offensive", badgeSrc: "/assets/certs/gwapt.png" },
  { name: "GIAC Security Essentials", shortName: "GSEC", issuer: "GIAC", year: "Active", status: "Active", category: "Fundamentals", badgeSrc: "/assets/certs/gsec.png" },

  // AWS
  { name: "AWS Certified Solutions Architect - Professional", shortName: "Solutions Architect Pro", issuer: "AWS", year: "Active", status: "Active", category: "Cloud", badgeSrc: "/assets/certs/aws-sap.png" },
  { name: "AWS Certified Advanced Networking - Specialty", shortName: "Advanced Networking", issuer: "AWS", year: "Active", status: "Active", category: "Cloud", badgeSrc: "/assets/certs/aws-ans.png" },
  { name: "AWS Certified Security - Specialty", shortName: "Security Specialty", issuer: "AWS", year: "Active", status: "Active", category: "Cloud", badgeSrc: "/assets/certs/aws-scs.png" },

  // CompTIA
  { name: "CompTIA SecurityX (formerly CASP+)", shortName: "SecurityX", issuer: "CompTIA", year: "Active", status: "Active", category: "Professional", badgeSrc: "/assets/certs/comptia-casp.png" },
  { name: "CompTIA Cybersecurity Analyst", shortName: "CySA+", issuer: "CompTIA", year: "Active", status: "Active", category: "Professional", badgeSrc: "/assets/certs/comptia-cysa.png" },
  { name: "CompTIA Security+", shortName: "Security+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals", badgeSrc: "/assets/certs/comptia-security.png" },
  { name: "CompTIA Network+", shortName: "Network+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals", badgeSrc: "/assets/certs/comptia-network.png" },
  { name: "CompTIA Linux+", shortName: "Linux+", issuer: "CompTIA", year: "Active", status: "Active", category: "Fundamentals", badgeSrc: "/assets/certs/comptia-linux.png" },
];



// Retired-machine / challenge write-ups are defined as typed WalkthroughDocs in
// client/src/data/walkthroughs/ and surfaced via the WALKTHROUGHS summary array
// exported from @/data/walkthroughs. Per Hack The Box policy, only retired
// content is documented publicly. The `Walkthrough` interface above is the card
// shape consumed by the dossier.
