import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, SITE_META } from "@/data/siteContent";

const SECTION_IDS = NAV_ITEMS.map((item) => item.href.replace("#", ""));

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTION_IDS[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Bias the active band toward the upper-middle of the viewport.
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const onHome = location === "/";
  const activeSection = useActiveSection();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Scrollspy only applies on the single-page home; elsewhere nothing is active.
  const active = onHome ? activeSection : "";
  // Hash links must jump home first when viewed from another route.
  const to = (href: string) => (onHome ? href : `/${href}`);

  const handleNavClick = () => setIsOpen(false);

  // Close the mobile panel when the route changes (e.g. navigating to a subpage).
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Escape closes the open mobile panel and returns focus to the toggle button.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-red-900/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href={onHome ? "#hero" : "/"} className="flex items-center gap-2 font-bold text-xl text-white hover:text-red-300 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {SITE_META.initials}
          </div>
          <span className="hidden sm:inline">{SITE_META.fullName}</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={to(item.href)}
                aria-current={isActive ? "true" : undefined}
                className={`whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  isActive ? "text-red-300" : "text-slate-400 hover:text-red-300"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`mailto:${SITE_META.email}`}
            className="whitespace-nowrap px-5 py-2 border border-red-500/60 text-red-300 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors font-mono text-xs uppercase tracking-[0.12em]"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={toggleRef}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          className="lg:hidden p-2 text-slate-100 hover:bg-red-950/60 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-nav" className="lg:hidden border-t border-red-900/50 bg-slate-950/95">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            {NAV_ITEMS.map((item, i) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={to(item.href)}
                  onClick={handleNavClick}
                  aria-current={isActive ? "true" : undefined}
                  className={`font-mono text-sm uppercase tracking-widest py-3 border-b border-red-900/20 transition-colors ${
                    isActive ? "text-red-300" : "text-slate-300 hover:text-red-300"
                  }`}
                >
                  <span className="text-slate-600">{String(i + 1).padStart(2, "0")}.</span> {item.label}
                </a>
              );
            })}
            <a
              href={`mailto:${SITE_META.email}`}
              onClick={handleNavClick}
              className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium text-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
