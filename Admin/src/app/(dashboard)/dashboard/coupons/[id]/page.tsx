import CouponDetail from "@/components/coupons/CouponDetail";
import PageHeader from "@/components/shared/PageHeader";

export default async function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="animate-fade-in">
      <PageHeader title="Coupon Details" backHref="/dashboard/coupons" />
      <CouponDetail couponId={id} />
    </div>
  );
}
