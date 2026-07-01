import { PaymentGateway } from "./PaymentGateway";
import { vnpayGateway } from "./vnpayGateway";
import { momoApiGateway } from "./momoApiGateway";
import { stripeGateway } from "./stripeGateway";

export const paymentGateways: PaymentGateway[] = [vnpayGateway, momoApiGateway, stripeGateway];

export function resolveGateway(id: PaymentGateway["id"]): PaymentGateway | undefined {
  return paymentGateways.find((gateway) => gateway.id === id);
}

export * from "./PaymentGateway";
export * from "./qrPayment";
