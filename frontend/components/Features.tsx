import {
  Sparkles,
  MessageSquare,
  Users,
  Brain,
  ShieldCheck,
  BarChart3,
  Github,
  ChromeIcon,
  Zap,
  Target,
} from "lucide-react";

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Compatibility Engine",
    description:
      "Our matching algorithm goes far beyond skills. It analyzes work style, ambition level, risk tolerance, domain expertise, and vision alignment to produce a scored compatibility report for every potential match.",
    badge: "Core Feature",
    color: "text-brand-600",
    bg: "bg-brand-50",
    highlights: ["97% match accuracy", "8 compatibility dimensions", "Learns from your preferences"],
  },
  {
    icon: MessageSquare,
    title: "Integrated Messaging & Collaboration",
    description:
      "Chat, share pitch decks, co-edit documents, and schedule calls — all inside CoFoundersHub. No Slack, no email chaos. Every conversation is contextual and tied to your match profile.",
    badge: "Communication",
    color: "text-violet-600",
    bg: "bg-violet-50",
    highlights: ["Real-time messaging", "File & deck sharing", "Video call scheduling"],
  },
  {
    icon: Users,
    title: "Verified Founder Profiles",
    description:
      "Every profile is verified via GitHub or Google OAuth. Founders link their GitHub repos, prior companies, and LinkedIn — so you know exactly who you're talking to before the first message.",
    badge: "Trust & Safety",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    highlights: ["OAuth verification", "GitHub portfolio", "Background validation"],
  },
];

const secondaryFeatures = [
  {
    icon: Sparkles,
    title: "Daily AI Match Digest",
    description: "Get a curated list of your top 5 matches every morning, ranked by real-time compatibility score.",
  },
  {
    icon: ShieldCheck,
    title: "Secure OAuth Login",
    description: "Sign in with GitHub or Google. No passwords to manage, enterprise-grade security out of the box.",
  },
  {
    icon: BarChart3,
    title: "Match Analytics Dashboard",
    description: "See who's viewing your profile, your match score trends, and conversation response rates over time.",
  },
  {
    icon: Target,
    title: "Intent-Based Filtering",
    description: "Filter by founder type (technical/business), equity expectations, time commitment, and startup stage.",
  },
  {
    icon: Zap,
    title: "Async Co-Founder Trials",
    description: "Propose a 2-week trial collaboration task before committing. Test compatibility with low stakes.",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Showcase real work. Your GitHub stats, top repos, and contribution graph are surfaced on your profile.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your founder profile",
    description: "Sign up with GitHub or Google OAuth. Tell us your background, startup idea, and what kind of co-founder you're looking for.",
    color: "from-brand-500 to-brand-600",
  },
  {
    step: "02",
    title: "AI scans for your matches",
    description: "Our engine scores every founder in the network across 8 compatibility dimensions and surfaces your top matches immediately.",
    color: "from-violet-500 to-violet-600",
  },
  {
    step: "03",
    title: "Connect and collaborate",
    description: "Message your matches, share your vision, run async co-founder trials, and build conviction before committing.",
    color: "from-brand-500 to-violet-600",
  },
  {
    step: "04",
    title: "Build together",
    description: "When it clicks, formalize your partnership. CoFoundersHub stays with you — intro to lawyers, investors, and advisors.",
    color: "from-emerald-500 to-brand-500",
  },
];

export default function Features() {
  return (
    <>
      {/* Main Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-medium rounded-full border border-brand-100 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Built for serious founders
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to find the right partner
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              CoFoundersHub isn&apos;t just a directory. It&apos;s an intelligent platform that actively works to find your perfect match and helps you validate the relationship before committing.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 ${feature.bg} ${feature.color} rounded-full`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 rounded-full ${feature.bg.replace("bg-", "bg-")} ${feature.color.replace("text-", "bg-")}`}></div>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How CoFoundersHub works</h2>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              From signup to co-founder in days, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%-12px)] w-6 h-px bg-gradient-to-r from-gray-300 to-gray-200 z-10" />
                )}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Every detail is designed for founders</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              The small things add up. Here&apos;s everything else we&apos;ve built so you can focus on building your company.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {secondaryFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-brand-100 hover:bg-brand-50/20 transition-all group"
              >
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 transition-colors">
                  <feature.icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth providers callout */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Enterprise-grade security from day one
          </h2>
          <p className="text-gray-400 mb-8">
            OAuth 2.0 with GitHub and Google. Your identity is verified, your data is encrypted, and you&apos;re never one data breach away from disaster.
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3">
              <Github className="w-6 h-6 text-white" />
              <span className="text-white font-medium">GitHub OAuth</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-6 py-3">
              <ChromeIcon className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Google OAuth</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
