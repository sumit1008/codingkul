"use client";

import { useCallback, useRef } from "react";
import api from "@/lib/api";
import type { CourseTier } from "@/types/course";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
}

export interface InitiatePaymentParams {
  tier: Exclude<CourseTier, "NONE">;
  amount: number; // in ₹ (rupees, not paise)
  userName: string;
  userEmail: string;
  accentColor?: string;
  couponCode?: string;
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)) {
      resolve(typeof window.Razorpay === "function");
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const busy = useRef(false);

  const initiatePayment = useCallback(
    async ({ tier, amount, userName, userEmail, accentColor = "#7c3aed", couponCode }: InitiatePaymentParams): Promise<PaymentResult> => {
      if (busy.current) return { success: false, error: "Payment already in progress" };
      busy.current = true;

      try {
        const loaded = await loadScript();
        if (!loaded || typeof window.Razorpay !== "function") {
          return { success: false, error: "Payment gateway failed to load. Check your internet connection." };
        }

        let orderData: { order_id: string; amount: number; currency: string };
        try {
          const res = await api.post<{ success: boolean; data: typeof orderData }>("/payment/create-order", {
            tier,
            ...(couponCode ? { couponCode } : {}),
          });
          if (!res.data.success) return { success: false, error: "Failed to create payment order" };
          orderData = res.data.data;
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          return { success: false, error: msg || "Failed to create payment order" };
        }

        return new Promise<PaymentResult>((resolve) => {
          let settled = false;
          const settle = (result: PaymentResult) => {
            if (!settled) {
              settled = true;
              resolve(result);
            }
          };

          const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.order_id,
            name: "CodingKul",
            description: `${tier.charAt(0) + tier.slice(1).toLowerCase()} Program`,
            prefill: { name: userName, email: userEmail },
            theme: { color: accentColor },
            handler: async (response) => {
              try {
                const verifyRes = await api.post<{ success: boolean; data: { message: string } }>(
                  "/payment/verify",
                  { ...response, tier }
                );
                settle(
                  verifyRes.data.success
                    ? { success: true }
                    : { success: false, error: "Payment verification failed. Please contact support." }
                );
              } catch {
                settle({ success: false, error: "Payment verification failed. Please contact support." });
              }
            },
            modal: {
              ondismiss: () => settle({ success: false, error: "cancelled" }),
            },
          });

          rzp.open();
        });
      } finally {
        busy.current = false;
      }
    },
    []
  );

  return { initiatePayment };
}
