import { NAV_ITEMS, SITE_META } from "@/data/siteContent";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import HackTheBoxIcon from "./HackTheBoxIcon";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-gray-300 py-12 border-t border-red-500 border-opacity-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-red-500 border-opacity-20">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center font-bold text-slate-900">
                  {SITE_META.initials}
                </div>
                <span className="font-bold text-lg text-white">{SITE_META.fullName}</span>
              </div>
              <p className="text-gray-400 text-sm">{SITE_META.role}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-gray-400 hover:text-red-400 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={SITE_META.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                    GitHub Projects
                  </a>
                </li>
                <li>
                  <a href={SITE_META.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                    LinkedIn Profile
                  </a>
                </li>
                <li>
                  <a href={SITE_META.social.hackthebox} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                    Hack The Box Profile
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <div className="flex gap-3">
                <a
                  href={`mailto:${SITE_META.email}`}
                  className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 text-gray-400 rounded-lg hover:bg-red-500 hover:bg-opacity-30 hover:text-red-400 transition-all border border-red-500 border-opacity-20 hover:border-opacity-60"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
                <a
                  href={SITE_META.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 text-gray-400 rounded-lg hover:bg-red-500 hover:bg-opacity-30 hover:text-red-400 transition-all border border-red-500 border-opacity-20 hover:border-opacity-60"
                  title="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={SITE_META.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 text-gray-400 rounded-lg hover:bg-red-500 hover:bg-opacity-30 hover:text-red-400 transition-all border border-red-500 border-opacity-20 hover:border-opacity-60"
                  title="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href={SITE_META.social.hackthebox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 bg-slate-800 text-gray-400 rounded-lg hover:bg-red-500 hover:bg-opacity-30 hover:text-red-400 transition-all border border-red-500 border-opacity-20 hover:border-opacity-60"
                  title="Hack The Box"
                >
                  <HackTheBoxIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Colophon */}
          <p className="text-gray-500 text-sm max-w-md mb-6">
            Built with React, Vite, and Tailwind CSS; type set in Geist and Geist Mono.
            Statically deployed to GitHub Pages via GitHub Actions. Live Hack The Box stats
            sync daily.
          </p>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} {SITE_META.fullName}. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-400 rounded-lg hover:bg-red-500 hover:bg-opacity-30 hover:text-red-400 transition-all text-sm font-medium border border-red-500 border-opacity-20 hover:border-opacity-60"
            >
              Back to Top
              <ArrowUp size={16} />
            </button>
          </div>

          {/* Build marginalia — real git SHA + build time from Vite define */}
          <p className="mt-6 font-mono text-[11px] tracking-wider text-slate-600">
            BUILD {__BUILD_SHA__} · {__BUILD_TIME__} · {SITE_META.canonicalUrl.replace("https://", "").replace(/\/$/, "")}
          </p>
        </div>
      </div>
    </footer>
  );
}
