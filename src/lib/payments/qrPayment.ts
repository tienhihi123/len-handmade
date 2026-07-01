// Real bank-transfer / MoMo QR codes built from public, keyless image APIs.
// Bank account details come from .env (VITE_BANK_*), never hardcoded, and are
// safe to leave unset — the UI simply shows a "chưa cấu hình" notice instead.

export interface BankQrInfo {
  bin: string;
  accountNo: string;
  accountName: string;
}

export function getBankQrInfo(): BankQrInfo | null {
  const bin = import.meta.env.VITE_BANK_BIN;
  const accountNo = import.meta.env.VITE_BANK_ACCOUNT_NO;
  const accountName = import.meta.env.VITE_BANK_ACCOUNT_NAME;
  if (!bin || !accountNo || !accountName) return null;
  return { bin, accountNo, accountName };
}

export function getMomoPhone(): string | null {
  return import.meta.env.VITE_MOMO_PHONE || null;
}

// https://img.vietqr.io — public quick-link image API, no API key required.
export function buildVietQrImageUrl(amount: number, addInfo: string): string | null {
  const bank = getBankQrInfo();
  if (!bank) return null;
  const params = new URLSearchParams({
    amount: String(Math.max(0, Math.round(amount))),
    addInfo,
    accountName: bank.accountName
  });
  return `https://img.vietqr.io/image/${bank.bin}-${bank.accountNo}-compact2.png?${params.toString()}`;
}

// MoMo has no keyless "generate QR" image API for personal transfers, so we
// render a QR that encodes the me.momo.vn deep link via a generic QR image
// renderer — scanning it with any QR reader opens the MoMo transfer page.
export function buildMomoQrImageUrl(): string | null {
  const phone = getMomoPhone();
  if (!phone) return null;
  const momoLink = `https://me.momo.vn/${phone}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(momoLink)}`;
}
