import CouponTable from "@/components/coupons/CouponTable";
import PageHeader from "@/components/shared/PageHeader";

export default function ExpiredCouponsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Expired Coupons"
        description="Permanent audit record of coupons that have reached their expiry date or usage limit"
        backHref="/dashboard/coupons"
      />
      <CouponTable forceStatus="expired" />
    </div>
  );
}
