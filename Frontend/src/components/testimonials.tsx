"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aryan Mehta",
    role: "SDE @ Google",
    avatar: "AM",
    avatarColor: "#6366f1",
    review:
      "Codingkul's structured roadmap was a game changer. I went from struggling with arrays to solving hard DP problems in 3 months. Got my Google offer in 4 months flat.",
    company: "Google",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "SDE-2 @ Amazon",
    avatar: "PS",
    avatarColor: "#f59e0b",
    review:
      "The live contests kept me consistent and competitive. The editorial explanations are top-notch — better than anything else I've found online.",
    company: "Amazon",
    rating: 5,
  },
  {
    name: "Rahul Gupta",
    role: "SDE @ Microsoft",
    avatar: "RG",
    avatarColor: "#10b981",
    review:
      "Placement mentorship here is unreal. Mock interviews with actual FAANG engineers, resume reviews, and offer negotiation help. Landed Microsoft at 40 LPA.",
    company: "Microsoft",
    rating: 5,
  },
  {
    name: "Sneha Joshi",
    role: "SDE @ Flipkart",
    avatar: "SJ",
    avatarColor: "#a855f7",
    review:
      "I had zero DSA foundation. The beginner roadmap is incredibly well paced. Never felt overwhelmed. Cleared Flipkart in my first ever attempt.",
    company: "Flipkart",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "SDE @ Uber",
    avatar: "VS",
    avatarColor: "#22d3ee",
    review:
      "The analytics dashboard showed exactly where I was weak. Focused my last 2 weeks on graphs and cleared every interview round. Best investment I made.",
    company: "Uber",
    rating: 5,
  },
  {
    name: "Meera Patel",
    role: "SDE @ Razorpay",
    avatar: "MP",
    avatarColor: "#ec4899",
    review:
      "The community and doubt solving is incredible. Never waited more than 15 minutes for a clear answer. It feels like having a senior engineer on call 24/7.",
    company: "Razorpay",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
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
              background: "rgba(236,72,153,0.1)",
              border: "1px solid rgba(236,72,153,0.25)",
              color: "#f9a8d4",
            }}
          >
            Student Stories
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            5,000+ placements and counting
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Real students. Real companies. Real results.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  `${t.avatarColor}40`;
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 30px ${t.avatarColor}15`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <Stars count={t.rating} />

              <p className="text-sm leading-relaxed flex-1" style={{ color: "#aaaacc" }}>
                &ldquo;{t.review}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `${t.avatarColor}30`, border: `1px solid ${t.avatarColor}40` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px]" style={{ color: "#8888aa" }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
