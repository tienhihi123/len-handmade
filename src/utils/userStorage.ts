import { DemoUser, CartItem, LoggedOrder, Product } from "../types";

// User storage keys generator
export function getUserStorageKey(userId: string, key: string): string {
  return `lenhandmade_user_${userId}_${key}`;
}

// Get the current logged-in user
export function getCurrentUser(): DemoUser | null {
  const saved = localStorage.getItem("lenhandmade_current_user");
  return saved ? JSON.parse(saved) : null;
}

// Set the current logged-in user
export function setCurrentUser(user: DemoUser | null): void {
  if (user) {
    localStorage.setItem("lenhandmade_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("lenhandmade_current_user");
  }
}

// User-specific Cart helpers
export function getUserCart(userId: string): CartItem[] {
  const saved = localStorage.getItem(getUserStorageKey(userId, "cart"));
  return saved ? JSON.parse(saved) : [];
}

export function saveUserCart(userId: string, cart: CartItem[]): void {
  localStorage.setItem(getUserStorageKey(userId, "cart"), JSON.stringify(cart));
}

// User-specific Favorites helpers
export function getUserFavorites(userId: string): string[] {
  const saved = localStorage.getItem(getUserStorageKey(userId, "favorites"));
  return saved ? JSON.parse(saved) : [];
}

export function saveUserFavorites(userId: string, favorites: string[]): void {
  localStorage.setItem(getUserStorageKey(userId, "favorites"), JSON.stringify(favorites));
}

// Default seed orders for demo accounts
function getDefaultSeedOrders(): LoggedOrder[] {
  return [
    { 
      id: "ORD-9302-WEAVE", 
      orderCode: "LH-20260601-901",
      name: "Túi Len Hồng Handmade (x1)", 
      itemsCount: 1, 
      totalPrice: 380400, 
      time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), 
      status: "Đang chuẩn bị hàng", 
      customerName: "Khách hàng mộc mạc", 
      customerEmail: "khachhang@gmail.com" 
    },
    { 
      id: "ORD-1102-SPRING", 
      orderCode: "LH-20260602-902",
      name: "Áo Len Bướm Handmade (x1)", 
      itemsCount: 1, 
      totalPrice: 100000, 
      time: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), 
      status: "Hoàn tất", 
      customerName: "Khách hàng mộc mạc", 
      customerEmail: "khachhang@gmail.com" 
    }
  ];
}

// User-specific Orders helpers — pure getter, no side effects
export function getUserOrders(userId: string): LoggedOrder[] {
  const saved = localStorage.getItem(getUserStorageKey(userId, "orders"));
  return saved ? JSON.parse(saved) : [];
}

// Seed a new user's orders with demo data (call explicitly on registration)
export function seedUserOrders(userId: string): LoggedOrder[] {
  const defaults = getDefaultSeedOrders();
  localStorage.setItem(getUserStorageKey(userId, "orders"), JSON.stringify(defaults));
  return defaults;
}

export function saveUserOrders(userId: string, orders: LoggedOrder[]): void {
  localStorage.setItem(getUserStorageKey(userId, "orders"), JSON.stringify(orders));
}

// User-specific Viewed Products helpers
export function getUserViewedProducts(userId: string): string[] {
  const saved = localStorage.getItem(getUserStorageKey(userId, "viewedProducts"));
  return saved ? JSON.parse(saved) : [];
}

export function saveUserViewedProducts(userId: string, products: string[]): void {
  localStorage.setItem(getUserStorageKey(userId, "viewedProducts"), JSON.stringify(products));
}

// Manual or social registration lookup
export function loginUser(email: string, provider: "email" | "google" | "facebook" | "apple" = "email", customName?: string, customAvatar?: string): DemoUser {
  const lowerEmail = email.toLowerCase().trim();
  const userId = `usr_${provider}_${lowerEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
  
  // Try retrieving user profile
  const profileKey = `lenhandmade_user_${userId}_profile`;
  const existingProfile = localStorage.getItem(profileKey);
  
  let user: DemoUser;
  if (existingProfile) {
    user = JSON.parse(existingProfile);
    user.lastLoginAt = new Date().toISOString();
    user.totalLoginCount += 1;
    if (customAvatar) {
      user.avatar = customAvatar;
    }
  } else {
    // Generate new mock user profile
    const providerNames: Record<string, string> = {
      google: "Nàng thơ Google",
      facebook: "Nàng thơ Facebook",
      apple: "Nàng thơ Apple",
      email: "Nàng thơ Đan Len"
    };
    const defaultName = customName || `${providerNames[provider]} (${lowerEmail.split("@")[0]})`;
    const avatarUrl = customAvatar || (provider === "google" 
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      : provider === "facebook"
      ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
      : provider === "apple"
      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150");

    user = {
      id: userId,
      name: defaultName,
      email: lowerEmail,
      role: "customer",
      status: "active",
      avatar: avatarUrl,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalLoginCount: 1,
      coins: 2000 // 2000 starting coins
    };
  }
  
  // Save profile and set active session
  localStorage.setItem(profileKey, JSON.stringify(user));
  setCurrentUser(user);
  return user;
}

// Check if a user profile exists in localStorage (for fallback login validation)
export function findExistingUser(email: string, provider: "email" | "google" | "facebook" | "apple" = "email"): DemoUser | null {
  const lowerEmail = email.toLowerCase().trim();
  const userId = `usr_${provider}_${lowerEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const profileKey = `lenhandmade_user_${userId}_profile`;
  const saved = localStorage.getItem(profileKey);
  return saved ? JSON.parse(saved) : null;
}

// Log out user
export function logoutUser(): void {
  setCurrentUser(null);
}
