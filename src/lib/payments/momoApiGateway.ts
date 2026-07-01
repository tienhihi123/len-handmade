import { PaymentGateway, PaymentIntentResult, PaymentOrderInput } from "./PaymentGateway";

// The MoMo Payment API (as opposed to the personal-transfer QR in
// qrPayment.ts) requires a signed request server-side (Cloud Function, see
// functions/src/index.ts::verifyMomoIpn) with the partner secret key.
export const momoApiGateway: PaymentGateway = {
  id: "momo_api",
  label: "MoMo (cổng thanh toán)",
  isConfigured() {
    return !!import.meta.env.VITE_MOMO_PARTNER_CODE;
  },
  async createPaymentIntent(_order: PaymentOrderInput): Promise<PaymentIntentResult> {
    if (!this.isConfigured()) {
      return { status: "unavailable", message: "MoMo Payment API chưa được cấu hình merchant." };
    }
    return { status: "unavailable", message: "Cổng MoMo Payment API sắp ra mắt — cần Cloud Function ký giao dịch." };
  }
};
