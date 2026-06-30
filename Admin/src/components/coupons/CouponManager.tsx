"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import CouponTable from "./CouponTable";

export default function CouponManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Coupons</h1>
          <p className="text-sm text-text-muted mt-0.5">Manage discount coupons for course purchases</p>
        </div>
        <Link href="/dashboard/coupons/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Coupon
        </Link>
      </div>

      <CouponTable />
    </div>
  );
}
