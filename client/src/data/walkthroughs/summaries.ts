// Lightweight walkthrough metadata for the dossier cards + routing. This file is
// deliberately free of the heavy `sections` content so the offensive-security page
// never pulls a full write-up into its bundle. The full WalkthroughDoc for each box
// is loaded lazily per-route (see ./loaders).
//
// Keep these headers in sync with each box's WalkthroughDoc header. HTB policy:
// only RETIRED, compliance-verified machines appear here.

import type { Walkthrough } from "@/data/siteContent";

export interface WalkthroughSummary {
  slug: string;
  name: string;
  platform: string;
  os: "Linux" | "Windows" | "Other";
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
  retired: string;
  tags: string[];
  summary: string;
}

// Order shown on the dossier: most-recently-retired first.
export const WALKTHROUGH_SUMMARIES: WalkthroughSummary[] = [
  {
    slug: "orion",
    name: "Orion",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Jul 2026",
    tags: ["CraftCMS", "CVE-2025-32432", "PHP deserialization", "unauth RCE", "bcrypt / john", "credential reuse", "telnetd", "CVE-2026-24061"],
    summary:
      "Pre-auth CraftCMS RCE (CVE-2025-32432) to www-data, .env-to-bcrypt-to-SSH lateral as adam, then a telnetd USER-env auth bypass (CVE-2026-24061) to root.",
  },
  {
    slug: "nexus",
    name: "Nexus",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Jul 2026",
    tags: ["Gitea history", "Krayin CRM", "CVE-2026-38526", "TinyMCE upload", "password reuse", "systemd timer", "path traversal", "authorized_keys"],
    summary:
      "Gitea history leak → Krayin CRM CVE-2026-38526 TinyMCE upload RCE → `.env` password reuse → a root-owned Gitea template sync writes `authorized_keys` via a path-traversal tree entry.",
  },
  {
    slug: "odyssey",
    name: "Odyssey",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Insane",
    retired: "2026",
    tags: ["NoSQL Injection", "WebAuthn Abuse", "Prototype Pollution", "CVE-2025-1302", "MSSQL Coercion", "GodPotato", "BadSuccessor dMSA", "YAML Deserialization"],
    summary:
      "NoSQL leak → WebAuthn userHandle confusion → prototype pollution → LaTeX file read → jsonpath-plus RCE → MSSQL coercion → GodPotato → BadSuccessor dMSA → YAML deserialization on the DC.",
  },
  {
    slug: "sorcery",
    name: "Sorcery",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Apr 2026",
    tags: ["Cypher Injection", "Stored XSS", "SSRF", "Kafka RCE", "CA Compromise", "FreeIPA", "Pivoting"],
    summary:
      "An unparameterized Cypher injection unravels a microservice mesh — XSS, SSRF, a hand-built Kafka frame, a cracked CA, and FreeIPA — to root.",
  },
  {
    slug: "cobblestone",
    name: "Cobblestone",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "2026",
    tags: ["boolean-blind SQLi", "MySQL FILE read", "stored XSS", "Twig SSTI", "rbash jail", "Cobbler XML-RPC", "Cheetah RCE"],
    summary:
      "A seven-link web kill-chain: blind SQLi to LOAD_FILE source disclosure, stored-XSS-driven Twig SSTI, a cracked hash, an rbash jail, and a localhost Cobbler XML-RPC bypass into Cheetah RCE as root.",
  },
  {
    slug: "whiterabbit",
    name: "White Rabbit",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Dec 2025",
    tags: ["n8n / SQLi", "HMAC webhook", "restic", "7-Zip", "Docker escape", "PRNG RE"],
    summary:
      "An exposed Uptime Kuma leak and HMAC-signed webhook SQLi lead to restic backup abuse, a Docker escape, and a clock-seeded password generator to root.",
  },
  {
    slug: "thefrizz",
    name: "TheFrizz",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Medium",
    retired: "Aug 2025",
    tags: ["Gibbon-LMS", "CVE-2023-45878", "Arbitrary File Write", "Salted SHA256", "Kerberos SSH", "Recycle Bin Recovery", "GPO Abuse", "Active Directory"],
    summary:
      "CVE-2023-45878 file write in Gibbon-LMS to a web shell, a cracked salted SHA256 for Kerberos SSH, a Recycle Bin WAPT backup, and GPO abuse to SYSTEM.",
  },
  {
    slug: "zero",
    name: "Zero",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Aug 2025",
    tags: ["SFTP", "mod_userdir", "Arbitrary file read", "Password reuse", "Apache cron", "cmdline spoofing"],
    summary:
      "An Insane Linux box chaining self-service SFTP creds, an .htaccess arbitrary file read, and a root Apache config-check cron into full root.",
  },
  {
    slug: "escapetwo",
    name: "EscapeTwo",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "May 2025",
    tags: ["Assumed Breach", "XLSX cred recovery", "MSSQL xp_cmdshell", "Password reuse", "BloodHound / WriteOwner", "Shadow Credentials", "ADCS ESC4 → ESC1", "Pass-the-Hash"],
    summary:
      "Corrupt-XLSX cred recovery and MSSQL xp_cmdshell lead to a reused service password, then a WriteOwner ACL and ADCS ESC4→ESC1 certificate abuse to Domain Admin.",
  },
  {
    slug: "ghost",
    name: "Ghost",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Insane",
    retired: "Apr 2025",
    tags: ["Active Directory", "LDAP Injection", "Golden SAML", "ADIDNS Poisoning", "gMSA", "MSSQL Linked Server", "Forest Trust"],
    summary:
      "An Insane Windows forest: LDAP wildcard bypass, container foothold, gMSA, Golden SAML, and a cross-realm golden ticket to Enterprise Admin.",
  },
  {
    slug: "certified",
    name: "Certified",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Medium",
    retired: "Mar 2025",
    tags: ["Active Directory", "Assumed Breach", "BloodHound", "WriteOwner / ACL abuse", "Shadow Credentials", "ADCS ESC9", "Certipy", "Pass-the-Hash"],
    summary:
      "An assumed-breach AD box chaining WriteOwner over a group through Shadow Credentials to service accounts, then an ADCS ESC9 UPN-swap to forge the Administrator certificate for domain compromise.",
  },
  {
    slug: "cicada",
    name: "Cicada",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Feb 2025",
    tags: ["Active Directory", "SMB null session", "RID cycling", "Password spray", "LDAP description", "SeBackupPrivilege", "Backup Operators", "Pass-the-Hash"],
    summary:
      "Guest SMB, RID-cycling, a password-in-LDAP-description, and a Backup Operator's SeBackupPrivilege chain from anonymous into a Domain Admin Pass-the-Hash.",
  },
  {
    slug: "magicgardens",
    name: "MagicGardens",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Feb 2025",
    tags: ["SSRF", "QR-code XSS", "Django admin", "harvest BOF", "Docker registry", "Pickle RCE", "CAP_SYS_MODULE"],
    summary:
      "SSRF-forced subscription and QR-code XSS reach the Django admin; a harvest buffer overflow, a leaked registry image, a forged pickle session, and CAP_SYS_MODULE chain to host root.",
  },
  {
    slug: "sea",
    name: "Sea",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Dec 2024",
    tags: ["WonderCMS", "CVE-2023-41425", "XSS-to-RCE", "bcrypt cracking", "Password reuse", "SSH tunneling", "Command injection"],
    summary:
      "Phish the WonderCMS admin bot with a CVE-2023-41425 XSS-to-RCE, crack a bcrypt hash for SSH password reuse, then command-inject a loopback log analyzer running as root.",
  },
  {
    slug: "mist",
    name: "Mist",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Insane",
    retired: "Oct 2024",
    tags: ["ADCS", "ESC13", "Shadow Credentials", "NTLM Relay", "PKINIT", "gMSA", "Backup Operators"],
    summary:
      "An Insane Windows AD box chaining a Pluck CMS file-read and RCE into ADCS abuse — PKINIT, NTLM relay, shadow creds, double ESC13 — to Domain Admin.",
  },
  {
    slug: "skyfall",
    name: "Skyfall",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Aug 2024",
    tags: ["nginx/Flask parser differential", "ACL bypass", "SSRF / metrics", "MinIO CVE-2023-28432", "HashiCorp Vault SSH OTP", "go-fuse memfs", "sudo debug-log capture"],
    summary:
      "An nginx/Flask parser differential unlocks a metrics page that leaks MinIO; CVE-2023-28432 discloses its root keys, a versioned backup yields a Vault token, and a chatty sudo unseal binary captured over go-fuse gives up the root Vault token for SSH-OTP root.",
  },
  {
    slug: "ouija",
    name: "Ouija",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "May 2024",
    tags: ["HTTP Request Smuggling", "CVE-2021-40346", "HAProxy", "SHA-256 Length Extension", "Node.js API", "PHP C Extension", "Integer Overflow", "Reverse Engineering"],
    summary:
      "HAProxy request smuggling reaches a filtered dev vhost, a SHA-256 length-extension forge unlocks an API file-read, and an integer overflow in a bespoke PHP C extension gives a root arbitrary write.",
  },
  {
    slug: "twomillion",
    name: "TwoMillion",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Jun 2023",
    tags: ["Invite Code", "JS Deobfuscation", "API Abuse", "Broken Access Control", "Command Injection", "Password Reuse", "CVE-2023-0386"],
    summary:
      "Reverse an obfuscated invite flow, abuse a broken-access-control API to self-promote to admin, blind-inject the VPN generator for a shell, reuse .env creds over SSH, and OverlayFS (CVE-2023-0386) to root.",
  },
  {
    slug: "flight",
    name: "Flight",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Hard",
    retired: "May 2023",
    tags: ["LFI/RFI", "Responder / Net-NTLMv2", "Password spray", "Forced authentication", "SMB share abuse", "ASPX webshell", "SeImpersonate / JuicyPotatoNG", "Active Directory"],
    summary:
      "An LFI on a flight-school vhost coerces svc_apache's Net-NTLMv2 hash to Responder; cracking, spraying, and desktop.ini forced-auth chain across S.Moon and c.bum to a webshell, then JuicyPotatoNG on an IIS apppool for SYSTEM.",
  },
  {
    slug: "response",
    name: "Response",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Feb 2023",
    tags: ["HMAC signing oracle", "SSRF proxy", "rogue LDAP bypass", "cross-protocol FTP forgery", "NSE directory traversal", "Meterpreter decrypt", "SSH key recovery"],
    summary:
      "Weaponise an HMAC signing oracle into an SSRF proxy, bypass LDAP auth with a rogue server, forge cross-protocol FTP requests, exploit a backdoored ssl-cert NSE script, then decrypt Meterpreter traffic to rebuild root's SSH key.",
  },
  {
    slug: "scanned",
    name: "Scanned",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "Sep 2022",
    tags: ["chroot escape", "ptrace / proc-fd", "Django MD5", "hashcat -m 20", "LD_PRELOAD", "setuid su", "namespaces", "capabilities"],
    summary:
      "A downloadable chroot/ptrace sandbox leaks two bugs — dumpable-before-fork and a leaked outer-dir fd — that give arbitrary file read via /proc/1/fd/3, cracked Django creds for SSH, then a trojaned libpam_misc.so.0 loaded into setuid su for root.",
  },
  {
    slug: "timelapse",
    name: "Timelapse",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Aug 2022",
    tags: ["Active Directory", "SMB null session", "zip2john", "pfx2john", "PFX cert auth", "Evil-WinRM", "PowerShell history", "LAPS"],
    summary:
      "Anonymous SMB yields a zip hiding a WinRM client cert; PowerShell history leaks a service account whose LAPS read rights expose the DC's local Administrator password.",
  },
  {
    slug: "cap",
    name: "Cap",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Oct 2021",
    tags: ["IDOR", "PCAP analysis", "Wireshark", "FTP cleartext creds", "credential reuse", "Linux capabilities", "cap_setuid", "Python privesc"],
    summary:
      "An IDOR on a Flask/Gunicorn security dashboard leaks a PCAP with cleartext FTP creds for nathan, reused over SSH, then cap_setuid on /usr/bin/python3.8 gives root.",
  },
  {
    slug: "sauna",
    name: "Sauna",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Jul 2020",
    tags: ["Active Directory", "AS-REP Roasting", "Kerberos", "Hashcat", "AutoLogon Creds", "BloodHound", "DCSync", "Pass-the-Hash"],
    summary:
      "Harvest AD usernames from the bank site, AS-REP roast fsmith, loot AutoLogon creds for svc_loanmgr, then DCSync the Administrator hash and pass-the-hash to root.",
  },
  {
    slug: "forest",
    name: "Forest",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Mar 2020",
    tags: ["Active Directory", "AS-REP Roasting", "Kerberos", "BloodHound", "WriteDACL", "DCSync", "Pass-the-Hash", "Evil-WinRM"],
    summary:
      "Null-session enumeration finds svc-alfresco, AS-REP roasting cracks it, and an Exchange WriteDACL ACL abuse grants DCSync to dump the Administrator hash and pass-the-hash to root.",
  },
  {
    slug: "bastion",
    name: "Bastion",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Sep 2019",
    tags: ["Anonymous SMB", "VHD mount", "guestmount", "SAM/SYSTEM dump", "NTLM cracking", "mRemoteNG", "credential decryption"],
    summary:
      "Anonymous SMB exposes a backup VHD; mount it with guestmount, dump SAM/SYSTEM, crack L4mpje's NTLM hash, then decrypt an mRemoteNG saved credential to SSH in as Administrator.",
  },
  {
    slug: "rope",
    name: "Rope",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Insane",
    retired: "2019",
    tags: ["Format String", "GOT Overwrite", "Path Traversal / LFI", "ASLR/PIE Bypass", "LD_LIBRARY hijack", "Stack Canary Brute Force", "ret2libc / ROP", "pwntools"],
    summary:
      "An LFI-assisted format-string GOT overwrite lands a shell, a world-writable liblog.so hijack pivots users, and a canary-brute ROP chain against a root service on 1337 gives root.",
  },
  {
    slug: "active",
    name: "Active",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "Dec 2018",
    tags: ["Active Directory", "SMB null session", "GPP cpassword", "gpp-decrypt", "Kerberoasting", "GetUserSPNs", "hashcat", "PsExec"],
    summary:
      "Anonymous SMB reads a GPP cpassword for SVC_TGS, which Kerberoasts the Administrator SPN; cracking the TGS hash yields Domain Admin and a PsExec SYSTEM shell.",
  },
  {
    slug: "nibbles",
    name: "Nibbles",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "Aug 2018",
    tags: ["Web enumeration", "Nibbleblog 4.0.3", "CVE-2015-6967", "Arbitrary file upload", "PHP webshell", "Weak credentials", "sudo NOPASSWD"],
    summary:
      "A hidden Nibbleblog 4.0.3 install, guessable admin:nibbles creds, and a My Image plugin file-upload (CVE-2015-6967) give a shell as nibbler; a sudo NOPASSWD rule on a writable monitor.sh hands over root.",
  },
  {
    slug: "legacy",
    name: "Legacy",
    platform: "Hack The Box",
    os: "Windows",
    difficulty: "Easy",
    retired: "2017",
    tags: ["SMBv1", "MS17-010", "EternalBlue", "MS08-067", "Windows XP", "Metasploit", "OSCP-like"],
    summary:
      "An unpatched Windows XP SP3 host exposes SMBv1 vulnerable to both MS17-010 (EternalBlue) and MS08-067 (NetAPI); one unauthenticated exploit lands a direct SYSTEM shell.",
  },
  {
    slug: "lame",
    name: "Lame",
    platform: "Hack The Box",
    os: "Linux",
    difficulty: "Easy",
    retired: "May 2017",
    tags: ["Samba", "CVE-2007-2447", "usermap script", "distccd", "CVE-2004-2687", "SUID nmap", "unauth RCE"],
    summary:
      "An unauthenticated Samba 3.0.20 username-map-script injection (CVE-2007-2447) yields a direct root shell, with an alternate distccd RCE foothold escalated via SUID nmap's interactive mode.",
  },
];

export const WALKTHROUGH_SLUGS: string[] = WALKTHROUGH_SUMMARIES.map((s) => s.slug);

// Card shape consumed by the offensive-security dossier (section 07).
export const WALKTHROUGHS: Walkthrough[] = WALKTHROUGH_SUMMARIES.map((s) => ({
  name: s.name,
  platform: s.platform,
  kind: "Machine",
  os: s.os,
  difficulty: s.difficulty,
  date: s.retired,
  tags: s.tags,
  summary: s.summary,
  url: `/offensive-security/walkthroughs/${s.slug}`,
}));
