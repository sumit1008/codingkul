"use client";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(rgba(168,85,247,0.8) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Left ambient blue glow */}
      <div
        className="absolute -left-48 top-1/4 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.6) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Right ambient purple glow */}
      <div
        className="absolute -right-48 top-1/3 w-[700px] h-[700px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0.1) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Center hero radial glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[500px] opacity-10"
        style={{
          background:
            "radial-gradient(ellipse, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.2) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,16,0.8), transparent)",
        }}
      />
    </div>
  );
}
