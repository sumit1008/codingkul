"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { MARQUEE_TRACK } from "@/constants/placed-at";

const MARQUEE_CSS = `
  @keyframes marquee-scroll {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-50%, 0, 0); }
  }
  .marquee-track {
    will-change: transform;
    animation: marquee-scroll 44s linear infinite;
  }
  .marquee-wrapper:hover .marquee-track {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .marquee-track { animation: none; transform: translate3d(0,0,0); }
  }
`;

const STATS = [
  { value: "5K+",  label: "Students Trained"  },
  { value: "2K+",  label: "Placed"             },
  { value: "10+",  label: "Hiring Companies"   },
];

interface LogoItemProps { name: string; file: string; }

const LogoItem = memo(function LogoItem({ name, file }: LogoItemProps) {
  const [err, setErr] = useState(false);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.borderColor = "rgba(255,255,255,0.14)";
    el.style.background  = "rgba(255,255,255,0.05)";
    el.style.boxShadow   = "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)";
    el.style.transform   = "scale(1.08) translateY(-3px)";
    const img = el.querySelector("img") as HTMLImageElement | null;
    if (img) img.style.filter = "saturate(100%) opacity(1)";
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.borderColor = "rgba(255,255,255,0.07)";
    el.style.background  = "rgba(255,255,255,0.025)";
    el.style.boxShadow   = "none";
    el.style.transform   = "scale(1) translateY(0)";
    const img = el.querySelector("img") as HTMLImageElement | null;
    if (img) img.style.filter = "saturate(75%) opacity(0.68)";
  };

  return (
    <div
      className="flex items-center justify-center mx-5 px-6 py-4 rounded-2xl shrink-0 cursor-default transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/companies/${file}`}
          alt={name}
          loading="lazy"
          decoding="async"
          width={180}
          height={64}
          onError={() => setErr(true)}
          className="h-14 md:h-20 w-auto object-contain rounded-lg transition-all duration-300"
          style={{ filter: "saturate(75%) opacity(0.68)" }}
        />
      ) : (
        <span
          className="text-base font-semibold whitespace-nowrap"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {name}
        </span>
      )}
    </div>
  );
});

export default function PlacedAt() {
  return (
    <section className="relative z-10 py-28 overflow-hidden">
      <style>{MARQUEE_CSS}</style>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 55%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Badge + Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#a5b4fc",
            }}
          >
            Alumni Network
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase mb-5"
            style={{ letterSpacing: "0.1em" }}
          >
            Our Students Are Placed At
          </h2>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#8888aa" }}
          >
            Students from CodingKul Academy are currently working at leading
            product and service-based companies.
          </p>
        </motion.div>

        {/* Stat row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-center gap-0 mb-14"
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="px-8 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
                <div className="text-xs md:text-sm mt-1" style={{ color: "#8888aa" }}>
                  {s.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div
                  className="h-8 w-px"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Thin divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-14 mx-auto"
          style={{
            height: "1px",
            maxWidth: "480px",
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)",
          }}
        />
      </div>

      {/* Logo marquee — full bleed, no max-width */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="marquee-wrapper overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
        }}
      >
        <div className="marquee-track flex items-center w-max py-4">
          {MARQUEE_TRACK.map((c, i) => (
            <LogoItem key={`${c.file}-${i}`} name={c.name} file={c.file} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
