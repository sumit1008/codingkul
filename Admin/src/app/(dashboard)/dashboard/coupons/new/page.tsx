import CouponForm from "@/components/coupons/CouponForm";
import PageHeader from "@/components/shared/PageHeader";

export default function NewCouponPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="New Coupon"
        description="Create a discount coupon for course purchases"
        backHref="/dashboard/coupons"
      />
      <CouponForm />
    </div>
  );
}
