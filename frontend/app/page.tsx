import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />

        {/* Social Proof */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-widest mb-10">
              Trusted by founders from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
              {["Y Combinator", "Techstars", "500 Global", "a16z", "Sequoia", "First Round"].map((name) => (
                <span key={name} className="text-xl font-bold text-gray-700 font-display">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Founders who found each other here
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Over 500 startups have been co-founded through CoFoundersHub in the last 18 months.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I was a solo technical founder for 2 years. CoFoundersHub matched me with Sarah in 3 days — she brought the sales DNA I was missing. We closed our seed round 6 months later.",
                name: "Marcus Chen",
                role: "CTO & Co-Founder, Fluxify",
                avatar: "MC",
                color: "from-brand-500 to-violet-600",
              },
              {
                quote: "The AI matching is genuinely good. It didn't just look at skills — it asked about work style, ambition level, and risk tolerance. My co-founder and I are eerily aligned.",
                name: "Priya Nair",
                role: "CEO & Co-Founder, Petal Health",
                avatar: "PN",
                color: "from-violet-500 to-pink-500",
              },
              {
                quote: "We were introduced through CoFoundersHub, had our first call that week, and shipped our MVP 6 weeks later. The built-in chat made collaborating before committing feel natural.",
                name: "James Okafor",
                role: "Co-Founder, BuildStack",
                avatar: "JO",
                color: "from-emerald-500 to-brand-500",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-brand-600 to-violet-700">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Your co-founder is out there.
            </h2>
            <p className="text-brand-100 text-lg mb-10">
              Join 12,000+ founders already on CoFoundersHub. Get your first AI-curated matches free — no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
              >
                Start matching for free
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                See how it works
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-white font-bold">CoFoundersHub</span>
              </div>
              <p className="text-sm leading-relaxed">
                The AI-powered platform for founders who refuse to build alone.
              </p>
            </div>
            {[
              { title: "Product", links: ["How it works", "Pricing", "AI Matching", "Success Stories"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 CoFoundersHub. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
