import { SITE_META } from "@/data/siteContent";
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react";
import { useState } from "react";
import ScrambleText from "./ScrambleText";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link
    const mailtoLink = `mailto:${SITE_META.email}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <ScrambleText trigger="mount" speed={0.03}>
                Let's Connect
              </ScrambleText>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mx-auto"></div>
            <p className="text-lg text-gray-400 mt-4">
              I'm always interested in discussing cybersecurity challenges, opportunities, and collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="p-6 bg-slate-900 bg-opacity-40 border border-cyan-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 transition-all backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg border border-cyan-500 border-opacity-40">
                  <Mail className="text-cyan-400" size={24} />
                </div>
                <h3 className="font-bold text-white">Email</h3>
              </div>
              <a
                href={`mailto:${SITE_META.email}`}
                className="text-cyan-300 hover:text-cyan-200 font-medium break-all transition-colors"
              >
                {SITE_META.email}
              </a>
            </div>

            <div className="p-6 bg-slate-900 bg-opacity-40 border border-cyan-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 transition-all backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg border border-cyan-500 border-opacity-40">
                  <MapPin className="text-cyan-400" size={24} />
                </div>
                <h3 className="font-bold text-white">Location</h3>
              </div>
              <p className="text-gray-300 font-medium">{SITE_META.location}</p>
              <p className="text-gray-400 text-sm mt-1">{SITE_META.availability}</p>
            </div>

            <div className="p-6 bg-slate-900 bg-opacity-40 border border-cyan-500 border-opacity-30 rounded-lg hover:border-opacity-60 hover:bg-opacity-60 transition-all backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg border border-cyan-500 border-opacity-40">
                  <Linkedin className="text-cyan-400" size={24} />
                </div>
                <h3 className="font-bold text-white">Social</h3>
              </div>
              <div className="flex gap-3">
                <a
                  href={SITE_META.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                >
                  <Linkedin size={18} />
                  LinkedIn
                </a>
                <a
                  href={SITE_META.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                >
                  <Github size={18} />
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto p-8 bg-slate-900 bg-opacity-40 border border-cyan-500 border-opacity-30 rounded-lg backdrop-blur-sm hover:border-opacity-60 transition-all">
            <h3 className="text-2xl font-bold text-white mb-6">Send me a message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-800 border border-cyan-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="What is this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-lg hover:bg-opacity-40 transition-all font-semibold flex items-center justify-center gap-2 border border-cyan-500 border-opacity-40 hover:border-opacity-60"
              >
                <Send size={20} />
                Send Message
              </button>

              {submitted && (
                <div className="p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-40 text-green-300 rounded-lg">
                  ✓ Message sent! Your default email client will open.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
