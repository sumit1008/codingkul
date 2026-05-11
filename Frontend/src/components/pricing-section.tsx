"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

const PLANS = [
  {
    name: "Beginner",
    price: "Free",
    period: "",
    description: "Get started with fundamentals and explore the roadmap.",
    highlight: false,
    badge: null,
    features: [
      "150 free problems",
      "Basic DSA roadmap",
      "Community access",
      "2 practice contests/month",
      "Progress tracking",
    ],
    cta: "Start Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/month",
    description: "Full DSA sheet, live classes, and placement prep.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "All 450+ problems",
      "Live weekly classes",
      "Unlimited contests",
      "Video editorials",
      "Homework tracking",
      "Mock interviews — 5/month",
      "Resume review",
    ],
    cta: "Start Pro",
    ctaVariant: "default" as const,
  },
  {
    name: "Ultimate",
    price: "₹2,499",
    period: "/month",
    description: "1-on-1 mentorship until you get placed.",
    highlight: false,
    badge: null,
    features: [
      "Everything in Pro",
      "Unlimited mock interviews",
      "Dedicated mentor",
      "Company-specific prep",
      "Offer negotiation help",
      "Placement guarantee*",
      "Priority support",
    ],
    cta: "Get Placed",
    ctaVariant: "outline" as const,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            Transparent Pricing
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Simple, no-surprise pricing
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Choose the plan that matches your ambition. Upgrade or cancel anytime.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: plan.highlight ? -4 : -2, transition: { duration: 0.2 } }}
              className="relative rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: plan.highlight
                  ? "linear-gradient(145deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))"
                  : "rgba(255,255,255,0.02)",
                border: plan.highlight
                  ? "1px solid rgba(99,102,241,0.4)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: plan.highlight
                  ? "0 0 60px rgba(99,102,241,0.15), 0 0 120px rgba(99,102,241,0.05)"
                  : "none",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    boxShadow: "0 0 20px rgba(99,102,241,0.5)",
                  }}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div>
                <div
                  className="text-xs font-semibold mb-3"
                  style={{ color: plan.highlight ? "#a5b4fc" : "#8888aa" }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: "#8888aa" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: "#8888aa" }}>
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div
                className="h-px"
                style={{
                  background: plan.highlight
                    ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)"
                    : "rgba(255,255,255,0.06)",
                }}
              />

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: plan.highlight ? "#a5b4fc" : "#8888aa" }}
                    />
                    <span style={{ color: plan.highlight ? "#d4d4f0" : "#aaaacc" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className="w-full h-10 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
                style={
                  plan.highlight
                    ? {
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                        color: "#fff",
                        border: "none",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#e8e8f0",
                      }
                }
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-8"
          style={{ color: "#8888aa" }}
        >
          *Placement guarantee applies to Pro members who complete 80% of the roadmap. Terms apply.
        </motion.p>
      </div>
    </section>
  );
}
