"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Jai Prakash",
    role: "SDE @ Formcept",
    avatar: "JP",
    avatarColor: "#6366f1",
    review:
      "My DSA journey at CodingKul Academy played a major role in shaping my problem-solving skills and interview confidence. The structured roadmap, regular coding practice, and concept-focused teaching helped me strengthen my fundamentals and approach technical interviews more confidently. The mentorship and disciplined environment made a huge difference in my preparation.",
    company: "Formcept",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/jay-prakash17423/",
  },
  {
    name: "Yash Arya",
    role: "SDE @ Fastenal",
    avatar: "YA",
    avatarColor: "#f59e0b",
    review:
      "CodingKul Academy provided me with a strong foundation in Data Structures & Algorithms through a very well-structured curriculum. What stood out most was the interview-focused preparation, regular practice sessions, and consistent guidance throughout the journey. The academy helped me improve my coding skills and build confidence for placements.",
    company: "Fastenal",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/yasharya007/",
  },
  {
    name: "Prem Roshan",
    role: "SRE @ Texas Instruments",
    avatar: "PR",
    avatarColor: "#10b981",
    review:
      "Studying DSA at CodingKul Academy significantly improved my analytical thinking and coding ability. The step-by-step approach to concepts, carefully designed problem sheets, and continuous practice sessions made learning much more effective. The guidance I received helped me approach technical interviews with confidence and clarity.",
    company: "Texas Instruments",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/jay-prakash17423/",
  },
  {
    name: "Vishal Devasis",
    role: "SRE @ Texas Instruments",
    avatar: "VD",
    avatarColor: "#a855f7",
    review:
      "CodingKul Academy made DSA learning structured, practical, and engaging. The topic-wise roadmap, doubt support, and consistent coding practice helped me build strong fundamentals in problem-solving. The interview preparation approach and focus on concept clarity were extremely valuable in my placement journey.",
    company: "Texas Instruments",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/vishaldevasics/",
  },
  {
    name: "Nitesh Kumar",
    role: "SDE @ Mphasis",
    avatar: "NK",
    avatarColor: "#22d3ee",
    review:
      "My experience with CodingKul Academy was excellent. The academy focuses not only on solving problems but also on building strong logical thinking and coding fundamentals. Regular practice, mentorship, and placement-oriented preparation helped me improve tremendously and feel prepared for real technical interviews.",
    company: "Mphasis",
    rating: 5,
    linkedin: "https://www.linkedin.com/in/nitesh0017/",
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
            2,000+ placements and counting
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8888aa" }}>
            Real students. Real companies. Real results.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="flex flex-wrap justify-center gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300"
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
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-[11px]" style={{ color: "#8888aa" }}>
                    {t.role}
                  </div>
                </div>
                <a
                  href={t.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-1.5 rounded-lg transition-colors duration-200"
                  style={{ color: "#8888aa" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#0a66c2";
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(10,102,194,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
