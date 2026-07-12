import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Product, CartItem, BlogPost, Review, Category, DemoUser, LoggedOrder, Customer, OrderNotification, InventoryLog, ProductVariant, RevenueDataPoint, TopProduct } from "../types";
import {
  SAMPLE_CUSTOMERS, SAMPLE_ORDERS, SAMPLE_NOTIFICATIONS, SAMPLE_INVENTORY_LOGS,
  SAMPLE_PRODUCT_VARIANTS, SAMPLE_REVENUE_DATA, SAMPLE_TOP_PRODUCTS
} from "../data/sampleData";
import { CATEGORIES, PRODUCTS, REVIEWS, BLOGS } from "../data";
import { BRAND_NAME, BRAND_DOMAIN } from "../constants/brand";
import { auth, onAuthStateChanged, signOut, isFirebaseConfigured } from "../lib/firebase";
import { getActiveStaff } from "../lib/staffService";
import { subscribeToCategories, upsertCategory } from "../lib/categoryService";
import { subscribeToProducts, upsertProduct, updateProductFields } from "../lib/productService";
import { subscribeToVariants, upsertVariant } from "../lib/variantService";
import { subscribeToInventoryTransactions, adjustVariantStock as firestoreAdjustStock } from "../lib/inventoryService";
import { subscribeToUserOrders } from "../lib/firestoreOrders";
import { 
  UserRole, UserActivityLog, ProductViewStats, Coupon, Mission, Banner, MarketingArticle,
  demoUsers, coupons as initialCoupons, missions as initialMissions, banners as initialBanners, 
  marketingArticles as initialArticles, dashboardStatsByRole, userActivityLogs as initialLogs,
  productViewStats as initialViewStats, addUserActivityLog, trackProductView, sortProductsByMostViewed, loginDemoUser
} from "../data/authAndTracking.mock";
import {
  getCurrentUser,
  setCurrentUser as storageSetCurrentUser,
  getUserCart,
  saveUserCart,
  getUserFavorites,
  saveUserFavorites,
  getUserOrders,
  saveUserOrders,
  loginUser as storageLoginUser,
  logoutUser as storageLogoutUser
} from "../utils/userStorage";

export interface ReturnRequest {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  status: "Chờ xử lý" | "Đã chấp nhận" | "Đã từ chối";
  createdAt: string;
}

interface AppContextType {
  // Authentication
  currentUser: DemoUser | null;
  setCurrentUser: (user: DemoUser | null) => void;
  loginUser: (email: string, provider?: "email" | "google" | "facebook" | "apple", customName?: string, customAvatar?: string) => void;
  logoutUser: () => void;
  
  // Products, Categories, Reviews, Blogs (Live Mutable so Admin can change them)
  productsList: Product[];
  setProductsList: React.Dispatch<React.SetStateAction<Product[]>>;
  categoriesList: Category[];
  setCategoriesList: React.Dispatch<React.SetStateAction<Category[]>>;
  blogsList: BlogPost[];
  setBlogsList: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  reviewsList: Review[];
  setReviewsList: React.Dispatch<React.SetStateAction<Review[]>>;
  marketingArticles: MarketingArticle[];
  setMarketingArticles: React.Dispatch<React.SetStateAction<MarketingArticle[]>>;
  
  // Custom states
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  ordersList: LoggedOrder[];
  setOrdersList: React.Dispatch<React.SetStateAction<LoggedOrder[]>>;
  returnRequests: ReturnRequest[];
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  
  // Marketing & Gamification
  activeCoupons: Coupon[];
  setActiveCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
  activeMissions: Mission[];
  setActiveMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  activeBanners: Banner[];
  setActiveBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  coinsWallet: number;
  setCoinsWallet: React.Dispatch<React.SetStateAction<number>>;
  
  // Tracking & Telemetry Logs
  logs: UserActivityLog[];
  viewStats: ProductViewStats[];
  trackView: (productId: string, productName: string, category: string) => void;
  addActivity: (action: string, targetId?: string, targetName?: string, targetType?: string) => void;
  
  // === NEW: Business Data ===
  // Customer Management
  customersList: Customer[];
  setCustomersList: React.Dispatch<React.SetStateAction<Customer[]>>;
  
