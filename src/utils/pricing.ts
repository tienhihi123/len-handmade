import { Product, CartItem } from "../types";

const SIZE_MODIFIER_PATTERN = /\(\+?(\d[\d.,]*)\s*K\)/i;

export function parseSizeModifier(sizeName: string): number {
  const match = sizeName.match(SIZE_MODIFIER_PATTERN);
  if (match) {
    const num = parseFloat(match[1].replace(/,/g, ""));
    return Math.round(num * 1000);
  }
  return 0;
}

export function getMaterialModifier(
  product: Product,
  selectedMaterial: string
): number {
  const mat = product.materials?.find((m) => m.name === selectedMaterial);
  return mat?.priceModifier ?? 0;
}

export function calculateItemPrice(
  product: Product,
  selectedSize: string,
  selectedMaterial: string
): number {
  const materialMod = getMaterialModifier(product, selectedMaterial);
  const sizeMod = parseSizeModifier(selectedSize);
  return product.price + materialMod + sizeMod;
}

export function calculateCartItemTotal(item: CartItem): number {
  return calculateItemPrice(item.product, item.selectedSize, item.selectedMaterial) * item.quantity;
}

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + calculateCartItemTotal(item), 0);
}

export function countCartItems(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
