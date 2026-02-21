import { ABOUT_PARAGRAPHS, CORE_SKILLS } from "@/data/siteContent";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Me
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-700 rounded-full"></div>
          </div>

          {/* About Content */}
          <div className="space-y-6 mb-12">
            {ABOUT_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Core Skills */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-8">
              Core Competencies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORE_SKILLS.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg border border-red-500 border-opacity-30 hover:border-opacity-60 hover:bg-slate-800 transition-all duration-300 group"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-red-700 rounded-full group-hover:shadow-lg group-hover:shadow-red-500/50 transition-all"></div>
                  <span className="text-gray-200 font-medium group-hover:text-red-400 transition-colors">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approach */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-red-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">
              My Approach
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-red-500">-&gt;</span> Strategic Thinking
                </h4>
                <p className="text-gray-400">
                  I align security initiatives with business objectives, ensuring that security investments drive measurable value while reducing risk.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-red-500">-&gt;</span> Technical Depth
                </h4>
                <p className="text-gray-400">
                  I combine hands-on technical expertise with architectural thinking to design solutions that are both secure and scalable.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-red-500">-&gt;</span> Operational Excellence
                </h4>
                <p className="text-gray-400">
                  I build processes and automation that enable teams to operate securely at scale without sacrificing speed or agility.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-red-500">-&gt;</span> Leadership & Collaboration
                </h4>
                <p className="text-gray-400">
                  I work effectively across technical and executive teams, translating complex security concepts into actionable strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

