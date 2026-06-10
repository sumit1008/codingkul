"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, ArrowRight, CheckCircle2, Clock, Hash } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { PurchasedProduct } from "@/lib/auth-context";

const PRODUCT_META: Record<string, { name: string; color: string; badge: string }> = {
  foundation: {
    name:  "DSA Foundation Program",
    color: "#22c55e",
    badge: "Foundation",
  },
  accelerator: {
    name:  "DSA Accelerator Program",
    color: "#eab308",
    badge: "Accelerator",
  },
  placement: {
    name:  "Placement Mastery Program",
    color: "#a855f7",
    badge: "Placement",
  },
};

function PurchaseCard({ purchase }: { purchase: PurchasedProduct }) {
  const router = useRouter();
  const meta = PRODUCT_META[purchase.productId] ?? {
    name:  purchase.productId,
    color: "#6366f1",
    badge: purchase.productId,
  };

  const purchaseDate = new Date(purchase.purchasedAt).toLocaleDateString("en-IN", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(160deg, rgba(14,14,30,0.9), rgba(10,10,22,0.95))",
        border: `1px solid rgba(${meta.color === "#22c55e" ? "34,197,94" : meta.color === "#eab308" ? "234,179,8" : "168,85,247"},0.25)`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
            style={{
              background: `${meta.color}18`,
              border: `1px solid ${meta.color}40`,
              color: meta.color,
            }}
          >
            {meta.badge}
          </span>
          <h3 className="text-base font-bold text-white">{meta.name}</h3>
        </div>
        <CheckCircle2 className="w-5 h-5 mt-1 shrink-0" style={{ color: "#22c55e" }} />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#8888aa" }}>
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Purchased on {purchaseDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "#8888aa" }}>
          <Hash className="w-3.5 h-3.5 shrink-0" />
          <span className="font-mono truncate" title={purchase.orderId}>
            Order: {purchase.orderId}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push(`/courses/${purchase.productId}`)}
        className="w-full h-9 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}22)`,
          border: `1px solid ${meta.color}40`,
          color: meta.color,
        }}
      >
        Access Course <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function MyPurchasesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(99,102,241,0.3)", borderTopColor: "#6366f1" }}
        />
      </div>
    );
  }

  const purchases = user?.purchasedProducts ?? [];

  return (
    <div className="min-h-screen p-6" style={{ background: "#050510" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <Package className="w-5 h-5" style={{ color: "#a5b4fc" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Purchases</h1>
              <p className="text-sm" style={{ color: "#8888aa" }}>
                {purchases.length === 0
                  ? "No courses purchased yet"
                  : `${purchases.length} course${purchases.length > 1 ? "s" : ""} enrolled`}
              </p>
            </div>
          </div>
        </motion.div>

        {purchases.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Package className="w-12 h-12 mx-auto mb-4" style={{ color: "#333355" }} />
            <h2 className="text-lg font-semibold text-white mb-2">No purchases yet</h2>
            <p className="text-sm mb-6" style={{ color: "#8888aa" }}>
              Enroll in a course to get full access to live classes, assignments, and more.
            </p>
            <button
              onClick={() => router.push("/courses")}
              className="h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] inline-flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 0 20px rgba(99,102,241,0.35)",
              }}
            >
              Browse Courses <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {purchases.map((p) => (
              <PurchaseCard key={`${p.productId}-${p.orderId}`} purchase={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