  // Notifications
  notificationsList: OrderNotification[];
  setNotificationsList: React.Dispatch<React.SetStateAction<OrderNotification[]>>;
  sendNotification: (order: LoggedOrder, newStatus: LoggedOrder["status"]) => void;

  // Inventory (per-variant)
  productVariants: ProductVariant[];
  setProductVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
  inventoryLogs: InventoryLog[];
  setInventoryLogs: React.Dispatch<React.SetStateAction<InventoryLog[]>>;
  adjustVariantStock: (variantId: string, change: number, reason: string) => void;

  // Revenue
  revenueData: RevenueDataPoint[];
  topProducts: TopProduct[];

  // All orders (global: user orders + sample orders combined)
  allOrders: LoggedOrder[];
  updateOrderStatus: (orderId: string, newStatus: LoggedOrder["status"]) => void;
  refreshOrders: () => void;
  ordersLoading: boolean;

  // Utilities
  hasPermission: (permission: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load initial guest or Customer
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    return getCurrentUser();
  });

  // Database of Products
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem("len_products");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Product[];
        const sourceIds = new Set(PRODUCTS.map(product => product.id));
        const refreshedSourceProducts = PRODUCTS.map(product => {
          const savedProduct = parsed.find(item => item.id === product.id);
          return savedProduct ? { ...savedProduct, ...product } : product;
        });
        const userCreatedProducts = parsed.filter(product => !sourceIds.has(product.id));
        return [...refreshedSourceProducts, ...userCreatedProducts];
      } catch (e) {
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });

  // Database of Categories (editable so Admin can rename/add/delete)
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
    const saved = localStorage.getItem("len_categories");
    return saved ? JSON.parse(saved) : CATEGORIES;
  });
  useEffect(() => {
    localStorage.setItem("len_categories", JSON.stringify(categoriesList));
  }, [categoriesList]);

  // Firestore is the source of truth once reachable — subscribe to real-time updates.
  // Migration from localStorage to Firestore is handled manually via Admin migration tool.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToCategories((remote) => {
      setCategoriesList(remote);
    });
    return unsubscribe;
  }, []);

  // DB of Reviews
  const [reviewsList, setReviewsList] = useState<Review[]>(() => {
    const saved = localStorage.getItem("len_reviews");
    return saved ? JSON.parse(saved) : REVIEWS;
  });

  // DB of Blog posts — the SAME real content shown on the storefront /blog page,
  // so Admin edits actually change what customers see (not a disconnected mock list).
  // Seed posts (matched by id) always refresh from BLOGS so content/image fixes ship
  // immediately, while brand new posts an admin writes are preserved as-is.
  const [blogsList, setBlogsList] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem("len_blogs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as BlogPost[];
        const sourceIds = new Set(BLOGS.map(post => post.id));
        const refreshedSourcePosts = BLOGS.map(post => {
          const savedPost = parsed.find(item => item.id === post.id);
          return savedPost ? { ...savedPost, ...post } : post;
        });
        const userCreatedPosts = parsed.filter(post => !sourceIds.has(post.id));
        return [...refreshedSourcePosts, ...userCreatedPosts];
      } catch (e) {
        return BLOGS;
      }
    }
    return BLOGS;
  });
  useEffect(() => {
    localStorage.setItem("len_blogs", JSON.stringify(blogsList));
  }, [blogsList]);

  // DB of marketing articles — same seed-refresh strategy as blogsList above.
  const [marketingArticles, setMarketingArticles] = useState<MarketingArticle[]>(() => {
    const saved = localStorage.getItem("len_marketing_articles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MarketingArticle[];
        const sourceIds = new Set(initialArticles.map(article => article.id));
        const refreshedSourceArticles = initialArticles.map(article => {
          const savedArticle = parsed.find(item => item.id === article.id);
          return savedArticle ? { ...savedArticle, ...article } : article;
        });
        const userCreatedArticles = parsed.filter(article => !sourceIds.has(article.id));
        return [...refreshedSourceArticles, ...userCreatedArticles];
      } catch (e) {
        return initialArticles;
      }
    }
    return initialArticles;
  });

  // E-commerce states (Dynamic based on active user)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const user = getCurrentUser();
    if (user) return getUserCart(user.id);
    const saved = localStorage.getItem("lenhandmade_guest_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const user = getCurrentUser();
    if (user) return getUserFavorites(user.id);
    return [];
  });

  // Orders and Returns
  const [ordersList, setOrdersList] = useState<LoggedOrder[]>(() => {
    const user = getCurrentUser();
    if (user) return getUserOrders(user.id);
    return [];
  });

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem("len_returns");
    if (saved) return JSON.parse(saved);
    return [];
  });

  // Đơn hàng của khách — SUBSCRIBE FIRESTORE REAL-TIME (source of truth khi
  // Firebase đã cấu hình). Admin đổi trạng thái → khách thấy ngay không cần reload.
  const [ordersLoading, setOrdersLoading] = useState<boolean>(isFirebaseConfigured);
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser) {
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    const unsubscribe = subscribeToUserOrders(
      currentUser.id,
      (remoteOrders) => {
        setOrdersList(remoteOrders);
        setOrdersLoading(false);
      },
      () => setOrdersLoading(false)
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const isFirstRender = useRef(true);

  // Load user data upon currentUser login adjustments
  // Skip first render to avoid double-reading localStorage (initial state already loaded via lazy init)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (currentUser) {
      setCart(getUserCart(currentUser.id));
      setWishlist(getUserFavorites(currentUser.id));
      setOrdersList(getUserOrders(currentUser.id));
    } else {
      const guestSaved = localStorage.getItem("lenhandmade_guest_cart");
      setCart(guestSaved ? JSON.parse(guestSaved) : []);
      setWishlist([]);
      setOrdersList([]);
    }
  }, [currentUser]);

  // Admin coupon/campaign states
  const [activeCoupons, setActiveCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("len_coupons");
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [activeMissions, setActiveMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem("len_missions");
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [activeBanners, setActiveBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem("len_banners");
    return saved ? JSON.parse(saved) : initialBanners;
  });

  // Wallet
  const [coinsWallet, setCoinsWallet] = useState<number>(() => {
    const saved = localStorage.getItem("len_coins");
    return saved ? Number(saved) : 5000; // start with 5000 coins for customer
  });

  // Activity logs and view stats
  const [logs, setLogs] = useState<UserActivityLog[]>(() => {
    const saved = localStorage.getItem("len_logs");
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [viewStats, setViewStats] = useState<ProductViewStats[]>(() => {
    const saved = localStorage.getItem("len_view_stats");
    return saved ? JSON.parse(saved) : initialViewStats;
  });

  // Synchronization with LocalStorage
  useEffect(() => {
    localStorage.setItem("len_products", JSON.stringify(productsList));
  }, [productsList]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToProducts((remote) => {
      setProductsList(remote);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    localStorage.setItem("len_reviews", JSON.stringify(reviewsList));
  }, [reviewsList]);

  useEffect(() => {
    localStorage.setItem("len_marketing_articles", JSON.stringify(marketingArticles));
  }, [marketingArticles]);

  // Persists to active user or guest session
  useEffect(() => {
    if (currentUser) {
      saveUserCart(currentUser.id, cart);
    } else {
      localStorage.setItem("lenhandmade_guest_cart", JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    if (currentUser) {
      saveUserFavorites(currentUser.id, wishlist);
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    if (currentUser) {
      saveUserOrders(currentUser.id, ordersList);
    }
  }, [ordersList, currentUser]);

  useEffect(() => {
    localStorage.setItem("len_returns", JSON.stringify(returnRequests));
  }, [returnRequests]);

  useEffect(() => {
    localStorage.setItem("len_coupons", JSON.stringify(activeCoupons));
  }, [activeCoupons]);

  useEffect(() => {
    localStorage.setItem("len_missions", JSON.stringify(activeMissions));
  }, [activeMissions]);

  useEffect(() => {
    localStorage.setItem("len_banners", JSON.stringify(activeBanners));
  }, [activeBanners]);

  useEffect(() => {
    localStorage.setItem("len_coins", coinsWallet.toString());
  }, [coinsWallet]);

  useEffect(() => {
    localStorage.setItem("len_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("len_view_stats", JSON.stringify(viewStats));
  }, [viewStats]);

  // Set up Firebase Auth State Listener
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const lowerEmail = firebaseUser.email || `firebase_${firebaseUser.uid}@lenhandmade.vn`;
          const customName = firebaseUser.displayName || `Nàng thơ Dệt Sợi`;

          const profileKey = `lenhandmade_user_${firebaseUser.uid}_profile`;
          const existingProfile = localStorage.getItem(profileKey);

          let demoUser: DemoUser;

          // Check Firestore staff/{uid} instead of mock data
          const staffDoc = await getActiveStaff(firebaseUser.uid);
          const mappedDemoUser = demoUsers.find(u => u.email.toLowerCase() === lowerEmail);

          if (staffDoc && staffDoc.status === "active") {
            // Staff session from Firestore — always fresh, never cached
            demoUser = {
              id: firebaseUser.uid,
              name: staffDoc.displayName,
              email: lowerEmail,
              role: staffDoc.roleId === "admin" ? "admin" : "store_owner",
              status: "active",
              avatar: firebaseUser.photoURL || staffDoc.avatar,
              createdAt: staffDoc.createdAt,
              lastLoginAt: new Date().toISOString(),
              totalLoginCount: 1
            };
          } else if (mappedDemoUser) {
            demoUser = {
              ...mappedDemoUser,
              role: mappedDemoUser.role as DemoUser["role"],
              lastLoginAt: new Date().toISOString(),
              totalLoginCount: mappedDemoUser.totalLoginCount + 1,
              avatar: firebaseUser.photoURL || mappedDemoUser.avatar
            };
          } else if (existingProfile) {
            demoUser = JSON.parse(existingProfile);
            demoUser.lastLoginAt = new Date().toISOString();
            demoUser.totalLoginCount += 1;
            if (firebaseUser.photoURL) {
              demoUser.avatar = firebaseUser.photoURL;
            }
          } else {
            // Regular customer
            demoUser = {
              id: firebaseUser.uid,
              name: customName,
              email: lowerEmail,
              role: "customer",
              status: "active",
              avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              totalLoginCount: 1
            };
          }

          localStorage.setItem(profileKey, JSON.stringify(demoUser));
          storageSetCurrentUser(demoUser);
          setCurrentUser(demoUser);

          // Add login activity log
          const logItem: UserActivityLog = {
            id: `log_${Date.now()}`,
            userId: firebaseUser.uid,
            userName: customName,
            role: demoUser.role,
            action: "Đăng nhập hệ thống (Firebase)",
            createdAt: new Date().toISOString()
          };
          setLogs(prev => [logItem, ...prev]);
        } else {
          // If signed out from Firebase, check if the current active session in localStorage is a Firebase user
          const current = getCurrentUser();
          if (current && !current.id.startsWith("usr_")) {
            storageSetCurrentUser(null);
            setCurrentUser(null);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Auth logins handler
  const loginUser = (email: string, provider: "email" | "google" | "facebook" | "apple" = "email", customName?: string, customAvatar?: string) => {
    const fullUser = storageLoginUser(email, provider, customName, customAvatar);
    setCurrentUser(fullUser);
    
    // Update our reactive telemetry log
    const logItem: UserActivityLog = {
      id: `log_${Date.now()}`,
      userId: fullUser.id,
      userName: fullUser.name,
      role: fullUser.role,
      action: "Đăng nhập hệ thống",
      createdAt: new Date().toISOString()
    };
    setLogs(prev => [logItem, ...prev]);
  };

  const logoutUser = () => {
    if (currentUser) {
      if (auth && !currentUser.id.startsWith("usr_")) {
        try {
          signOut(auth);
        } catch (e) {
          console.error("Error signing out from Firebase Auth:", e);
        }
      }

      const logItem: UserActivityLog = {
        id: `log_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        role: "customer",
        action: "Đăng xuất hệ thống",
        createdAt: new Date().toISOString()
      };
      setLogs(prev => [logItem, ...prev]);
    }
    storageLogoutUser();
    setCurrentUser(null);
  };


  // Tracking products views
  const trackView = (productId: string, productName: string, category: string) => {
    // Only track once per product per browser session to prevent double-counting or re-render increments
    try {
      const viewedKey = "len_viewed_product_ids";
      const viewedStr = sessionStorage.getItem(viewedKey) || "[]";
      const viewedIds: string[] = JSON.parse(viewedStr);
      if (viewedIds.includes(productId)) {
        return; // Already tracked in this session
      }
      viewedIds.push(productId);
      sessionStorage.setItem(viewedKey, JSON.stringify(viewedIds));
    } catch (e) {
      console.warn("sessionStorage is not available, falling back:", e);
    }

    // Increment memory state stats
    setViewStats(prev => {
      const exists = prev.find(p => p.productId === productId);
      if (exists) {
        return prev.map(p => 
          p.productId === productId 
            ? { ...p, totalViews: p.totalViews + 1, lastViewedAt: new Date().toISOString() } 
            : p
        );
      } else {
        return [...prev, {
          productId,
          productName,
          category,
          totalViews: 1,
          uniqueViewers: 1,
          lastViewedAt: new Date().toISOString(),
          viewedByUserIds: currentUser ? [currentUser.id] : []
        }];
      }
    });

    // Logging line
    addActivity("Xem sản phẩm", productId, productName, "product");
  };

  // Add general activity log line
  const addActivity = (action: string, targetId?: string, targetName?: string, targetType?: string) => {
    const newLogItem: UserActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser ? currentUser.id : "guest",
      userName: currentUser ? currentUser.name : "Khách ẩn danh",
      role: currentUser ? currentUser.role : "customer",
      action,
      targetId,
      targetName,
      targetType,
      createdAt: new Date().toISOString()
    };
    setLogs(prev => [newLogItem, ...prev]);
  };

  // Validate user permissions helper
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === "admin") return true;
    
    // Custom check from roles permission mapping
    const roleMap: Record<UserRole, string[]> = {
      admin: ["all"],
      store_owner: [
        "view_dashboard", "manage_products", "manage_inventory", "manage_orders", 
        "manage_staff", "view_reports", "manage_marketing", "manage_coupons", 
        "manage_banners", "manage_missions", "manage_coins", "view_user_tracking"
      ],
      marketing_staff: [
        "view_marketing_dashboard", "manage_banners", "manage_coupons", 
        "manage_missions", "manage_marketing_articles", "view_product_analytics"
      ],
      inventory_staff: [
        "view_products", "manage_inventory", "view_stock_history"
      ],
      order_staff: [
        "view_orders", "update_order_status", "manage_shipping"
      ],
      content_staff: [
        "manage_blog", "manage_seo", "manage_marketing_articles"
      ],
      customer: [
        "view_products", "manage_cart", "checkout", "view_own_orders", "use_coins", "use_coupon"
      ]
    };

    const perms = roleMap[currentUser.role] || [];
    return perms.includes("all") || perms.includes(permission);
  };

  // === NEW STATE: Customers ===
  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("len_customers");
    return saved ? JSON.parse(saved) : SAMPLE_CUSTOMERS;
  });
  useEffect(() => { localStorage.setItem("len_customers", JSON.stringify(customersList)); }, [customersList]);

  // === NEW STATE: Notifications ===
  // Starts empty (real notifications only) — the demo SAMPLE_NOTIFICATIONS
  // fixtures are dropped so the admin panel only ever shows messages actually
  // sent by sendNotification() below when a real order's status changes.
  const [notificationsList, setNotificationsList] = useState<OrderNotification[]>(() => {
    const saved = localStorage.getItem("len_notifications");
    if (!saved) return [];
    const sampleIds = new Set(SAMPLE_NOTIFICATIONS.map((n) => n.id));
    return (JSON.parse(saved) as OrderNotification[]).filter((n) => !sampleIds.has(n.id));
  });
  useEffect(() => { localStorage.setItem("len_notifications", JSON.stringify(notificationsList)); }, [notificationsList]);

  // Send notification when order status changes
  const sendNotification = (order: LoggedOrder, newStatus: LoggedOrder["status"]) => {
    const typeMap: Record<string, OrderNotification["type"]> = {
      "Đã xác nhận": "confirmed",
      "Đang chuẩn bị hàng": "preparing",
      "Đang giao": "shipping",
      "Hoàn tất": "completed",
      "Đã hủy": "cancelled"
    };
    const msgMap: Record<string, string> = {
      "Đã xác nhận": `✔️ Đơn hàng ${order.orderCode || order.id} đã được xác nhận! Chúng mình sẽ bắt đầu chuẩn bị hàng cho ${order.customerName} ngay 🎀`,
      "Đang chuẩn bị hàng": `🧶 Đơn hàng ${order.orderCode || order.id} đang được chuẩn bị! Nghệ nhân len đang hoàn thiện sản phẩm cho ${order.customerName} 💕`,
      "Đang giao": `🚚 Đơn hàng ${order.orderCode || order.id} đang trên đường giao đến bạn! Shipper sẽ liên hệ sớm. Cảm ơn ${order.customerName} 🌸`,
      "Hoàn tất": `✅ Đơn hàng ${order.orderCode || order.id} đã giao thành công! Cảm ơn ${order.customerName} đã tin tưởng ${BRAND_NAME} 🧶💕`,
      "Đã hủy": `❌ Đơn hàng ${order.orderCode || order.id} đã bị hủy. ${BRAND_NAME} rất tiếc và mong được phục vụ ${order.customerName} trong lần tới 💙`
    };
    if (!typeMap[newStatus]) return;
    const notif: OrderNotification = {
      id: `notif_${Date.now()}`,
      orderId: order.id,
      orderCode: order.orderCode || order.id,
      type: typeMap[newStatus],
      receiver: order.customerEmail || order.customerPhone || `khachhang@${BRAND_DOMAIN}`,
      message: msgMap[newStatus] || `Đơn hàng ${order.orderCode || order.id} đã cập nhật trạng thái: ${newStatus}`,
      status: "sent",
      channel: "email",
      createdAt: new Date().toISOString()
    };
    setNotificationsList(prev => [notif, ...prev]);
  };

  // === NEW STATE: Product Variants (Inventory) ===
  const [productVariants, setProductVariants] = useState<ProductVariant[]>(() => {
    const saved = localStorage.getItem("len_variants");
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCT_VARIANTS;
  });
  useEffect(() => { localStorage.setItem("len_variants", JSON.stringify(productVariants)); }, [productVariants]);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToVariants((remote) => {
      setProductVariants(remote);
    });
    return unsubscribe;
  }, []);

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem("len_inventory_logs");
    return saved ? JSON.parse(saved) : SAMPLE_INVENTORY_LOGS;
  });
  useEffect(() => { localStorage.setItem("len_inventory_logs", JSON.stringify(inventoryLogs)); }, [inventoryLogs]);

  // Subscribe to inventory transactions from Firestore
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = subscribeToInventoryTransactions((remote) => {
      if (remote.length > 0) {
        setInventoryLogs(remote);
      }
    });
    return unsubscribe;
  }, []);

  const adjustVariantStock = async (variantId: string, change: number, reason: string) => {
    if (!isFirebaseConfigured) {
      // Fallback to localStorage if Firestore not available
      setProductVariants(prev => {
        let touched: ProductVariant | null = null;
        const next = prev.map(v => {
          if (v.id !== variantId) return v;
          const newQty = Math.max(0, v.stockQuantity + change);
          const newStatus: ProductVariant["status"] = newQty === 0 ? "out-of-stock" : newQty <= 5 ? "low-stock" : "in-stock";
          const log: InventoryLog = {
            id: `log_inv_${Date.now()}`,
            productId: v.productId,
            productName: v.productName,
            variantId: v.id,
            color: v.color,
            size: v.size,
            changeType: change < 0 ? "sale" : "restock",
            quantityChanged: change,
            previousStock: v.stockQuantity,
            newStock: newQty,
            reason,
            createdAt: new Date().toISOString()
          };
          setInventoryLogs(prev2 => [log, ...prev2]);
          touched = { ...v, stockQuantity: newQty, status: newStatus };
          return touched;
        });
        if (touched) {
          const productId = touched.productId;
          const aggregate = next.filter(v => v.productId === productId).reduce((sum, v) => sum + v.stockQuantity, 0);
          setProductsList(prevProducts => prevProducts.map(p => p.id === productId ? { ...p, stock: aggregate } : p));
        }
        return next;
      });
      return;
    }

    // Use Firestore transaction for atomic stock adjustment
    try {
      const changeType: "restock" | "sale" | "adjustment" | "return" =
        change < 0 ? "sale" : change > 0 ? "restock" : "adjustment";
      const { variant: updated, log } = await firestoreAdjustStock(variantId, change, reason, changeType);

      // Update local state to reflect Firestore changes
      setProductVariants(prev => prev.map(v => v.id === variantId ? updated : v));
      setInventoryLogs(prev => [log, ...prev]);

      // Sync product-level aggregate stock
      const productId = updated.productId;
      const aggregate = productVariants
        .filter(v => v.productId === productId)
        .reduce((sum, v) => sum + (v.id === variantId ? updated.stockQuantity : v.stockQuantity), 0);
      setProductsList(prevProducts => prevProducts.map(p => p.id === productId ? { ...p, stock: aggregate } : p));
      await updateProductFields(productId, { stock: aggregate });
    } catch (error) {
      console.error("adjustVariantStock error:", error);
      throw error;
    }
  };

  // Revenue data (static for demo)
  const revenueData = SAMPLE_REVENUE_DATA;
  const topProducts = SAMPLE_TOP_PRODUCTS;

  // Global all orders — khi Firebase đã cấu hình thì CHỈ dùng đơn thật từ
  // Firestore; SAMPLE_ORDERS chỉ là fallback demo khi chưa cấu hình Firebase.
  const allOrders = isFirebaseConfigured
    ? ordersList
    : [
        ...ordersList,
        ...SAMPLE_ORDERS.filter(s => !ordersList.some(o => o.id === s.id))
      ];

  // Update order status across all orders (handles both user orders and sample orders)
  const updateOrderStatus = (orderId: string, newStatus: LoggedOrder["status"]) => {
    const targetOrder = allOrders.find(o => o.id === orderId);
    setOrdersList(prev => {
      const inUserOrders = prev.some(o => o.id === orderId);
      if (inUserOrders) {
        return prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      } else {
        // Promote sample order into user state so it can be updated
        const sampleOrder = SAMPLE_ORDERS.find(s => s.id === orderId);
        if (sampleOrder) return [{ ...sampleOrder, status: newStatus }, ...prev];
        return prev;
      }
    });
    if (targetOrder) sendNotification(targetOrder, newStatus);
  };

  // Re-reads this user's orders from localStorage — picks up changes written
  // by another browser tab (e.g. a customer completing checkout) without a full reload.
  const refreshOrders = () => {
    const user = getCurrentUser();
    if (user) setOrdersList(getUserOrders(user.id));
  };

  // Demo simulation ticker — disabled by default to avoid unnecessary re-renders.
  // Enable by setting localStorage("len_demo_mode", "true") for admin demo.
  const [demoMode] = useState(() => localStorage.getItem("len_demo_mode") === "true");

  useEffect(() => {
    if (!demoMode) return;

    const interval = setInterval(() => {
      const randProd = productsList[Math.floor(Math.random() * productsList.length)];
      if (randProd) {
        setViewStats(prev => {
          return prev.map(p => 
            p.productId === randProd.id 
              ? { ...p, totalViews: p.totalViews + Math.floor(Math.random() * 2) + 1, lastViewedAt: new Date().toISOString() } 
              : p
          );
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [demoMode, productsList, setViewStats]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
        
        productsList,
        setProductsList,
        categoriesList,
        setCategoriesList,
        blogsList,
        setBlogsList,
        reviewsList,
        setReviewsList,
        marketingArticles,
        setMarketingArticles,
        
        cart,
        setCart,
        wishlist,
        setWishlist,
        ordersList,
        setOrdersList,
        returnRequests,
        setReturnRequests,
        
        activeCoupons,
        setActiveCoupons,
        activeMissions,
        setActiveMissions,
        activeBanners,
        setActiveBanners,
        coinsWallet,
        setCoinsWallet,
        
        logs,
        viewStats,
        trackView,
        addActivity,
        
        // === NEW: Business Data ===
        customersList,
        setCustomersList,
        notificationsList,
        setNotificationsList,
        sendNotification,
        productVariants,
        setProductVariants,
        inventoryLogs,
        setInventoryLogs,
        adjustVariantStock,
        revenueData,
        topProducts,
        allOrders,
        updateOrderStatus,
        refreshOrders,
        ordersLoading,

        hasPermission
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider context!");
  }
  return context;
}
