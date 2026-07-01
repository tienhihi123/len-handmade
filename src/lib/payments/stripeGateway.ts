import { PaymentGateway, PaymentIntentResult, PaymentOrderInput } from "./PaymentGateway";

// Real Stripe Checkout requires a server-created Checkout Session (Cloud
// Function, see functions/src/index.ts::createStripeIntent) using the
// secret key — never expose it client-side.
export const stripeGateway: PaymentGateway = {
  id: "stripe",
  label: "Stripe (thẻ quốc tế)",
  isConfigured() {
    return !!import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  },
  async createPaymentIntent(_order: PaymentOrderInput): Promise<PaymentIntentResult> {
    if (!this.isConfigured()) {
      return { status: "unavailable", message: "Stripe chưa được cấu hình merchant." };
    }
    return { status: "unavailable", message: "Cổng Stripe sắp ra mắt — cần Cloud Function tạo Checkout Session." };
  }
};
