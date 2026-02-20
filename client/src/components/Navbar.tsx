import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, SITE_META } from "@/data/siteContent";

function scrollToHash(hash: string) {
  if (hash === "#") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const target = document.querySelector(hash);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={`site-nav ${isScrolled ? "site-nav-scrolled" : ""}`}>
      <div className="container nav-row">
        <a
          href="#"
          className="brand-mark"
          onClick={(event) => {
            event.preventDefault();
            scrollToHash("#");
            setMenuOpen(false);
          }}
          aria-label="Back to top"
        >
          {SITE_META.initials}
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-item"
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-nav-item"
              onClick={(event) => {
                event.preventDefault();
                scrollToHash(item.href);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}