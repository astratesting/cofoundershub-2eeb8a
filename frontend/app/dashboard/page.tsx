import { currentUser } from "@clerk/nextjs/server";
import {
  Users,
  MessageSquare,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "New Matches", value: "12", change: "+4 this week", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  { label: "Match Score", value: "94%", change: "Top 5% of profiles", icon: Sparkles, color: "text-brand-600", bg: "bg-brand-50" },
  { label: "Active Conversations", value: "3", change: "2 awaiting reply", icon: MessageSquare, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Profile Views", value: "48", change: "+18 vs last week", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const recentMatches = [
  {
    name: "Ava Torres",
    role: "Product Designer → Co-Founder",
    skills: ["UI/UX", "Product Strategy", "B2C"],
    score: 97,
    avatar: "AT",
    color: "from-pink-400 to-rose-500",
    online: true,
    mutualInterest: "SaaS, HealthTech",
    time: "2h ago",
  },
  {
    name: "Raj Patel",
    role: "ML Engineer → Co-Founder",
    skills: ["Python", "LLMs", "MLOps", "B2B SaaS"],
    score: 93,
    avatar: "RP",
    color: "from-blue-400 to-brand-600",
    online: false,
    mutualInterest: "AI/ML, Developer Tools",
    time: "5h ago",
  },
  {
    name: "Clara Hoffmann",
    role: "Sales Director → Co-Founder",
    skills: ["Enterprise Sales", "GTM", "Fundraising"],
    score: 91,
    avatar: "CH",
    color: "from-violet-400 to-purple-600",
    online: true,
    mutualInterest: "B2B SaaS, FinTech",
    time: "1d ago",
  },
];

const recentMessages = [
  { from: "Ava Torres", preview: "Would love to hop on a call this week to discuss our vision alignment...", time: "1h ago", unread: true },
  { from: "Raj Patel", preview: "Shared our GitHub — take a look at the prototype I built for the ML pipeline", time: "3h ago", unread: true },
  { from: "Clara Hoffmann", preview: "I've seen similar problems in enterprise. Let me share a deck I made...", time: "1d ago", unread: false },
];

const profileTasks = [
  { label: "Connect GitHub account", done: true },
  { label: "Add your startup idea", done: true },
  { label: "Complete skills assessment", done: false },
  { label: "Set availability preferences", done: false },
  { label: "Upload pitch deck (optional)", done: false },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "Founder";
  const profileComplete = Math.round((profileTasks.filter((t) => t.done).length / profileTasks.length) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Your AI matching engine has found <span className="font-semibold text-brand-600">12 new potential co-founders</span> since your last visit.
          </p>
        </div>
        <Link
          href="/dashboard/discover"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity text-sm shadow-lg shadow-brand-500/20"
        >
          <Zap className="w-4 h-4" />
          View All Matches
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{s.label}</span>
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Top Matches for You</h2>
              <p className="text-xs text-gray-500 mt-0.5">Ranked by AI compatibility score</p>
            </div>
            <Link href="/dashboard/matches" className="text-xs text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentMatches.map((m) => (
              <div key={m.name} className="p-5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                      {m.avatar}
                    </div>
                    {m.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{m.name}</h3>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-500" />
                        <span className="text-xs font-bold text-brand-600">{m.score}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{m.role}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {m.skills.map((sk) => (
                        <span key={sk} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{sk}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Mutual interest: <span className="text-gray-600">{m.mutualInterest}</span></p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">{m.time}</span>
                    <Link
                      href="/dashboard/messages"
                      className="text-xs px-3 py-1.5 bg-brand-50 text-brand-700 font-medium rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      Message
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Profile completeness */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Profile Strength</h3>
            <p className="text-xs text-gray-500 mb-3">Better profiles get 3× more matches</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all"
                  style={{ width: `${profileComplete}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">{profileComplete}%</span>
            </div>
            <div className="space-y-2">
              {profileTasks.map((task) => (
                <div key={task.label} className="flex items-center gap-2.5 text-xs">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${task.done ? "text-emerald-500" : "text-gray-300"}`} />
                  <span className={task.done ? "text-gray-500 line-through" : "text-gray-700"}>{task.label}</span>
                </div>
              ))}
            </div>
            {profileComplete < 100 && (
              <Link
                href="/dashboard/settings"
                className="mt-4 w-full flex justify-center py-2 bg-brand-50 text-brand-700 text-xs font-medium rounded-lg hover:bg-brand-100 transition-colors"
              >
                Complete profile
              </Link>
            )}
          </div>

          {/* Recent messages */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm">Recent Messages</h3>
              <Link href="/dashboard/messages" className="text-xs text-brand-600 hover:text-brand-700">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentMessages.map((msg) => (
                <div key={msg.from} className="p-4 hover:bg-gray-50/50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${msg.unread ? "text-gray-900" : "text-gray-600"}`}>{msg.from}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400">{msg.time}</span>
                      {msg.unread && <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{msg.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Tip */}
          <div className="bg-gradient-to-br from-brand-600 to-violet-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">AI Insight</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Founders who respond within 24 hours are <strong>4× more likely</strong> to schedule a co-founder call. You have 2 messages waiting.
            </p>
            <Link
              href="/dashboard/messages"
              className="mt-3 flex items-center gap-1 text-xs font-medium text-white/80 hover:text-white transition-colors"
            >
              Reply now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { icon: Heart, color: "text-rose-500 bg-rose-50", text: "Ava Torres liked your profile", time: "2 hours ago" },
            { icon: Sparkles, color: "text-brand-600 bg-brand-50", text: "AI found 4 new high-compatibility matches for you", time: "5 hours ago" },
            { icon: MessageSquare, color: "text-violet-600 bg-violet-50", text: "Raj Patel sent you a message", time: "3 hours ago" },
            { icon: Users, color: "text-emerald-600 bg-emerald-50", text: "Your profile was viewed by 6 founders today", time: "Today" },
            { icon: Clock, color: "text-amber-600 bg-amber-50", text: "Reminder: Follow up with Clara Hoffmann from yesterday", time: "1 day ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-9 h-9 rounded-xl ${item.color.split(" ")[1]} flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`w-4 h-4 ${item.color.split(" ")[0]}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
