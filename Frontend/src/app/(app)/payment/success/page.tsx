"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, ArrowRight, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const PRODUCT_NAMES: Record<string, string> = {
  foundation:  "DSA Foundation Program",
  accelerator: "DSA Accelerator Program",
  placement:   "Placement Mastery Program",
};

function PaymentSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { refreshUser } = useAuth();
  const productId = params.get("product") || "";
  const productName = PRODUCT_NAMES[productId] || "Your Course";

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #080818 0%, #0d0a1f 50%, #080818 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-white mb-3">Enrollment Successful!</h1>
          <p className="text-base mb-8" style={{ color: "#8888aa" }}>
            You now have full access to <span className="text-white font-semibold">{productName}</span>.
          </p>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 mb-8 text-left"
          style={{
            background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-white">What&apos;s now unlocked</span>
          </div>
          {[
            "Live classes and recorded sessions",
            "Complete DSA sheet access",
            "Weekly assignments and homework",
            "Private student community",
            "Progress tracking dashboard",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-sm" style={{ color: "#aaaacc" }}>{item}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => router.push("/courses")}
            className="w-full h-12 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 0 24px rgba(99,102,241,0.4)",
            }}
          >
            Go to My Courses
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push("/my-purchases")}
            className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8888aa" }}
          >
            <Package className="w-4 h-4" />
            View My Purchases
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
