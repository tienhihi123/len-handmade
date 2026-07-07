import { CATEGORIES, PRODUCTS } from "../data";
import { SAMPLE_PRODUCT_VARIANTS } from "../data/sampleData";
import type { Category, Product, ProductVariant } from "../types";

export interface MigrationValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MigrationSourceCounts {
  categories: number;
  products: number;
  variants: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Date) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively clones a value, dropping `undefined` properties at every depth
 * (Firestore rejects `undefined` unless ignoreUndefinedProperties is set, which
 * we intentionally avoid enabling).
 */
function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) return value;
  if (value === null) return value;
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (value instanceof Date) return value;
  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val === undefined) continue;
      result[key] = sanitizeForFirestore(val);
    }
    return result as unknown as T;
  }
  return value;
}

/** Recursively finds any remaining `undefined` values and reports their path. */
function findUndefinedPaths(value: unknown, path: string, paths: string[]): void {
  if (value === undefined) {
    paths.push(path || "<root>");
    return;
  }
  if (value === null || value instanceof Date) return;
  if (Array.isArray(value)) {
    value.forEach((item, idx) => findUndefinedPaths(item, `${path}[${idx}]`, paths));
    return;
  }
  if (isPlainObject(value)) {
    for (const [key, val] of Object.entries(value)) {
      findUndefinedPaths(val, path ? `${path}.${key}` : key, paths);
    }
  }
}

export const migrationCategories: Category[] = CATEGORIES.map((cat) => sanitizeForFirestore(cat));
export const migrationProducts: Product[] = PRODUCTS.map((prod) => sanitizeForFirestore(prod));
export const migrationVariants: ProductVariant[] = SAMPLE_PRODUCT_VARIANTS.map((variant) =>
  sanitizeForFirestore(variant)
);

export const migrationSourceCounts: MigrationSourceCounts = {
  categories: migrationCategories.length,
  products: migrationProducts.length,
  variants: migrationVariants.length
};

function findDuplicateIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return Array.from(duplicates);
}

function validateMigrationSource(): MigrationValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // A. Required IDs
  migrationCategories.forEach((cat, idx) => {
    if (!cat.id || !cat.id.trim()) errors.push(`Category at index ${idx} is missing a valid id`);
  });
  migrationProducts.forEach((prod, idx) => {
    if (!prod.id || !prod.id.trim()) errors.push(`Product at index ${idx} is missing a valid id`);
  });
  migrationVariants.forEach((variant, idx) => {
    if (!variant.id || !variant.id.trim()) errors.push(`Variant at index ${idx} is missing a valid id`);
    if (!variant.productId || !variant.productId.trim()) {
      errors.push(`Variant "${variant.id || `index ${idx}`}" is missing a valid productId`);
    }
  });

  // B. Duplicate IDs
  const duplicateCategoryIds = findDuplicateIds(migrationCategories.map((c) => c.id));
  if (duplicateCategoryIds.length > 0) {
    errors.push(`Duplicate category IDs: ${duplicateCategoryIds.join(", ")}`);
  }
  const duplicateProductIds = findDuplicateIds(migrationProducts.map((p) => p.id));
  if (duplicateProductIds.length > 0) {
    errors.push(`Duplicate product IDs: ${duplicateProductIds.join(", ")}`);
  }
  const duplicateVariantIds = findDuplicateIds(migrationVariants.map((v) => v.id));
  if (duplicateVariantIds.length > 0) {
    errors.push(`Duplicate variant IDs: ${duplicateVariantIds.join(", ")}`);
  }

  // C. Category references (informational — product.category is a free-text label,
  // not a foreign key, so a mismatch is a data-quality warning, not a blocker)
  const categoryNames = new Set(migrationCategories.map((c) => c.name));
  migrationProducts.forEach((prod) => {
    if (prod.category && prod.category.trim() && !categoryNames.has(prod.category)) {
      warnings.push(`Product "${prod.id}" references unknown category "${prod.category}"`);
    }
  });

  // D. Variant -> product references
  const productIds = new Set(migrationProducts.map((p) => p.id));
  migrationVariants.forEach((variant) => {
    if (variant.productId && !productIds.has(variant.productId)) {
      errors.push(`Variant "${variant.id}" references missing productId "${variant.productId}"`);
    }
  });

  // E. Undefined values remaining after sanitization
  const undefinedPaths: string[] = [];
  migrationCategories.forEach((cat) => findUndefinedPaths(cat, `Category(${cat.id})`, undefinedPaths));
  migrationProducts.forEach((prod) => findUndefinedPaths(prod, `Product(${prod.id})`, undefinedPaths));
  migrationVariants.forEach((variant) =>
    findUndefinedPaths(variant, `Variant(${variant.id})`, undefinedPaths)
  );
  if (undefinedPaths.length > 0) {
    errors.push(`Undefined values remain after sanitization: ${undefinedPaths.join(", ")}`);
  }

  const valid = errors.length === 0;
  if (!valid) {
    // eslint-disable-next-line no-console
    console.error("[migrationSource] validation failed:", errors);
  }

  return { valid, errors, warnings };
}

export const migrationValidation: MigrationValidation = validateMigrationSource();
