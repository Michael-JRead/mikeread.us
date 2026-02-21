import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS, SITE_META } from "@/data/siteContent";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-red-900/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-bold text-xl text-white hover:text-red-300 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {SITE_META.initials}
          </div>
          <span className="hidden sm:inline">{SITE_META.fullName}</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-200 hover:text-red-300 font-medium transition-colors text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={`mailto:${SITE_META.email}`}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium text-sm"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-100 hover:bg-red-950/60 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-red-900/50 bg-slate-950/95">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="text-slate-200 hover:text-red-300 font-medium transition-colors py-2"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${SITE_META.email}`}
              onClick={handleNavClick}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium text-center"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
