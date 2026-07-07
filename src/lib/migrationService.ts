import { db } from "./firebase";
import { writeBatch, doc, getDoc } from "firebase/firestore";
import { Category, Product, ProductVariant } from "../types";

export interface MigrationPreview {
  categories: {
    total: number;
    new: number;
    existing: number;
    items: Category[];
  };
  products: {
    total: number;
    new: number;
    existing: number;
    items: Product[];
  };
  variants: {
    total: number;
    new: number;
    existing: number;
    items: ProductVariant[];
  };
}

export interface MigrationResult {
  success: boolean;
  categoriesCreated: number;
  productsCreated: number;
  variantsCreated: number;
  errors: string[];
}

const MIGRATION_STATUS_KEY = "len_migration_completed";

/**
 * Check if migration has already been completed.
 */
export function isMigrationCompleted(): boolean {
  return localStorage.getItem(MIGRATION_STATUS_KEY) === "true";
}

/**
 * Mark migration as completed.
 */
export function markMigrationCompleted(): void {
  localStorage.setItem(MIGRATION_STATUS_KEY, "true");
}

/**
 * Reset migration status (for testing).
 */
export function resetMigrationStatus(): void {
  localStorage.removeItem(MIGRATION_STATUS_KEY);
}

/**
 * Preview migration: check which items exist in Firestore and which are new.
 */
export async function previewMigration(
  categories: Category[],
  products: Product[],
  variants: ProductVariant[]
): Promise<MigrationPreview> {
  if (!db) throw new Error("Firestore not initialized");

  const preview: MigrationPreview = {
    categories: { total: categories.length, new: 0, existing: 0, items: [] },
    products: { total: products.length, new: 0, existing: 0, items: [] },
    variants: { total: variants.length, new: 0, existing: 0, items: [] }
  };

  // Check categories
  for (const cat of categories) {
    const snap = await getDoc(doc(db, "categories", cat.id));
    if (snap.exists()) {
      preview.categories.existing++;
    } else {
      preview.categories.new++;
      preview.categories.items.push(cat);
    }
  }

  // Check products
  for (const prod of products) {
    const snap = await getDoc(doc(db, "products", prod.id));
    if (snap.exists()) {
      preview.products.existing++;
    } else {
      preview.products.new++;
      preview.products.items.push(prod);
    }
  }

  // Check variants
  for (const variant of variants) {
    const snap = await getDoc(doc(db, "productVariants", variant.id));
    if (snap.exists()) {
      preview.variants.existing++;
    } else {
      preview.variants.new++;
      preview.variants.items.push(variant);
    }
  }

  return preview;
}

/**
 * Execute migration: write new items to Firestore in batches.
 */
export async function executeMigration(preview: MigrationPreview): Promise<MigrationResult> {
  if (!db) throw new Error("Firestore not initialized");

  const result: MigrationResult = {
    success: true,
    categoriesCreated: 0,
    productsCreated: 0,
    variantsCreated: 0,
    errors: []
  };

  try {
    // Batch write categories (max 500 per batch)
    const categoryBatches = chunkArray(preview.categories.items, 500);
    for (const batch of categoryBatches) {
      const writeBatchRef = writeBatch(db);
      batch.forEach((cat) => {
        const docRef = doc(db, "categories", cat.id);
        writeBatchRef.set(docRef, cat);
      });
      await writeBatchRef.commit();
      result.categoriesCreated += batch.length;
    }

    // Batch write products (max 500 per batch)
    const productBatches = chunkArray(preview.products.items, 500);
    for (const batch of productBatches) {
      const writeBatchRef = writeBatch(db);
      batch.forEach((prod) => {
        const docRef = doc(db, "products", prod.id);
        writeBatchRef.set(docRef, prod);
      });
      await writeBatchRef.commit();
      result.productsCreated += batch.length;
    }

    // Batch write variants (max 500 per batch)
    const variantBatches = chunkArray(preview.variants.items, 500);
    for (const batch of variantBatches) {
      const writeBatchRef = writeBatch(db);
      batch.forEach((variant) => {
        const docRef = doc(db, "productVariants", variant.id);
        writeBatchRef.set(docRef, variant);
      });
      await writeBatchRef.commit();
      result.variantsCreated += batch.length;
    }

    markMigrationCompleted();
  } catch (error: any) {
    result.success = false;
    result.errors.push(error.message || "Unknown error");
  }

  return result;
}

/**
 * Chunk array into smaller arrays of specified size.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
