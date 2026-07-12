const STORAGE_KEY = "len_recently_viewed";
const MAX_ITEMS = 12;

/** Ghi lại sản phẩm vừa xem (mới nhất đứng đầu, không trùng lặp) */
export function recordRecentlyViewed(productId: string): void {
  try {
    const current = getRecentlyViewedIds().filter((id) => id !== productId);
    current.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage đầy hoặc bị chặn — bỏ qua, không chặn UX
  }
}

export function getRecentlyViewedIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}
