import { ABOUT_PARAGRAPHS, CORE_SKILLS } from "@/data/siteContent";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Me</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>

          {/* About Content */}
          <div className="space-y-6 mb-12">
            {ABOUT_PARAGRAPHS.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Core Skills */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Core Competencies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CORE_SKILLS.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approach */}
          <div className="mt-16 p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">My Approach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">→</span> Strategic Thinking
                </h4>
                <p className="text-gray-700">
                  I align security initiatives with business objectives, ensuring that security investments drive measurable value while reducing risk.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">→</span> Technical Depth
                </h4>
                <p className="text-gray-700">
                  I combine hands-on technical expertise with architectural thinking to design solutions that are both secure and scalable.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">→</span> Operational Excellence
                </h4>
                <p className="text-gray-700">
                  I build processes and automation that enable teams to operate securely at scale without sacrificing speed or agility.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">→</span> Leadership & Collaboration
                </h4>
                <p className="text-gray-700">
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
