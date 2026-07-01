export interface PaymentIntentResult {
  status: "pending" | "unavailable";
  redirectUrl?: string;
  message: string;
}

export interface PaymentOrderInput {
  orderCode: string;
  amount: number;
}

export interface PaymentGateway {
  id: "vnpay" | "momo_api" | "stripe";
  label: string;
  isConfigured(): boolean;
  createPaymentIntent(order: PaymentOrderInput): Promise<PaymentIntentResult>;
}
