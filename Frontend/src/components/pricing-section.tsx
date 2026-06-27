"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Star, Flame, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const PLANS = [
  {
    slug: "foundation",
    name: "DSA Foundation Program",
    shortName: "Foundation",
    price: 4999,
    badge: null,
    highlight: false,
    target: "Students in 1st or 2nd year who want to build strong DSA fundamentals.",
    features: [
      "Regular Live DSA Classes",
      "250+ Hours Content",
      "Complete DSA Sheet",
      "Weekly Assignments",
      "Topic-wise Practice Sets",
      "Private Student Community",
      "Structured Learning Roadmap",
      "Progress Tracking Dashboard",
      "Performance Reports",
    ],
    validity: "6 Months Live · 1 Year Platform Access",
    outcome: "Build strong DSA fundamentals and problem-solving skills.",
    color: "#22c55e",
    border: "rgba(34,197,94,0.25)",
    glow: "rgba(34,197,94,0.06)",
    btn: "linear-gradient(135deg, #15803d, #166534)",
    cta: "Enroll Now",
  },
  {
    slug: "accelerator",
    name: "DSA Accelerator Program",
    shortName: "Accelerator",
    price: 6999,
    badge: "MOST POPULAR",
    highlight: true,
    target: "Students who want serious practice and continuous guidance to master DSA.",
    features: [
      "Everything in Foundation Program",
      "Homework Discussion Classes",
      "Weekly Contest Discussions",
      "Ranked Contests",
      "Personal Mentor Assignment",
      "Problem Solving Marathon Classes",
      "Monthly One-on-One Reviews",
    ],
    validity: "6 Months Live · 1 Year Platform Access",
    outcome: "Solve 750+ Interview-ready problems with mentorship.",
    color: "#eab308",
    border: "rgba(234,179,8,0.4)",
    glow: "rgba(234,179,8,0.08)",
    btn: "linear-gradient(135deg, #854d0e, #b45309)",
    cta: "Start Accelerating",
  },
  {
    slug: "placement",
    name: "Placement Mastery Program",
    shortName: "Placement",
    price: 9999,
    badge: "PREMIUM",
    highlight: false,
    target: "Students preparing for internships and placements within 1 year.",
    features: [
      "Everything in Accelerator Program",
      "Full Platform Access",
      "OS, DBMS, CN, OOPs Classes",
      "SQL Interview Prep",
      "Mock Interviews",
      "Resume & LinkedIn Optimization",
      "One-on-One Mentorship",
      "Internship Guidance",
      "OffCampus Jobs Group Access",
    ],
    validity: "1 Year Access · Extendable by 2 Months",
    outcome: "Become fully placement-ready for top tech companies.",
    color: "#a855f7",
    border: "rgba(168,85,247,0.3)",
    glow: "rgba(168,85,247,0.07)",
    btn: "linear-gradient(135deg, #7c3aed, #9333ea)",
    cta: "Become Placement Ready",
  },
];

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();

  const handleCTA = (slug: string) => {
    if (user) {
      router.push(`/courses/${slug}`);
    } else {
      router.push("/signup");
    }
  };

  const handleViewCourse = (slug: string) => {
    if (user) {
      router.push(`/courses/${slug}`);
    } else {
      router.push("/login");
    }
  };

  return (
    <section id="pricing" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Learning Platform
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Courses
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Structured programs designed to take students from beginner to placement-ready.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: plan.highlight ? -6 : -3, transition: { duration: 0.2 } }}
              className="relative flex flex-col rounded-2xl"
              style={{
                marginTop: plan.badge ? "16px" : "0",
                background: plan.highlight
                  ? "linear-gradient(160deg, rgba(14,14,30,0.95), rgba(10,10,22,0.98))"
                  : "rgba(255,255,255,0.02)",
                border: `1px solid ${plan.border}`,
                boxShadow: plan.highlight
                  ? `0 0 50px ${plan.glow}, 0 4px 30px rgba(0,0,0,0.6)`
                  : `0 0 20px ${plan.glow}`,
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                  style={{
                    top: "-14px",
                    background: "#0d0d20",
                    border: `1px solid ${plan.color}`,
                    color: plan.color,
                  }}
                >
                  {plan.badge === "MOST POPULAR" && <Star className="w-3 h-3 fill-current" />}
                  {plan.badge === "PREMIUM" && <Flame className="w-3 h-3" />}
                  {plan.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1 gap-5">
                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#8888aa" }}>
                    {plan.target}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold" style={{ color: plan.color }}>
                    ₹{plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm" style={{ color: "#8888aa" }}>one-time</span>
                </div>

                {/* Divider */}
                <div
                  className="h-px"
                  style={{
                    background: plan.highlight
                      ? `linear-gradient(90deg, transparent, ${plan.border}, transparent)`
                      : "rgba(255,255,255,0.06)",
                  }}
                />

                {/* Features */}
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: plan.color }}
                      />
                      <span style={{ color: plan.highlight ? "#d4d4f0" : "#aaaacc" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Validity */}
                <p className="text-xs" style={{ color: "#555577" }}>
                  {plan.validity}
                </p>

                {/* Outcome */}
                <p className="text-sm font-medium" style={{ color: plan.color }}>
                  {plan.outcome}
                </p>

                {/* CTAs */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleCTA(plan.slug)}
                    className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    style={{
                      background: plan.btn,
                      boxShadow: plan.highlight ? `0 0 20px ${plan.glow}` : "none",
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleViewCourse(plan.slug)}
                    className="w-full h-10 rounded-xl text-sm font-medium transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                    style={{ border: "1px solid rgba(255,255,255,0.09)", color: "#8888aa" }}
                  >
                    View Course
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-10"
          style={{ color: "#555577" }}
        >
          One-time payment · Lifetime access · No hidden fees
        </motion.p>
      </div>
    </section>
  );
}
