import { onRequest } from "firebase-functions/v2/https";

// Scaffolding only — not deployed yet. These stubs exist so the payment
// gateway structure (see src/lib/payments/*.ts in the main app) has a real
// server-side counterpart ready to fill in once:
//   1. The Firebase project is upgraded to the Blaze plan.
//   2. Real merchant credentials (VNPay TMN code + hash secret, MoMo
//      partner/access keys, Stripe secret key) are available as Function
//      config / secrets — never commit them to this repo.

export const verifyVnpayReturn = onRequest((req, res) => {
  // TODO: validate the VNPay return/IPN signature using the hash secret,
  // then mark the matching order as paid in Firestore.
  res.status(501).json({ error: "VNPay integration not implemented yet." });
});

export const verifyMomoIpn = onRequest((req, res) => {
  // TODO: validate the MoMo IPN signature using the partner secret key,
  // then mark the matching order as paid in Firestore.
  res.status(501).json({ error: "MoMo Payment API integration not implemented yet." });
});

export const createStripeIntent = onRequest((req, res) => {
  // TODO: create a Stripe Checkout Session using the secret key and
  // return its redirect URL to the client.
  res.status(501).json({ error: "Stripe integration not implemented yet." });
});

// Staff/Admin Control Panel privileged operations — see admin.ts header
// comment. Not deployed yet; re-exported here so `npm run deploy` will
// pick them up once the project is confirmed on Blaze.
export {
  assignRole,
  updateStaffStatus,
  processRefund,
  adjustPoints,
  adjustInventory,
  updatePaymentStatus,
  exportSensitiveData
} from "./admin";
