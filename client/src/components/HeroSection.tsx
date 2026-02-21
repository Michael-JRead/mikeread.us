import { SITE_META, HERO_STATS } from "@/data/siteContent";
import { ArrowRight, Download } from "lucide-react";
import ScrambleText from "./ScrambleText";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative pt-20 pb-32 overflow-hidden w-full"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"
          style={{ animation: "blob 7s infinite" }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"
          style={{ animation: "blob 7s infinite 2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-blob"
          style={{ animation: "blob 7s infinite 4s" }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(248, 113, 113, 0.04) 25%, rgba(248, 113, 113, 0.04) 26%, transparent 27%, transparent 74%, rgba(248, 113, 113, 0.04) 75%, rgba(248, 113, 113, 0.04) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(248, 113, 113, 0.04) 25%, rgba(248, 113, 113, 0.04) 26%, transparent 27%, transparent 74%, rgba(248, 113, 113, 0.04) 75%, rgba(248, 113, 113, 0.04) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "50px 50px",
        }}
        pointer-events-none
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-red-950 bg-opacity-60 text-red-200 rounded-full text-sm font-semibold border border-red-800 border-opacity-70 backdrop-blur-sm">
                Cybersecurity Professional
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                <ScrambleText
                  trigger="mount"
                  speed={0.03}
                  characterSet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*"
                >
                  {SITE_META.fullName}
                </ScrambleText>
              </h1>

              <p className="text-xl text-red-300 font-semibold">{SITE_META.role}</p>

              <p className="text-lg text-gray-300 leading-relaxed max-w-lg">
                {SITE_META.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-300 font-semibold group shadow-lg shadow-red-600/50 hover:shadow-red-600/70"
              >
                Let's Connect
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={SITE_META.requiredResumeSrc}
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-700 bg-opacity-50 text-white rounded-lg hover:bg-slate-600 transition-all duration-300 font-semibold border border-slate-600 backdrop-blur-sm"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href={SITE_META.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 bg-opacity-50 text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 border border-slate-700 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a
                href={SITE_META.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 bg-slate-800 bg-opacity-50 text-slate-300 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 border border-slate-700 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl blur-2xl opacity-30" />
              <div className="relative bg-white rounded-2xl p-2 shadow-2xl">
                <img
                  src={SITE_META.requiredPhotoSrc}
                  alt={SITE_META.fullName}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-12 border-t border-slate-700 border-opacity-50">
          {HERO_STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-400">{stat.value}</div>
              <div className="text-slate-400 mt-2 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
      `}</style>
    </section>
  );
}
