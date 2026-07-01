import { PaymentGateway, PaymentIntentResult, PaymentOrderInput } from "./PaymentGateway";

// Real VNPay checkout requires a signed request built server-side (Cloud
// Function, see functions/src/index.ts::verifyVnpayReturn) with the secret
// hash key — never expose it client-side. This stays "unavailable" until
// that Function is deployed and VITE_VNPAY_TMN_CODE is set.
export const vnpayGateway: PaymentGateway = {
  id: "vnpay",
  label: "VNPay",
  isConfigured() {
    return !!import.meta.env.VITE_VNPAY_TMN_CODE;
  },
  async createPaymentIntent(_order: PaymentOrderInput): Promise<PaymentIntentResult> {
    if (!this.isConfigured()) {
      return { status: "unavailable", message: "VNPay chưa được cấu hình merchant." };
    }
    return { status: "unavailable", message: "Cổng VNPay sắp ra mắt — cần Cloud Function ký giao dịch." };
  }
};
