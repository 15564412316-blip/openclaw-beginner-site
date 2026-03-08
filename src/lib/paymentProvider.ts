import type { PlanCode } from "@/lib/paymentPlans";

type CreatePaymentInput = {
  orderNo: string;
  amount: number;
  plan: PlanCode;
  email: string;
  channel: "wechat" | "alipay";
  baseUrl?: string;
};

type CreatePaymentResult = {
  provider: string;
  providerOrderId: string;
  payUrl: string;
};

export async function createHostedPayment(
  input: CreatePaymentInput
): Promise<CreatePaymentResult> {
  const provider = (process.env.PAYMENT_PROVIDER ?? "mock").trim();

  if (provider === "mock") {
    const baseUrl = input.baseUrl || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
    const url = new URL("/mock-pay", baseUrl);
    url.searchParams.set("orderNo", input.orderNo);
    url.searchParams.set("amount", String(input.amount));
    url.searchParams.set("plan", input.plan);
    url.searchParams.set("email", input.email);

    return {
      provider: "mock",
      providerOrderId: `MOCK-${input.orderNo}`,
      payUrl: url.toString(),
    };
  }

  // Placeholder adapter for real hosted checkout provider.
  // Implement actual API call, signature, and notify_url integration here.
  throw new Error("PAYMENT_PROVIDER not implemented yet. Please use PAYMENT_PROVIDER=mock first.");
}
