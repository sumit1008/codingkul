import CouponForm from "@/components/coupons/CouponForm";
import PageHeader from "@/components/shared/PageHeader";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <PageHeader
        title="Edit Coupon"
        description="Update coupon details"
        backHref={`/dashboard/coupons/${id}`}
      />
      <CouponForm couponId={id} />
    </div>
  );
}
